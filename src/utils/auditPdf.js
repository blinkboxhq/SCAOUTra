/**
 * auditPdf — generates the downloadable Client-Getting Systems Audit report.
 *
 * Built programmatically rather than by rasterising the DOM: html2canvas-style
 * capture would flatten the report into a fuzzy image, lose selectable text,
 * and mangle the two things this page leans on hardest — the conic-gradient
 * score ring and `background-clip: text` headings, neither of which rasterise
 * reliably. Drawing it directly gives crisp vector output at any zoom, real
 * selectable/searchable text, and a much smaller file.
 *
 * jsPDF is imported dynamically by the caller so visitors who never download
 * do not pay for the library.
 */

// Print-safe palette (the dark UI colours are unreadable on white paper)
const INK        = [17, 17, 22];
const MUTED      = [90, 90, 104];
const GREEN      = [21, 128, 61];
const AMBER      = [180, 83, 9];
const RED        = [185, 28, 28];
const BORDER     = [212, 212, 221];
const TINT_GREEN = [244, 249, 245];

const PAGE_W  = 210;
const PAGE_H  = 297;
const MARGIN  = 16;
const WIDTH   = PAGE_W - MARGIN * 2;
const BOTTOM  = PAGE_H - 20;

const euro = (n) => 'EUR ' + Math.round(n).toLocaleString('en-US');

