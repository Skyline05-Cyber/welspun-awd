// ── Export to CSV (opens in Excel) ──
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) { alert('No data to export.'); return; }
  const headers = Object.keys(data[0]);
  const rows    = data.map(row => headers.map(h => `"${(row[h]||'').toString().replace(/"/g,'""')}"`).join(','));
  const csv     = [headers.join(','), ...rows].join('\n');
  const blob    = new Blob(['\ufeff'+csv], { type:'text/csv;charset=utf-8;' });
  const url     = URL.createObjectURL(blob);
  const link    = document.createElement('a');
  link.href     = url;
  link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ── Export to PDF (print dialog) ──
export function exportToPDF(title, data, columns) {
  if (!data || data.length === 0) { alert('No data to export.'); return; }

  const rows = data.map(row =>
    `<tr>${columns.map(c=>`<td style="padding:6px 10px;border:1px solid #ddd;font-size:12px;">${row[c.key]||'—'}</td>`).join('')}</tr>`
  ).join('');

  const html = `<html><head><title>${title}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#1e1432;}
      h1{font-size:20px;margin-bottom:4px;color:#7c3aed;}
      p{font-size:12px;color:#888;margin-bottom:20px;}
      table{border-collapse:collapse;width:100%;}
      th{background:#7c3aed;color:white;padding:8px 10px;font-size:12px;text-align:left;}
      tr:nth-child(even){background:#f5f3f7;}
      .footer{margin-top:20px;font-size:11px;color:#aaa;}
    </style></head>
    <body>
      <h1>${title}</h1>
      <p>Welspun Pvt. Ltd. · AWD Textile · Exported on ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr>${columns.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Total: ${data.length} records · Welspun AWD v2.1</div>
    </body></html>`;

  const win = window.open('','_blank');
  win.document.write(html);
  win.document.close();
  win.print();
}