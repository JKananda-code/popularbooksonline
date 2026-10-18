// Chapter body parser — shared by the digital reader (/) and the paperback (/paperback).
// Parses the lightweight block syntax used across all NCB chapters:
//   ## Heading                                    → <h3 class="ncb-heading">
//   ::tip / ::warn / ::quiz / ::answer / ::check  → <div class="callout callout-...">
//   - bullet                                       → <ul class="ncb-list"><li>
//   | col1 | col2 |                                → <table class="ncb-table">
//   **bold**                                       → <strong>

import React from 'react';

const CALLOUT_TYPES = {
  tip: 'callout-tip',
  warn: 'callout-warn',
  quiz: 'callout-quiz',
  answer: 'callout-answer',
  check: 'callout-check',
  note: '',
};

// Human-readable labels for each callout kind (used in print/paperback via data-attr).
const CALLOUT_LABELS = {
  tip: 'Blueprint Secret',
  warn: 'Warning',
  quiz: 'Reality Check',
  answer: 'Mzee Johana Says',
  check: 'Checklist',
  note: 'Note',
};

export function renderInline(text) {
  const parts = String(text || '').split(/(\*\*[^*]+\*\*)/g);
  return parts.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return <strong key={i}>{seg.slice(2, -2)}</strong>;
    }
    return <span key={i}>{seg}</span>;
  });
}

export function ChapterBody({ content }) {
  const nodes = [];
  const lines = String(content || '').split('\n');
  let i = 0;
  let key = 0;

  const flushBuffer = (buf, out) => {
    if (!buf.length) return;
    let run = [];
    let inList = false;
    const pushRun = () => {
      if (!run.length) return;
      if (inList) {
        out.push(
          <ul key={key++} className="ncb-list">
            {run.map((li, j) => <li key={j}>{renderInline(li)}</li>)}
          </ul>
        );
      } else {
        const text = run.join(' ');
        out.push(<p key={key++}>{renderInline(text)}</p>);
      }
      run = [];
    };
    for (const line of buf) {
      const bulletMatch = line.match(/^\s*[-•]\s+(.*)$/);
      if (bulletMatch) {
        if (!inList) { pushRun(); inList = true; }
        run.push(bulletMatch[1]);
      } else {
        if (inList) { pushRun(); inList = false; }
        run.push(line);
      }
    }
    pushRun();
  };

  let paraBuf = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushBuffer(paraBuf, nodes);
      paraBuf = [];
      i++;
      continue;
    }

    // Heading
    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      flushBuffer(paraBuf, nodes); paraBuf = [];
      nodes.push(<h3 key={key++} className="ncb-heading">{renderInline(h2[1])}</h3>);
      i++;
      continue;
    }

    // Callout
    const openMatch = trimmed.match(/^::(tip|warn|quiz|answer|check|note)\s*$/);
    if (openMatch) {
      flushBuffer(paraBuf, nodes); paraBuf = [];
      const type = openMatch[1];
      const inner = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '::') {
        inner.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim() === '::') i++;

      const innerNodes = [];
      const innerBuf = [];
      const flushInner = () => { flushBuffer(innerBuf, innerNodes); innerBuf.length = 0; };
      for (const ln of inner.join('\n').split('\n')) {
        if (ln.trim() === '') flushInner();
        else innerBuf.push(ln);
      }
      flushInner();

      const cls = 'callout ' + (CALLOUT_TYPES[type] || '');
      nodes.push(
        <div
          key={key++}
          className={cls}
          data-callout-label={CALLOUT_LABELS[type] || ''}
        >
          {innerNodes}
        </div>
      );
      continue;
    }

    // Markdown table
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length) {
      const sepLine = lines[i + 1].trim();
      if (/^\|(\s*:?-+:?\s*\|)+$/.test(sepLine)) {
        flushBuffer(paraBuf, nodes); paraBuf = [];
        const parseRow = (raw) =>
          raw.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        const headers = parseRow(trimmed);
        i += 2;
        const rows = [];
        while (i < lines.length) {
          const l = lines[i].trim();
          if (!l.startsWith('|') || !l.endsWith('|')) break;
          rows.push(parseRow(l));
          i++;
        }
        nodes.push(
          <div key={key++} className="ncb-table-wrap">
            <table className="ncb-table">
              <thead>
                <tr>{headers.map((h, hi) => <th key={hi}>{renderInline(h)}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r, ri) => (
                  <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderInline(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    paraBuf.push(trimmed);
    i++;
  }
  flushBuffer(paraBuf, nodes);

  return <>{nodes}</>;
}
