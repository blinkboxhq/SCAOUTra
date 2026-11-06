# Scoutra Lantern: Phase 0 plan

Status: **draft for approval.** No application code has been written. Section 14 lists the decisions I need from you.

Written 6 November 2026. Prices and product facts below were checked on that date where a source is cited. Prices marked *(indicative)* come from memory or public price lists that change often. I will re-check them before we commit to anything.

---

## 0. Read this first: three findings that affect your decisions

1. **This repository is public.** `blinkboxhq/SCAOUTra` is the public marketing site and deploys to GitHub Pages. Lantern will hold personal data, so its code, seed data and issues should live in a **new private repository** (proposed name `blinkboxhq/scoutra-lantern`). The code itself holds no personal data, but a private repo removes a whole class of mistakes, such as a test fixture with a real name in it. This plan sits here only because you asked for `docs/PLAN.md` in this repo. It contains nothing more sensitive than your brief did.
2. **Claude still cannot take audio as input.** I checked this against the current Claude API docs ([Files API, file types](https://platform.claude.com/docs/en/build-with-claude/files)). The accepted inputs are text, PDF and images (plus files for the code-execution sandbox). There is no audio content block. So Lantern needs a separate speech-to-text step, as your brief assumed. Nothing has changed here.
3. **The first-party Claude API has no EU processing option today.** Per the [data residency docs](https://platform.claude.com/docs/en/manage-claude/data-residency), `inference_geo` only accepts `"global"` or `"us"`, and workspace storage geo is `"us"` only. This conflicts with your rule "EU hosting for anything that is hosted". The workable EU routes are **Claude on AWS Bedrock in an EU region** or **Claude on Google Cloud Vertex AI in an EU region** (for example `europe-west4`, which is in the Netherlands). I still have to confirm that the model we want is offered in those EU regions (see section 4.3). This is decision **D3**.

---

## 1. Architecture

### 1.1 Shape

One small web app, one database, and two background workers. Everything runs in Docker Compose on one EU machine, or on Aaina's Mac during the interim setup.

```
 Phone / laptop browser (installable PWA)
        │  HTTPS (Caddy, automatic TLS)
        ▼
 ┌──────────────────────────┐        ┌───────────────────────────┐
 │ app  (Node + TypeScript) │        │ worker-ai (Node + TS)     │
 │ - Hono API               │        │ - cleanup, translate,     │
 │ - serves React PWA       │◀──────▶│   extract, match, letter  │
 │ - auth, consent gate     │  jobs  │ - Claude via EU endpoint  │
 │ - cost cap check         │ (pg-   │ - Zod validation, quote   │
 └────────────┬─────────────┘ boss)  │   check, cost metering    │
              │                      └─────────────┬─────────────┘
              ▼                                    │
 ┌──────────────────────────┐        ┌─────────────▼─────────────┐
 │ Postgres 16              │◀──────▶│ worker-stt (Python)       │
 │ - all records            │        │ - ffmpeg prepare          │
 │ - job queue (pg-boss)    │        │ - faster-whisper / WhisperX│
 │ - audit log              │        │ - pyannote diarization    │
 └────────────┬─────────────┘        └─────────────┬─────────────┘
              │                                    │
              ▼                                    ▼
 ┌────────────────────────────────────────────────────────────────┐
 │ Encrypted file store (local volume): audio originals, prepared │
 │ chunks. Each file is encrypted with its own key (envelope).    │
 └────────────────────────────────────────────────────────────────┘
        │ nightly
        ▼
 Encrypted backup (restic) → EU object storage / Storage Box
```

### 1.2 Stack (proposed)

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript everywhere except the speech worker | Your constraint. Whisper and pyannote are Python, so worker-stt is a small Python service. It talks to the rest only through the job queue and the file store. |
| Frontend | React + Vite + TanStack Router/Query, installable PWA | Fast on phones and simple to host. No Vercel lock-in. |
| API | Hono on Node 22 | Small and typed. One process serves the API and the built frontend. |
| Database | **Postgres 16** with Drizzle ORM and migrations | Full-text search in Dutch and English, row-level constraints, and a Postgres-backed job queue, so we need no Redis. SQLite would work for the CRM but is weaker for the queue and search. |
| Jobs | pg-boss (retries, backoff, cron schedules) | Every pipeline step is its own job, so each one can be retried on its own. |
| Validation | Zod schemas shared by API, UI and AI output | One schema validates both forms and Claude responses. |
| Auth | Two seeded users, no sign-up route. Password (argon2id) plus mandatory TOTP. Passkeys as an option. | See D6. |
| Tests | Vitest (unit and integration against a real Postgres), Playwright (e2e and phone viewport), pytest for worker-stt | |
| Fonts | Self-hosted with @fontsource | No Google Fonts calls, no third-party requests at all. |

### 1.3 Separation of duties (the safety model)

- **Only the app writes records.** The AI worker writes only into `extractions`, `ai_runs` and draft tables, and nothing there touches real records until a person presses **Apply**.
- **The AI worker has no tools.** Claude is called with a fixed JSON output schema and no tool use. It cannot send, fetch or act. Lantern has no email or messaging integration at all, so drafts leave only when a person copies them or taps "Open in mail app" (`mailto:`) and sends from their own client.
- **Transcripts are passed as data.** They are wrapped in clearly delimited `<transcript>` blocks, and the system prompt says the content is untrusted speech to be processed, never followed. The real protection is structural, though: the output can only be the schema, every quote is string-checked, and nothing is saved without a human.

---

## 2. Transcription route comparison

The 10-minute mixed recording in the acceptance test is the yardstick. Real volume over 3 to 6 months is probably 30 to 60 interviews of 30 to 45 minutes, so roughly **20 to 45 hours of audio in total**.

| Route | Privacy | Dutch accuracy | Cost per hour of audio | Speed (10 min audio) | Setup effort |
| --- | --- | --- | --- | --- | --- |
| **A. Local on Aaina's Mac**: `faster-whisper` or `mlx-whisper` / `whisper.cpp` with **large-v3** or **large-v3-turbo** (multilingual) + pyannote | Best. Audio never leaves the laptop. | Good. Dutch is one of Whisper's stronger languages. Large models are far better than the small English-only model you tested. Turbo is slightly weaker on some languages, so we benchmark both. | €0 marginal | About 1 to 3 min on Apple Silicon *(estimate, to measure)* | Low for Aaina. **Jort cannot use it** unless the Mac is on and reachable. |
| **B. Own EU server**: same models on a dedicated-CPU EU VM (Hetzner, Germany/Finland) | Very good. Audio stays on our own EU machine, under a hosting DPA. | Same as A (same model) | Server about €25 to €45 per month fixed *(indicative)*. About €0 marginal, under €1 per hour at our volume. | About 5 to 15 min on 8 dedicated vCPU with turbo int8. Large-v3 is about 2 to 3 times slower *(estimate, to measure)*. It runs in the background, so this is acceptable. | Medium. Docker image, model download, a worker I build and you never touch. |
| **C. Hosted STT API with EU processing and a DPA**: candidates are Speechmatics (EU/UK, strong Dutch), Deepgram (EU endpoint), AssemblyAI (EU region), Mistral Voxtral (French company) | Good if EU processing and no-training terms are contractual. You add one more processor. | Very good to good. Diarization is often built in. Code-switching support varies, so we must test. | About $0.06 to $1.00 per hour depending on vendor and tier *(indicative)* | Under 1 to 2 min | Low. API key and a DPA to sign. |

**Speaker separation**, part of the same decision:

| Option | Licence and tokens | Notes |
| --- | --- | --- |
| **pyannote** `speaker-diarization-community-1` (pyannote 4.x) or `speaker-diarization-3.1` | Code is MIT. Model weights are gated on Hugging Face: you accept the conditions and need an HF token **only to download once**. Audio is never sent to HF. Licence of the community-1 weights to be re-verified at build time *(I believe CC-BY-4.0)*. | Best open option. Runs on CPU in a few minutes for 10 minutes of audio. |
| **WhisperX** | BSD-2-Clause. It wraps faster-whisper, a wav2vec2 aligner (a Dutch aligner exists) and pyannote. | This is how I would glue A or B together: word-level timestamps plus speaker labels merged per word. |
| NVIDIA NeMo diarization | Apache-2.0, no token | Heavier install. This is the fallback if pyannote terms are a problem. |
| Hosted API diarization (route C) | Vendor terms | Usually good. One less thing to run. |
| **Claude-proposed turns** (fallback) | Our own prompt | Used only when diarization confidence is low. These turns are labelled **"Speaker guess (AI)"** and are fixed turn by turn. |

### Recommendation

**Route B (own EU server) as the default, built behind a `Transcriber` interface so routes A and C plug in without code changes.**

- It is the only route that gives Jort access from anywhere **and** keeps audio on a machine we control.
- The same Docker image runs on Aaina's Mac, so route A is free to keep for very sensitive interviews.
- In Phase 2 I benchmark **large-v3 vs large-v3-turbo** on the golden set, plus **one hosted API** (Speechmatics or Deepgram EU) on the same FAKE audio only, so you can decide on numbers rather than claims.

Frisian: Whisper has no Frisian model. Segments the model detects as Dutch but with low confidence are flagged "low confidence, possibly Frisian or dialect". We make no promise of Frisian support.

---

## 3. Hosting options and how Jort gets access on day one

| Option | What it is | Monthly cost *(indicative, excl. VAT)* | Pros | Cons |
| --- | --- | --- | --- | --- |
| **H1. Hetzner, one VM in Germany or Finland** (recommended) | Docker Compose: Caddy, app, workers, Postgres. Dedicated-vCPU VM (CCX23/CCX33 class) + Storage Box for encrypted backups. | VM about €25 to €45, backups about €4, domain €1. **About €30 to €50.** Plus Claude usage (section 4.4). | EU company, DPA available, cheap, one box to understand. Jort uses it from day one. | We run the server ourselves (I script updates, backups and monitoring). Disk encryption has to be added by us (section 7). |
| H2. Scaleway, Amsterdam region (`nl-ams`) | Serverless container or small instance + **managed Postgres** (encrypted at rest) + object storage | About €40 to €80 | Data physically in NL, managed DB, backups managed. | More moving parts. The speech worker still needs a CPU instance. |
| H3. Interim: run on Aaina's Mac, Jort joins over Tailscale | The same Compose stack on the Mac. Tailscale gives Jort a private link. | €0 | Fastest to start, zero hosting. | Works only while the Mac is awake and online. The Mac becomes the server, so FileVault and backups matter. Tailscale (Canadian) runs the coordination servers, while traffic is end-to-end WireGuard. |

**Recommendation: start Phase 1 on H1 directly.** It costs little and avoids moving everything later. Use **H3 only if you want to wait before paying for anything**. The migration from H3 to H1 is a backup and restore, which we have to test anyway.

Domain: `lantern.scoutra.co` behind login, with `noindex` headers and no public pages except the login screen. Analytics: none. Error logging stays on our server; no Sentry or other SaaS.

---

## 4. The AI side (Claude)

### 4.1 Which steps use Claude

| Step | Model (proposed) | Temperature | Output |
| --- | --- | --- | --- |
| Clean-up (step 5) | Claude Sonnet 5.5 | Lowest the model accepts | JSON list of `{segment_id, cleaned_text, changes[], low_confidence_spans[]}` |
| Translation (step 6) | Claude Sonnet 5.5 | Low | JSON per segment, with protected entities kept byte-for-byte |
| Extraction (step 7) | Claude Sonnet 5.5. Opus 5.5 if the golden set shows a clear accuracy gain. | Lowest | Strict JSON schema (section 6.7) |
| Problem matching, speaker-turn guesses, prep sheets, Lantern letter, Ask Lantern answers | Sonnet 5.5, or Haiku 5.5 where good enough | Low | JSON with citations |

Model names and per-model parameter support (for example whether temperature is accepted) are verified at build time against the docs for the EU platform we choose.

### 4.2 Guardrails on every call

- Zod-validate the response. On failure, retry once with the validation error appended. On a second failure, the job goes to **"Needs a human"** with the raw response kept for inspection.
- **Programmatic quote check** (section 6.8) runs before anything is shown.
- **No timestamp is trusted from the model.** The model cites `segment_id`s, and timestamps come from our own segment table.
- Prompts are versioned in the repo, and `ai_runs` stores prompt version, model, tokens and cost for every call.

### 4.3 Where Claude runs (decision D3)

| Route | EU? | Notes |
| --- | --- | --- |
| **Claude on AWS Bedrock, EU region / EU cross-region inference profile** | Yes, processing stays within EU regions | AWS DPA. Bedrock does not use prompts for training. To verify: that Sonnet 5.5 is offered on an EU profile, plus EU pricing. |
| **Claude on Google Cloud Vertex AI, `europe-west4` (NL) or another EU region** | Yes | Google DPA. To verify: model availability in that region. |
| Anthropic first-party API | **No** (global or US only today) | Simplest, but breaks your EU rule. It would need SCCs/DPF and an explicit sign-off from your reviewer. Not recommended for real interviews. It is fine for the FAKE golden set. |

**Recommendation:** Vertex `europe-west4` or Bedrock EU, whichever offers the model we need in an EU region when we start Phase 3. If neither does, I come back to you before anything real is processed. Until then, development uses FAKE data only.

### 4.4 Cost model

Rough sizes: a 10-minute interview is about 1,500 words, or about 3,000 tokens of Dutch. Per 10 minutes: clean-up about 5k in / 3.5k out, translation about 3.5k in / 3.5k out, extraction about 6k in / 2k out. That totals **about 15k input and 9k output tokens**.

At first-party Sonnet 5.5 list prices ($2 per MTok input, $10 per MTok output, [pricing page](https://platform.claude.com/docs/en/about-claude/pricing)) this is **about $0.12 per 10 minutes, about $0.70 per audio hour**. EU partner pricing may differ and is to be confirmed. Even at three times that, 45 hours of audio stays under about $100 for the whole research period.

Cost control in the app:

- **Before each job:** an estimate from audio duration (or text length) using the per-model price table in settings. It shows as "About €0.14 for this interview" with a Start button.
- **Reservation:** starting a job reserves its estimate against this month's budget. If `spent + reserved + estimate > cap`, the job is refused with a plain message. No silent partial processing.
- **Metering:** real token usage from each response is written to `ai_runs`. Speech-to-text cost is recorded too: €0 for self-hosted, or the per-minute price for route C.
- **Monthly view:** spend per month and per step, and the cap with an edit control (edits are audited).
- Unit-tested: cap reached, cap crossed mid-month, reservation released on failure, and a new month resetting.

---

## 5. Data model

Postgres. Every table has `id uuid`, `created_at` and `updated_at`. Every table holding research content also has `is_fake boolean not null` (see section 12) and `created_by` (a user id). Text fields that came from AI carry an `origin` (`human` | `ai_proposed` | `ai_approved` | `ai_edited`), which drives the "AI" label in the UI.

### 5.1 Accounts and settings

```
users            id, name ('Aaina' | 'Jort'), email, password_hash, totp_secret_enc,
                 passkeys jsonb, locale, created_at
sessions         id, user_id, expires_at, user_agent, ip_hash
settings         key, value jsonb, updated_by, updated_at
                 -- validation_threshold (5), emerging_from (3), audio_retention_days (90),
                 -- working_weeks_per_year (46), monthly_cost_cap_eur, price_table,
                 -- cost_per_hour_assumption_eur {low, high}
```

### 5.2 CRM core

```
organisations    name, size_employees int null, size_band text null, sector, region,
                 website, notes, status ('prospect'|'interviewed'|'customer'|'not_now'),
                 is_fake
people           organisation_id null, full_name, role, language ('nl'|'en'|'mixed'),
                 email, phone,
                 sourced_by_kind ('aaina'|'jort'|'introduction') NOT NULL,
                 sourced_by_intro_name text null  -- required when kind = 'introduction'
                 consent_contact bool, consent_contact_at, consent_notes,
                 is_fake
interviews       organisation_id, scheduled_at, held_at, mode ('in_person'|'call'|'video'),
                 language ('nl'|'en'|'mixed'), status ('planned'|'held'|'processing'|
                 'in_review'|'applied'|'cancelled'),
                 consent_recording bool NOT NULL default false,
                 consent_recording_at timestamptz null,
                 consent_recording_how ('verbal_on_recording'|'verbal_before'|'written'|'email'),
                 consent_recording_by user_id,
                 consent_quote ('none'|'anonymous'|'named') NOT NULL default 'none',
                 summary text, summary_origin, is_fake
interview_participants  interview_id, person_id null, user_id null, role ('interviewee'|'interviewer')
deals            organisation_id, stage (enum below), value_eur_low, value_eur_high,
                 next_step, next_step_due, lost_reason,
                 source_kind ('aaina'|'jort'|'introduction') NOT NULL,
                 source_intro_name, source_first_contact_at NOT NULL,
                 is_fake
deal_stage_history  deal_id, from_stage, to_stage, changed_by, reason, changed_at
tasks            title, owner_user_id, due_on, done_at, linked_type, linked_id,
                 origin ('human'|'commitment'), apply_batch_id null, is_fake
hours_log        user_id, worked_on date, minutes int, role ('sell'|'deliver'|'platform'),
                 organisation_id null, note
drafts           kind ('thank_you'|'follow_up'|'referral_ask'|'letter'), person_id null,
                 interview_id null, language ('nl'|'en'), subject, body,
                 status ('draft'|'sent_by_person'|'discarded'), marked_sent_by, marked_sent_at,
                 apply_batch_id null, is_fake
```

Deal stage enum: `identified, contacted, interview_booked, interview_done, problem_validated, demo_shown, proposal_sent, paid_pilot, delivered, care_plan, not_now`.

**Source protection:** `source_kind`, `source_intro_name` and `source_first_contact_at` on deals, plus `sourced_by_*` on people, are required at creation. Changing them later needs a **reason**, shows a confirmation naming both founders, and writes an audit entry with the old and new values. Changes are only possible through a dedicated endpoint, so the ordinary edit form cannot change them.

### 5.3 Recording pipeline

```
recordings       interview_id, storage_key, original_filename, mime, bytes, sha256,
                 duration_sec, uploaded_by, uploaded_at,
                 retention_delete_at timestamptz NOT NULL,   -- uploaded_at + retention days
                 deleted_at null, delete_reason ('retention'|'forget'|'manual'),
                 status ('uploaded'|'preparing'|'transcribing'|'diarizing'|'cleaning'|
                         'translating'|'extracting'|'ready_for_review'|'failed'),
                 stt_engine, stt_model, cost_estimate_eur, cost_actual_eur
                 -- DB CHECK + trigger: insert refused unless interview.consent_recording = true
                 --                     AND consent_recording_at AND consent_recording_how set
recording_chunks recording_id, idx, start_sec, end_sec, overlap_sec, storage_key
pipeline_steps   recording_id or interview_id, step, status, attempts, last_error,
                 started_at, finished_at, job_id
transcripts      interview_id, source ('audio'|'pasted_text'|'uploaded_text'|'live_notes'),
                 version int, raw_locked bool  -- raw is immutable once written
transcript_segments
                 transcript_id, idx, start_ms, end_ms, speaker_label, speaker_origin
                 ('diarization'|'ai_guess'|'human'), person_id null,
                 language ('nl'|'en'|'unknown'), lang_confidence,
                 raw_text NOT NULL, cleaned_text null, translation_en null, translation_nl null,
                 avg_confidence, low_confidence bool, words jsonb  -- [{w,start_ms,end_ms,p}]
segment_edits    segment_id, field ('cleaned_text'|'speaker'|'translation'), before, after,
                 edited_by, edited_at   -- feeds "learn" and correction rate
glossary         term, correct_spelling, aliases text[], language, kind
                 ('company'|'product'|'person'|'business_term'|'other'), notes,
                 source ('seed'|'human'|'learned'), is_fake
```

**Raw, cleaned and translated text are separate columns.** `raw_text` can never be updated: a trigger rejects any UPDATE on it. Original audio is a separate encrypted file, and the prepared 16 kHz mono chunks are separate files that share the same retention date.

### 5.4 Understanding, review and the problem engine

```
extractions      interview_id, transcript_id, field_type (see 6.7), payload jsonb,
                 value_text, quote text NOT NULL, segment_ids uuid[] NOT NULL,
                 start_ms, end_ms   -- copied from segments, not from the model
                 confidence ('high'|'medium'|'low'), status ('proposed'|'approved'|
                 'edited'|'rejected'), reviewed_by, reviewed_at, ai_run_id
quote_check_failures  ai_run_id, field_type, claimed_quote, reason, created_at
problems         statement, description, status ('active'|'merged'|'archived'),
                 merged_into_id null, created_by, origin, is_fake
problem_mentions problem_id, interview_id, organisation_id NOT NULL, person_id null,
                 extraction_id, quote, start_ms, segment_ids,
                 people_affected int null, hours_per_week numeric null,
                 hours_per_month numeric null, cost_per_hour_eur numeric null,
                 current_workaround, tools_used text[], urgency ('low'|'medium'|'high') null,
                 budget_signal text null, apply_batch_id, is_fake
problem_merge_suggestions  problem_a, problem_b, rationale, status, decided_by
apply_batches    interview_id, applied_by, applied_at, undone_by, undone_at,
                 changes jsonb   -- [{table, id, op:'insert'|'update', before, after}]
ai_runs          step, model, platform, prompt_version, input_tokens, output_tokens,
                 cost_eur, status, validation_errors, created_at
budget_reservations  ai_run_or_job_id, month, amount_eur, released_at
live_notes       interview_id, user_id, offset_ms, tag ('pain'|'number'|'follow_up'|'note'),
                 text
questions        text_nl, text_en, category, order, active   -- question bank
```

### 5.5 Audit and privacy

```
audit_log        at, user_id, action, entity_type, entity_id, summary, before jsonb,
                 after jsonb   -- append-only: app DB role has INSERT/SELECT only
forget_log       at, user_id, subject_hash (HMAC of person id), counts jsonb,
                 reason        -- no names stored, so the log itself holds no personal data
```

The audit log covers every create, update and delete on records, every AI approval or rejection, every apply and undo, source changes, settings changes, logins, exports and deletions.

---

## 6. Recording pipeline design

Each step is a pg-boss job with 3 retries and exponential backoff. The interview page shows a live step list (Upload ✓, Prepare ✓, Transcribe 62%…, …) with a **Retry** button on any failed step. A step can be re-run without redoing earlier steps.

### 6.1 Upload and consent gate

- Accepts m4a, mp3, wav, mp4/mov (audio track only), webm/ogg/opus, flac, aac. The file type is sniffed from its bytes as well as its extension. Max 2 GB.
- **Three layers of gate:**
  1. The UI disables drop zone and Record button until consent is ticked, with date and method filled in.
  2. The API refuses the upload.
  3. A database constraint refuses the row.
  Unit tests cover all three layers.
- In-browser recording uses MediaRecorder (webm/opus). The consent checkbox sits right above the button, and the consent script can be shown full screen to read aloud.
- **Draft consent script** below. **Draft only: a human must check it legally before real use.**

> **NL (concept, juridisch laten nakijken):** "Voordat we beginnen: vind je het goed dat ik dit gesprek opneem? We gebruiken de opname alleen intern, om het gesprek goed uit te werken. De opname wordt automatisch uitgeschreven en samengevat met software, waaronder een AI-dienst, verwerkt binnen de EU. De audio verwijderen we na uiterlijk 90 dagen; de uitgewerkte tekst bewaren we tot ons onderzoek klaar is, of korter als je dat wilt. Je kunt op elk moment stoppen of vragen om alles te laten verwijderen. En mogen we later iets citeren van wat je zegt: met je naam, anoniem, of liever niet? Jij kiest."

> **EN (draft, needs legal review):** "Before we start: is it all right if I record this conversation? We only use the recording internally, to write the conversation up properly. It is transcribed and summarised automatically by software, including an AI service, processed within the EU. We delete the audio within 90 days at the latest. We keep the written version until our research is finished, or for less time if you prefer. You can stop at any time or ask us to delete everything. And may we quote something you say later: with your name, anonymously, or not at all? It's your choice."

The "processed within the EU" sentence is only true if D2/D3 land on EU routes. The script is generated from settings so it never claims something false.

### 6.2 Prepare

`ffmpeg`: decode, downmix to mono, resample to 16 kHz, loudness-normalise (EBU R128 `loudnorm`). Files over 20 minutes are split into chunks of about 10 minutes with 15 s overlap at silence boundaries. Each chunk stores its absolute `start_sec`. When chunks are merged, words inside the overlap are de-duplicated by timestamp, so every word keeps an exact absolute time. The original file is never modified.

### 6.3 Transcribe

- faster-whisper (large-v3 or turbo, chosen by benchmark) with `word_timestamps=True`, VAD filter, and **no forced language**. Language is detected per segment, by running detection on each VAD region, so Dutch and English switches are labelled per segment.
- **Vocabulary hint:** `initial_prompt` / hotwords built from the glossary (correct spellings only, kept under the token limit, most-used terms first).
- Per-segment `avg_logprob` and `no_speech_prob` map to `avg_confidence`. Below a threshold sets `low_confidence = true`. Low-confidence Dutch carries the hint "possibly dialect or Frisian".
- Output goes straight into `transcript_segments.raw_text` and `words`. Raw is locked once written.

### 6.4 Speakers

pyannote diarization, then speaker turns are assigned per word (WhisperX-style) and segments are split at speaker changes. If diarization confidence is poor, or there is only one detected speaker where the interview has two or more participants, Claude proposes turns from context, labelled **"Speaker guess (AI)"**. The reviewer maps `SPEAKER_00` to "Jort" or "Interviewee name" once, and that mapping applies to the whole transcript. Individual turns can be fixed inline.

### 6.5 Clean-up

Claude gets segments (id + raw text + low-confidence spans), the glossary, and the participants' names and organisation. Rules in the prompt:

- Fix only clear recognition errors: glossary aliases (for example "Skalcra" → "Scoutra"), obvious mishearings from context, punctuation and casing.
- Do not paraphrase, shorten, translate or "improve" grammar. Fillers stay unless they are recognition noise.
- Each change is returned as `{from, to, reason}`. Unsure spans go into `low_confidence_spans`, not into changes.

Code-side checks:

- The cleaned text must be within a set edit distance of the raw text (for example 15% at character level). If not, the segment is rejected and flagged.
- Numbers, amounts and named entities that appear in raw must still appear in cleaned unless an explicit change explains it.
- The UI shows a **word diff** (raw vs cleaned) with each change hoverable, and low-confidence spans highlighted in honey.

### 6.6 Translate

Per segment, NL → EN (and EN → NL on request). Before translation, we extract "protected tokens" with a regex and glossary pass: company names, product names, numbers, amounts, dates, email addresses. After translation, code checks every protected token still appears exactly. If one is missing, we retry once, then flag. The view is side by side, original left and translation right, with the translation labelled "AI translation".

### 6.7 Understand (extraction schema)

One call per transcript, with the transcript as `[segment_id] speaker: cleaned_text` lines. The schema (Zod, mirrored as JSON Schema for the model):

```ts
Item = { quote: string, segment_ids: string[], confidence: 'high'|'medium'|'low' }

Extraction = {
  company_facts: Array<Item & {
    fact: 'size_employees'|'sector'|'tools_used'|'who_does_task'|'region'|'other',
    value: string }>,
  pains: Array<Item & {
    statement: string,                       // short, in the interview language
    hours_lost: { amount: number, per: 'week'|'month' } | null,
    cost_per_hour_eur: number | null,
    people_affected: number | null,
    current_workaround: string | null,
    tools_used: string[],
    urgency: 'low'|'medium'|'high' | null }>,
  budget_signals: Array<Item & { kind: 'budget'|'buying'|'price_sensitivity', value: string }>,
  objections: Array<Item & { value: string }>,
  trust_concerns: Array<Item & { topic: 'data'|'ai'|'vendor'|'other', value: string }>,
  decision_role: (Item & { decides: 'yes'|'no'|'shared' }) | null,
  referrals: Array<Item & { name: string | null, role: string | null, organisation: string | null }>,
  commitments: Array<Item & { by: 'us'|'them', what: string, due: string | null }>,
  questions_asked: Array<Item & { question: string }>,
  surprises: Array<Item & { what: string }>
}
```

Every number field must be supported by the quote. A code check confirms that each number the model returns appears in the cited segment text, as digits or as a Dutch or English number word. If not, the value is set to `null` and the item gets a note. Empty arrays are expected and fine; the prompt says plainly that an empty answer is correct when nothing was said.

### 6.8 Quote check (programmatic)

For each item:

1. Load the text of the cited `segment_ids` (cleaned text if present, otherwise raw), joined with spaces.
2. Normalise **only**: Unicode NFC, curly → straight quotes and apostrophes, collapse whitespace, trim. **No** case folding, **no** punctuation stripping, **no** fuzzy match.
3. `haystack.includes(quote)` must be true. If it is not, the item is discarded and a `quote_check_failures` row is written with the reason. The review screen shows "2 items were discarded because their quotes were not found in the transcript" with a link to the log.
4. Timestamps are taken from the first and last cited segment, never from the model.

The quote also has to exist in the **raw** text, or be explainable by the clean-up diff of those segments. Otherwise the quote depends on an AI edit, and the card shows a badge saying the quote relies on a cleaned-up word, with the diff.

Tests: exact match passes. A one-word change fails. A quote split across two cited segments passes. A quote citing the wrong segment fails. Curly quotes pass. An injection string inside a transcript, such as "ignore your rules", ends up only as transcript text.

### 6.9 Learn

- Every inline edit of cleaned text, speaker or translation goes into `segment_edits`. If an edit replaces word X with Y and Y is a glossary term, Lantern **suggests** adding X as an alias. A person confirms; nothing is added silently.
- Accepted, edited and rejected extraction cards are kept, and the 20 most recent human-edited examples (FAKE or with consent, see D11) can be passed to the model as few-shot examples.
- **Correction rate** = human edits per 1,000 transcript words, and edited-or-rejected extraction cards per interview, charted per month on the Settings → Quality page.

### 6.10 Text-only input

"Paste notes" and "Upload text transcript" (.txt, .vtt, .srt, .docx) create a transcript with `source = pasted_text` or `uploaded_text`. Pasted notes are split into segments by paragraph. VTT/SRT keep their timestamps; others have none, and the card then shows "no timestamp (notes)". These transcripts go through steps 5 to 8 exactly the same way, including the quote check.

### 6.11 Glossary seed

Scoutra (heard as Skalcra), Claude (KOD, God), ChatGPT (JGPT, TGT), BV (BC, beefy), KvK, BTW, CRM, n8n, Lovable, VOF, plus Dutch business terms: ZZP/zzp'er, eenmanszaak, offerte, factuur, debiteuren, crediteuren, boekhouding, administratie, inkoop, ERP, Exact, Twinfield, Moneybird, e-Boekhouden, AFAS, Snelstart, werkbon, planning, MKB. Editable in the UI; import and export as CSV and JSON.

---

## 7. Review screen, apply and undo

**Left pane:** audio player (wavesurfer.js, self-hosted). Click a line to play from its `start_ms`. The current line follows playback. There are tabs for **Raw | Cleaned (diff) | Side by side translation**. Speaker chips are editable inline, and keyboard shortcuts: J/K to move, Space to play, E to edit.

**Right pane:** extraction cards. Each card has a coloured **"AI"** chip, the field, the value, the verbatim quote, a timestamp link that jumps the player, and confidence as text plus a shape (not colour alone). Actions are **Accept**, **Edit** (the edit form keeps the quote fixed) and **Reject**. **"Accept all high-confidence"** affects only `high` cards and shows a count first ("Accept 7 high-confidence items?"). Low and medium cards are never bulk-accepted.

**Apply** runs one transaction that creates one `apply_batches` row:

- updates person and organisation fields (from accepted company facts and decision role)
- creates `problem_mentions`. For each pain, Claude proposes "matches existing problem X (because …)" or "new problem". **The person picks** from a dropdown pre-filled with the proposal; nothing merges automatically.
- creates `tasks` from commitments, with owner defaulting to the interviewer and editable
- **proposes** a deal stage change, shown as a confirm row, never auto-applied
- generates drafts (thank-you, follow-up, referral ask) in the interviewee's language. They are warm, curious about the other person first, and keep the offer light. They are saved as `drafts.status = draft`, and the only actions are **Copy**, **Open in mail app** and **Mark as sent by me**.
- stores before and after values of every touched row in `apply_batches.changes`

**Undo apply** reverses one batch: it deletes inserted rows and restores the before values of updated rows. If a row was edited after apply, undo stops and lists the conflicts rather than overwriting newer human work. Undo is audited.

---

## 8. Problem engine

- **Problem card:** statement, description, a lantern icon whose glow follows the gate state, an evidence wall of quotes, companies affected, roles who feel it, workarounds, tools, and the cost range.
- **Gate counter:** `count(distinct organisation_id)` over `problem_mentions` of non-merged problems (a merged problem's mentions count towards its target). Mentions are counted only where `is_fake` matches the current mode (real data never counts fake, and vice versa). Forgotten people's mentions no longer exist, so they no longer count. States: **Exploring** (fewer than `emerging_from`, default 3), **Emerging** (from 3 up to the threshold minus 1), **Validated** (≥ threshold, default 5). Both numbers are in Settings and changes are audited. The card always shows "3 of 5 companies", never only a colour.
- **Cost range:** for each mention with enough inputs, `people × hours/week × €/hour × working weeks`. `hours/month` is converted with ×12/weeks. Missing `€/hour` uses the **assumption range** from settings (for example €35 to €75), which the card names as an assumption. The card shows min to max across mentions, with an "Assumptions" panel listing each input and where it came from (a quote, or an assumption). If no mention has hours, the card says "No one has quantified this yet" and shows no euro figure.
- **Merge suggestions:** a nightly job asks Claude (Haiku) to compare problem statements and proposes pairs with a rationale. A person accepts or dismisses each one, and nothing merges automatically.
- **Missing-evidence prompts:** rules in code, for example no budget signal yet, only one sector, only one company size band, all from one interviewer's network, no decision-maker interviewed.
- **Ranking:** sorted by distinct organisations, then urgency, then cost midpoint. Problems with fewer than 2 organisations sit in a separate "Not enough data yet" list, with no score.

---

## 9. Pipeline, tasks, hours, Today and the Lantern letter

- **Deals:** kanban (drag between stages, which needs confirmation on phone) and a list view with filters. Every stage change writes `deal_stage_history`.
- **Hours log:** on phone, a big "+ Hours" button opens a form with date (today), minutes (15/30/60/120 chips plus custom), role (3 chips), customer (optional), note, and Save, about 4 taps. There is a weekly view per person and per role.
- **Today:** tasks due and overdue, drafts not yet sent, deals whose next step is due, and **tomorrow's interviews with a prep sheet**. The prep sheet is built only from Lantern data: the organisation, past interviews, open problems in that sector, unanswered questions, and suggested questions from the bank. Every line links to its source. If there is no data, it says so.
- **Lantern letter:** generated every Monday at 07:30 and shown in the app, never emailed. It covers interviews held, problems that moved state, deals that moved, what is stuck (no activity in 14 days), and hours per person and role. The numbers come from SQL; Claude only writes the warm connecting sentences around numbers it is given, and code checks that every number in the text matches the data.
- **CSV export:** contacts, deals and hours, with fake rows excluded. Each export is audited. Columns are chosen for the accountant (hours: date, person, minutes, role, customer).
- **CSV import** for organisations and people, with a preview, duplicate detection, and a required `sourced_by` column.

---

## 10. Interview companion and Ask Lantern

- **Question bank** (NL and EN), seeded with past-behaviour questions grouped as: how they do it today, the last time it went wrong, what that cost, what they have tried, who else is involved, and the closing asks. No "would you…" hypotheticals; a lint rule warns if a new question starts with "would/zou".
- **Live mode:** full-screen and phone-first, with a timer, a quick text field, and three big buttons: **Pain**, **Number**, **Follow up**. Each tap timestamps from the start of the interview. If the interview is also recorded, the timer is tied to the recording start so notes line up. The closing ask reminder appears at a set minute (default 35) or on demand: referrals, and permission to quote, which sets `consent_quote` on the spot. Live notes become a `live_notes` transcript and can also be processed.
- **Ask Lantern:**
  1. Postgres full-text search (Dutch and English configs) over cleaned segments, translations, approved extractions and notes. This retrieves the top 30 candidates.
  2. Claude answers **only** from those candidates. Each claim must cite `segment_id`s, and code verifies every citation exists and every quoted phrase matches (the same quote check).
  3. If nothing relevant is found, or the answer has no valid citations, the reply is: **"I did not find this in our interviews."**
  4. Forgotten data does not exist, so it cannot be found. For quote permissions, see D7.

  Phase 4 option: local multilingual embeddings (for example `multilingual-e5`) in worker-stt, stored with pgvector, for meaning-based search. This needs no third-party service.

---

## 11. Privacy and security guardrails

| Requirement | How |
| --- | --- |
| AI label until approved | `origin` column plus UI chip. Approval changes `origin` and writes an audit entry. |
| Originals never overwritten | Audio is immutable (stored by sha256). `raw_text` UPDATE is blocked by trigger. Cleaned and translated text are separate columns. |
| Consent before upload | UI, API and DB constraint, each tested |
| Quote permission per interview | `consent_quote` is required (default `none`) and set during live mode or review |
| Audio retention | `retention_delete_at` is set on upload. An hourly job securely deletes the original and chunks, sets `deleted_at`, and writes an audit entry. Text stays. Retention days are configurable, and changing them applies to new uploads; for existing ones you can choose. |
| Backups vs retention | **Audio is excluded from backups.** DB backups are kept 30 days, so deleted text ages out of backups within 30 days. On restore, the `forget_log` and retention deletions are **re-applied** automatically before the app starts. Tested. |
| Forget this person | One action with a typed confirmation. It deletes the person and their participant rows. For interviews where they were the only interviewee, it also deletes the interviews' audio, transcripts, extractions, live notes, problem mentions, drafts and commitment tasks. For group interviews it deletes their segments and the mentions sourced from them. It recomputes gate counts and writes a `forget_log` row with an HMAC id and counts (no name). Tested end to end, including the restore re-apply. |
| EU hosting | App, DB and STT on an EU VM. Claude via an EU partner region (D3). No other processors. |
| No trackers | No analytics or third-party scripts, fonts or CDNs. A strict CSP (`default-src 'self'`) is checked in CI. |
| Encryption at rest | Audio files are encrypted per file (XChaCha20-Poly1305, with keys wrapped by a master key from an env var). The Postgres data dir sits on a LUKS-encrypted volume, and backups are restic-encrypted. **Honest limit:** on a single self-run VM the unlock key lives on the server, so this protects against lost disks, snapshots and backup leaks, not against someone who controls the running server. Scaleway managed Postgres (H2) changes this trade-off. |
| Two named users | No sign-up route. Users are created by a CLI command. TOTP is mandatory, sessions expire after 14 days of inactivity, and login attempts are rate-limited. |
| Secrets | Only in `.env` on the server (gitignored). CI runs gitleaks, and `.env.example` holds placeholders only. |
| Phone data | The PWA caches only the app shell. Records are not stored offline unless D12 says yes. |

### What Aaina must confirm with an outside reviewer before real interviews are stored

A note on who to ask: KvK gives good general guidance but does not give legal advice on a specific setup, and most accountants are not AVG specialists. For these points a privacy lawyer, a privacy consultant, or the Autoriteit Persoonsgegevens guidance is the better source. The KvK or accountant can confirm the business-registration points.

1. **Legal basis** for recording and processing: consent, or legitimate interest with consent for the recording only. Also: what happens to the data if consent is withdrawn.
2. **Transparency:** a short privacy notice (NL and EN) to send before or after interviews. It should cover what is stored, why, for how long, the processors (host, speech service if any, Claude platform), and rights.
3. **The consent script** in section 6.1, and whether verbal consent on the recording is enough evidence.
4. **Retention periods:** 90 days for audio, and a period for transcripts and notes (I suggest a review at the end of the research, or at the latest 12 months).
5. **Processor agreements (DPAs)** with each processor: hosting (Hetzner or Scaleway), the Claude platform (AWS or Google), and any STT vendor. Also whether any transfer outside the EU happens, including support access.
6. **Whether a DPIA is needed.** It is probably not required at this scale, but recordings plus AI processing is worth a documented short assessment.
7. **Processing register** (verwerkingsregister, Art. 30). Small-company exemptions are narrow, and a one-page register is cheap.
8. **Quoting:** what "anonymous" must mean (company name too? sector and size only?), and how named quotes may be used in sales or marketing.
9. **Data subject requests:** the process and response time (one month) for access, correction and deletion. "Forget this person" covers deletion.
10. **Breach procedure:** who reports to the AP within 72 hours, and how.
11. **Phone recording of calls:** what Dutch law and AVG transparency require when Jort records a call.
12. **Using real interview snippets as AI few-shot examples** (D11): covered by the consent wording or not.
13. **Demo use:** confirm that client demos use **only** the FAKE dataset.

---

## 12. FAKE data and demo mode

- Every research table has `is_fake`. The seed script creates about 12 organisations, about 20 people, about 15 interviews, 3 golden transcripts, about 8 problems (one at exactly 5 distinct organisations, one with 5 mentions from only 2 organisations to prove distinct counting), deals in every stage, tasks and hours.
- Fake names are obviously fake, for example "FAKE Metaalbedrijf De Proef BV", and every fake row renders a **FAKE** badge in lists, cards, exports and the letter.
- **Demo mode** is a separate database (`lantern_demo`) behind a separate login or subdomain, holding only fake data. For client demos you never open the real instance. Real mode hides fake rows by default (with a toggle for testing).

---

## 13. Quality: golden set, tests and backups

- **Golden set:** 3 short FAKE conversations (about 3 to 4 minutes each): Dutch, English, and mixed NL/EN with glossary traps (Scoutra, BV, KvK, n8n). Each has a hand-checked reference transcript with speakers and a hand-written expected extraction. For audio, see D8.
- **Metrics,** reported by `pnpm eval`:
  - WER and CER per language, before and after clean-up
  - glossary term accuracy
  - diarization error (DER, simple version)
  - extraction precision and recall per field type
  - quote-check discard count
  - processing time and cost
  
  Results are written to `eval/results/<date>.md`, so each change is compared to the last.
- **Unit tests (required):** quote check, consent gate (3 layers), retention deletion, forget-this-person (and restore re-apply), distinct-organisation counter, cost cap and reservations, source-change audit, raw-text immutability, apply and undo (including conflict), number-in-quote check, drafts never sent (there is no send code path, and a test asserts that no SMTP or HTTP mail client exists in the dependencies).
- **E2E (Playwright, phone viewport):** add a person in ≤ 5 interactions. The timing target of under 30 s is checked by hand with Jort in Phase 1, and the Playwright test guards the tap count.
- **Backups:** nightly `pg_dump` with restic to EU storage, keeping 7 daily and 4 weekly copies (about 30 days). A monthly **automated restore test** into a scratch DB runs migrations and smoke checks and reports in the audit screen. Phase 5 includes a documented manual restore drill.

---

## 14. Decisions I need from you

| # | Question | My recommendation |
| --- | --- | --- |
| **D1** | Where does Lantern's code live? | A new **private** repo `blinkboxhq/scoutra-lantern`, with this public repo staying the website. |
| **D2** | Transcription route (section 2) | **B: own EU server**, with A as an optional path on the Mac. I benchmark one hosted API on FAKE audio for comparison. |
| **D3** | Where Claude runs (section 4.3) | **Vertex AI `europe-west4` or Bedrock EU**, whichever has the model in an EU region. First-party API for FAKE data during development only. Do you have an AWS or Google Cloud account preference? |
| **D4** | Hosting and Jort's day-one access (section 3) | **H1 Hetzner** from Phase 1 (about €30 to €50 per month). H3 (Mac + Tailscale) if you'd rather not pay yet. |
| **D5** | Monthly AI cost cap | €25 to start (expected spend is a few euros). Your number? |
| **D6** | Login method | Password + mandatory TOTP app, with passkeys added in Phase 5 for one-tap phone login. Or passkeys from day one? |
| **D7** | Meaning of quote permission **none** | Usable **internally** (Ask Lantern, problem cards, labelled "internal only"), but never in anything shareable: exports, demo, the letter's quotes. **anonymous** hides person and company in shareable views. **named** may be quoted. Is that right? |
| **D8** | Golden-set audio | Aaina and Jort **read the 3 fake scripts aloud** (real voices, real accents, your own consent). A local Dutch TTS alternative (Piper) is easier but flatters the WER. |
| **D9** | Transcript retention | Keep until deleted (your brief), plus a reminder at the end of the research period to review and delete. OK? |
| **D10** | Fonts | Body in **Atkinson Hyperlegible** (built for readability, OFL) or **Inter** (matches the website). Handwritten accents in **Caveat**. |
| **D11** | May real, approved interview snippets be used as few-shot examples for the AI? | Not until your reviewer confirms (legal item 12). Until then, examples come from FAKE data only. |
| **D12** | Offline capture on Jort's phone (notes and quick-add saved on the device until there is signal)? | Yes for quick-add and live notes only, encrypted in IndexedDB, synced and wiped on success. Or keep the phone free of data. |
| **D13** | Mac details for route A | Which Mac (Apple Silicon model, RAM)? This only matters if you want route A. |
| **D14** | Domain | `lantern.scoutra.co`, not linked from the website, `noindex`. |

---

## 15. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Dutch conversational WER worse than expected (crosstalk, phone audio, accents) | Bad transcripts mean bad evidence | Benchmark early in Phase 2. Large-v3 vs turbo vs one hosted API. Glossary hints. Clear low-confidence flags. |
| The EU Claude route lacks the model we want | Delay, or a privacy compromise | Check at the start of Phase 3. Fall back to a model that is available in the EU, and ask you before any non-EU processing. |
| Diarization weak on 2-person phone calls | Wrong speaker on quotes | One-click speaker remap, turn-level fixes, AI-guess labels |
| Model "helpfully" invents pains or numbers | False validation | Quote check, number-in-quote check, schema-only output, human review, golden-set precision tracking |
| Over-merging problems inflates the gate | False "Validated" | No automatic merges. The gate counts distinct organisations only. The evidence wall is always one click away. |
| Self-run server neglected (updates, disk) | Downtime, security | Unattended security updates, disk and backup alerts shown in the app and audit screen, and a monthly restore test |
| Scope is large for one builder | Late phases slip | Phases are independently useful. Phase 1 alone replaces spreadsheets. |
| Real data creeps into the demo | Privacy breach in front of a client | A separate demo DB, FAKE badges, and a demo login that cannot reach the real DB |
| Consent wording legally insufficient | Recordings unusable | Legal checklist (section 11) is a gate before real interviews are stored |

---

## 16. Phase outline (after approval)

| Phase | Deliverable | Rough effort |
| --- | --- | --- |
| 1. Core CRM | Logins, organisations, people, interviews (consent fields), deals with kanban, tasks, hours, phone quick-add, CSV import and export, audit log screen, settings, FAKE seed, backups | Largest phase |
| 2. Recording pipeline | Upload/record, consent gate, prepare, transcribe, diarize, glossary, raw transcript view with timestamps, cost estimate, golden-set eval report | Medium |
| 3. Understanding and review | Clean-up with diff, translation, extraction, quote check, review screen, apply/undo, drafts, learning and correction rate | Medium to large |
| 4. Problem engine and companion | Problem cards, gate, cost ranges, merge suggestions, Lantern letter, Today prep sheets, question bank, live mode, Ask Lantern | Medium |
| 5. Polish and handover | Look-and-feel pass, accessibility audit, restore drill, retention and forget tests, README, "how we use Lantern each week" | Small to medium |

After each phase I report what was built, how to try it in 5 minutes, what is not done, and what I'm unsure about. Then I wait.

---

## Appendix A. Look and feel notes

**Concept:** "the lantern in the willow garden". Each problem is a small lantern whose glow follows its gate state: unlit outline for Exploring, soft honey glow for Emerging, fully lit glow for Validated. The state is always written in words too. Motion (a gentle flicker) is off under `prefers-reduced-motion`.

**Palette contrast,** computed WCAG 2.2 ratios against the two backgrounds:

| Pair | Ratio | Use |
| --- | --- | --- |
| ink #14231B on paper #F1E8C7 | 13.3 | Body text, day mode ✓ |
| glow #E9F5A0 on night #0F1F17 | 14.7 | Body text, night mode ✓ |
| mist #B2CDB6 / honey #ECC04F / rose #E5B0AD on night | 10.0 / 10.0 / 9.1 | Text and accents at night ✓ |
| willow #407B6A on paper | 4.0 | Large text and UI borders only (3:1). **Fails for body text.** |
| leaf #50803E on paper | 3.8 | Large text and icons only |
| matcha, honey, rose, mist on paper | 1.4 to 2.1 | **Backgrounds and fills only, never text** |

To keep AA, I add two text-safe shades: **willow-deep #2F6152** (5.8:1 on paper) for links and buttons in day mode, and **leaf-deep #3C6630** (5.5:1). Text on honey or rose chips uses ink. In night mode, leaf and willow (3.5 to 3.7) get light variants for text: **leaf-light #7FB06C** (6.8:1) and **willow-light #6FAE98** (6.7:1). Confidence and status are never shown by colour alone.

**Layout:** phone-first for quick-add, live mode and hours (bottom tab bar: Today, People, + Add, Interviews, More). Desktop-first for the review split view and the problem engine. The interface is in English, while content is shown in its original language with `lang` attributes for correct screen-reader pronunciation.

**Tone:** encouraging and honest, for example "3 of 5 companies so far". No confetti, streaks or pressure.