export async function downloadAuditPdf(r, meta) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = 0;
  let page = 1;

  /* ── primitives ─────────────────────────────────────────────── */

  const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);

  function footer() {
    doc.setFont('helvetica', 'normal').setFontSize(8);
    setText(MUTED);
    doc.text('scoutra.co', MARGIN, PAGE_H - 12);
    doc.text(`Page ${page}`, PAGE_W - MARGIN, PAGE_H - 12, { align: 'right' });
  }

  function newPage() {
    footer();
    doc.addPage();
    page += 1;
    y = MARGIN + 6;
  }

  function need(h) {
    if (y + h > BOTTOM) newPage();
  }

  function sectionTitle(text) {
    // Reserve room for the heading *plus* the start of its content, otherwise a
    // title can strand itself at the foot of a page with its body overleaf.
    need(34);
    y += 6;
    doc.setFont('helvetica', 'bold').setFontSize(8);
    setText(MUTED);
    doc.text(text.toUpperCase(), MARGIN, y, { charSpace: 0.25 });
    y += 5;
  }

  function paragraph(text, { size = 9, color = MUTED, italic = false, gap = 4 } = {}) {
    doc.setFont('helvetica', italic ? 'italic' : 'normal').setFontSize(size);
    setText(color);
    const lines = doc.splitTextToSize(text, WIDTH);
    need(lines.length * (size * 0.42) + gap);
    doc.text(lines, MARGIN, y);
    y += lines.length * (size * 0.42) + gap;
  }

  /** Callout box with a coloured left edge. */
  function callout(text, accent, tint) {
    doc.setFont('helvetica', 'normal').setFontSize(10);
    const lines = doc.splitTextToSize(text, WIDTH - 12);
    const h = lines.length * 4.6 + 10;
    need(h + 4);
    setFill(tint);
    doc.rect(MARGIN, y, WIDTH, h, 'F');
    setFill(accent);
    doc.rect(MARGIN, y, 1.4, h, 'F');
    setText(INK);
    doc.text(lines, MARGIN + 7, y + 7);
    y += h + 5;
  }

  /** Label/value row, optionally highlighted as a computed result. */
  function row(label, value, { highlight = false, sub = null } = {}) {
    const h = sub ? 11 : 8;
    need(h);
    if (highlight) {
      setFill(TINT_GREEN);
      doc.rect(MARGIN, y, WIDTH, h, 'F');
    }
    doc.setFont('helvetica', 'normal').setFontSize(9);
    setText(highlight ? INK : [51, 51, 61]);
    doc.text(label, MARGIN + 3, y + 5.4);

    doc.setFont('helvetica', 'bold').setFontSize(9);
    setText(highlight ? GREEN : INK);
    doc.text(String(value), PAGE_W - MARGIN - 3, y + 5.4, { align: 'right' });

    if (sub) {
      doc.setFont('helvetica', 'normal').setFontSize(7);
      setText(MUTED);
      doc.text(sub, MARGIN + 3, y + 9);
    }

    setDraw(BORDER);
    doc.setLineWidth(0.1);
    doc.line(MARGIN, y + h, PAGE_W - MARGIN, y + h);
    y += h;
  }

  /* ── header ─────────────────────────────────────────────────── */

  y = MARGIN + 4;
  doc.setFont('helvetica', 'bold').setFontSize(16);
  setText(INK);
  doc.text('SCOUTRA', MARGIN, y);

  doc.setFont('helvetica', 'bold').setFontSize(9);
  doc.text('Client-Getting Systems Audit', PAGE_W - MARGIN, y - 4, { align: 'right' });
  doc.setFont('helvetica', 'normal').setFontSize(8);
  setText(MUTED);
  doc.text(
    [meta.owner, meta.site].filter(Boolean).join('  |  '),
    PAGE_W - MARGIN, y, { align: 'right' }
  );
  doc.text(meta.date, PAGE_W - MARGIN, y + 4, { align: 'right' });

  y += 6;
  setDraw(INK);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 12;

  /* ── score ──────────────────────────────────────────────────── */

  const cx = PAGE_W / 2;
  setDraw(GREEN);
  doc.setLineWidth(1.2);
  doc.circle(cx, y + 14, 14, 'S');

  doc.setFont('helvetica', 'bold').setFontSize(22);
  setText(GREEN);
  doc.text(String(r.score), cx, y + 17, { align: 'center' });

  // Label sits *below* the circle — inside it, the ring clips wide text.
  doc.setFont('helvetica', 'normal').setFontSize(7);
  setText(MUTED);
  doc.text('SYSTEMS SCORE  /  100', cx, y + 34, { align: 'center' });
  y += 41;

  const band =
    r.score >= 80 ? 'Strong foundation.'
    : r.score >= 50 ? 'Workable, with real gaps.'
    : 'Most of the machinery is missing.';
  doc.setFont('helvetica', 'normal').setFontSize(8);
  setText(MUTED);
  doc.text(
    `Measured against best practice across six systems - not an industry average. ${band}`,
    cx, y, { align: 'center', maxWidth: WIDTH - 20 }
  );
  y += 8;

  /* ── the gap ────────────────────────────────────────────────── */

  sectionTitle('Can you get there from here?');

  const verdictText = {
    reachable:
      `Your current model CAN reach ${euro(r.goalRev)}/month with the inquiries you already get. `
      + 'You do not have a lead problem - the constraint is purely how many of them you convert and keep.',
    volume:
      'Your conversion rate is already at best practice and nothing significant is leaking, so this is '
      + 'a lead-volume gap, not a systems gap. '
      + (r.extraInquiriesNeeded !== null
          ? `You need roughly ${r.extraInquiriesNeeded} more inquiries a month to hit ${euro(r.goalRev)}. `
          : '')
      + 'Fixing systems will not close this one - more traffic will.',
    mixed:
      'Two things are true at once. Your headline conversion rate is respectable - but the systems below '
      + `are still leaking ${euro(r.monthlyLeak)}/month, so that rate is lower than it should be. `
      + (r.extraInquiriesNeeded !== null
          ? `You are also short about ${r.extraInquiriesNeeded} inquiries a month for ${euro(r.goalRev)}. `
          : '')
      + 'Plug the leak first - it is cheaper than buying the extra traffic.',
    blocked:
      `At your current conversion rate, your model CANNOT reach ${euro(r.goalRev)}/month - not by working harder. `
      + (Number.isFinite(r.inquiriesNeededNow)
          ? `It would take ${Math.ceil(r.inquiriesNeededNow)} inquiries a month. You get ${r.inquiries}.`
          : 'With no conversions recorded yet, there is no rate to scale from.'),
  }[r.gapVerdictType];

  const verdictStyle = {
    reachable: [GREEN, [242, 251, 244]],
    volume:    [[8, 145, 178], [241, 250, 252]],
    mixed:     [[8, 145, 178], [241, 250, 252]],
    blocked:   [RED, [253, 243, 243]],
  }[r.gapVerdictType];

  callout(verdictText, verdictStyle[0], verdictStyle[1]);

  const pct = (x) => (x * 100).toFixed(x < 0.1 ? 1 : 0) + '%';

  row('Your target', `${euro(r.goalRev)} / month`);
  row('Divided by your average client value', euro(r.price));
  row('Clients you need per month', Math.ceil(r.clientsNeeded), { highlight: true });
  row('Your actual conversion rate today', `${r.clientsWon} of ${r.inquiries} = ${pct(r.conversion)}`);
  row(
    "So inquiries needed at today's rate",
    Number.isFinite(r.inquiriesNeededNow) ? `${Math.ceil(r.inquiriesNeededNow)} / month` : '-',
    { highlight: true }
  );
  row(
    `But at a ${pct(r.improvedConversion)} conversion rate`,
    Number.isFinite(r.inquiriesNeededFixed) ? `only ${Math.ceil(r.inquiriesNeededFixed)} / month` : '-'
  );
  y += 3;

  if (Number.isFinite(r.inquiriesNeededNow) && Number.isFinite(r.inquiriesNeededFixed)) {
    const saved = Math.max(0, Math.ceil(r.inquiriesNeededNow) - Math.ceil(r.inquiriesNeededFixed));
    paragraph(
      `That is the whole point: fixing conversion removes ${saved} inquiries a month of pressure from `
      + 'your marketing. Cheaper than finding them.',
      { size: 8 }
    );
  }

  /* ── leak ───────────────────────────────────────────────────── */

  sectionTitle('Where the money is going');

  if (r.leakLines.length) {
    r.leakLines.forEach((l) => {
      row(l.label, euro(l.value), { sub: `assumes ${pct(l.share)} of inquiries` });
    });
    row('Estimated monthly leak', euro(r.monthlyLeak), { highlight: true });
    y += 3;
    paragraph(
      'Every line above is only counted where you told us the system is missing or partial. '
      + 'The percentages are deliberately conservative - the real figure is usually higher.',
      { size: 8 }
    );
  } else {
    paragraph(
      'Nothing to report here. Based on your answers, none of the six systems we measure are leaking '
      + 'revenue - which is genuinely rare.',
      { size: 9, color: GREEN }
    );
  }

  /* ── projection ─────────────────────────────────────────────── */

  if (r.monthlyLeak > 0) {
    sectionTitle('If nothing changes');
    need(30);
    const boxW = (WIDTH - 6) / 2;

    const projBox = (x, amount, label, color) => {
      setDraw(BORDER);
      doc.setLineWidth(0.2);
      doc.rect(x, y, boxW, 24, 'S');
      doc.setFont('helvetica', 'bold').setFontSize(15);
      setText(color);
      doc.text(euro(amount), x + boxW / 2, y + 11, { align: 'center' });
      doc.setFont('helvetica', 'normal').setFontSize(8);
      setText(MUTED);
      doc.text(label, x + boxW / 2, y + 18, { align: 'center' });
    };

    projBox(MARGIN, r.monthlyLeak * 12, 'over the next 12 months', AMBER);
    projBox(MARGIN + boxW + 6, r.monthlyLeak * 36, 'over the next 3 years', RED);
    y += 30;
  }

  /* ── admin ──────────────────────────────────────────────────── */

  if (r.adminHours > 0) {
    sectionTitle('What admin is costing you');
    row(`${r.adminHours} hours a week on admin`, `${Math.round(r.annualAdminHours)} hours a year`);
    row('That is', `${r.adminWeeks.toFixed(1)} full working weeks a year`, { highlight: true });
    y += 3;
    paragraph(
      'Not lost money - lost capacity. That is time you could have spent on the '
      + `${Math.ceil(r.clientsNeeded)} clients your target needs.`,
      { size: 8 }
    );
  }

  /* ── reflection ─────────────────────────────────────────────── */

  if (meta.diagnosisLabel) {
    sectionTitle('Your read vs. the numbers');
    const mathsLabel = {
      leads: 'Not enough inquiries reaching you',
      conversion: 'Inquiries arriving but leaking out before they convert',
      retention: 'Clients not staying long enough',
      admin: 'Admin load capping how much you can take on',
      pricing: 'Your price being too low for the target you set',
    }[r.mathsSays];

    row('You said', meta.diagnosisLabel);
    row('The maths points at', mathsLabel);
    y += 3;
    paragraph(
      r.diagnosisMatches
        ? 'Your instinct matches the data. That is a good sign - you know your business.'
        : 'These do not match. That gap is usually the most valuable thing an audit surfaces.',
      { size: 9, color: INK, italic: true }
    );
  }

  /* ── priority ───────────────────────────────────────────────── */

  if (r.priority) {
    sectionTitle('Start here');
    need(26);
    setDraw(GREEN);
    doc.setLineWidth(0.3);
    const lines = doc.splitTextToSize(
      'This is the single biggest recoverable line in your breakdown above. It addresses '
      + `${r.priority.pillar} and is typically the fastest to put in place.`,
      WIDTH - 30 // leaves room for the right-aligned effort label above
    );
    const h = 14 + lines.length * 4.2;
    doc.rect(MARGIN, y, WIDTH, h, 'S');
    doc.setFont('helvetica', 'bold').setFontSize(11);
    setText(INK);
    doc.text(r.priority.fix, MARGIN + 6, y + 8);
    doc.setFont('helvetica', 'normal').setFontSize(8);
    setText(GREEN);
    doc.text(r.priority.effort, PAGE_W - MARGIN - 6, y + 8, { align: 'right' });
    doc.setFont('helvetica', 'normal').setFontSize(9);
    setText([51, 51, 61]);
    doc.text(lines, MARGIN + 6, y + 14);
    y += h + 6;
  }

  /* ── systems breakdown ──────────────────────────────────────── */

  sectionTitle('Systems breakdown');
  r.pillarResults.forEach((p) => row(p.pillar, p.statusLabel));
  ['Digital Presence', 'Content & Marketing Systems'].forEach((p) =>
    row(p, 'Reviewed within 24h')
  );
  y += 4;

  /* ── next steps ─────────────────────────────────────────────── */

  sectionTitle('What happens next');
  [
    ['Right now - keep this.', 'You are holding it. Send it to a business partner if useful.'],
    ['Within 24 hours - the human half.',
     'A written review of your website and content, which is the part a form genuinely cannot assess. '
     + 'That is a person looking at your actual site, not an automated scan.'],
    ['Then, only if you want it.',
     'A 15-minute walkthrough of the priority fix. No pitch and no obligation - if the report is all '
     + 'you needed, that is a fine outcome.'],
  ].forEach(([title, body], i) => {
    need(16);
    doc.setFont('helvetica', 'bold').setFontSize(9);
    setText(GREEN);
    doc.text(`${i + 1}.`, MARGIN, y + 4);
    setText(INK);
    doc.text(title, MARGIN + 6, y + 4);
    doc.setFont('helvetica', 'normal').setFontSize(8.5);
    setText([51, 51, 61]);
    const lines = doc.splitTextToSize(body, WIDTH - 6);
    doc.text(lines, MARGIN + 6, y + 9);
    y += 9 + lines.length * 3.8 + 4;
  });

  footer();

  const slug = (meta.site || meta.owner || 'report')
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 40);

  doc.save(`scoutra-audit-${slug}.pdf`);
}
