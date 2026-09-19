// Opens a print-ready invoice in a new window so travelers can save it as PDF
// or print it. No external PDF library required.
export function openInvoicePdf({ booking, money, contact, reference, payMethod, payTiming, chargeDateLabel }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dueLabel =
    payMethod === "cash"
      ? "Payable in cash on arrival (USD or KHR)"
      : payTiming === "now"
      ? "Paid in full online"
      : `Due ${chargeDateLabel || "the tour date"}`;

  const methodLabel = {
    bakong: "Bakong KHQR",
    card: "Credit / Debit Card",
    cash: "Cash on arrival",
  }[payMethod] || "Card";

  const unit = Number(money.unit) || 0;
  const qty = Number(booking.guests) || 1;

  const rows = [
    ["Subtotal", `$${(unit * qty).toFixed(2)}`],
  ];
  if (money.discount > 0) rows.push(["Discount", `-$${money.discount.toFixed(2)}`]);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${reference} — SovannDomNour</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #12352a; background: #f3f6f3; padding: 40px 16px; }
  .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #e3e8e3; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(2,70,46,.08); }
  .head { background: linear-gradient(135deg,#022c1e,#0a3d2b); color: #fff; padding: 28px 32px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: .5px; }
  .brand small { display: block; font-weight: 500; font-size: 11px; opacity: .85; margin-top: 4px; letter-spacing: 1.5px; text-transform: uppercase; }
  .doc-tag { text-align: right; }
  .doc-tag h1 { font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
  .doc-tag p { font-size: 12px; opacity: .8; margin-top: 4px; }
  .body { padding: 28px 32px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .card { border: 1px solid #e3e8e3; border-radius: 10px; padding: 14px 16px; }
  .card h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b8f80; font-weight: 700; margin-bottom: 8px; }
  .card p { font-size: 13px; line-height: 1.6; color: #12352a; }
  .card p b { display: block; font-size: 15px; }
  table { width: 100%; border-collapse: collapse; margin-top: 22px; font-size: 13px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b8f80; border-bottom: 2px solid #022c1e; padding: 8px 6px; }
  td { padding: 10px 6px; border-bottom: 1px solid #edf1ed; vertical-align: top; }
  .qty, .num { text-align: right; }
  .line2 { display: block; font-size: 12px; color: #5d7a6e; margin-top: 3px; }
  tfoot td { border-bottom: none; padding-top: 12px; padding-bottom: 2px; }
  tfoot .grand { font-size: 16px; font-weight: 800; color: #022c1e; }
  .status { display: inline-block; margin-top: 18px; background: #fdecc8; color: #7a5b00; font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 999px; }
  .foot { padding: 18px 32px; border-top: 1px solid #e3e8e3; font-size: 12px; color: #5d7a6e; text-align: center; }
  @media print { body { background: #fff; padding: 0; } .sheet { box-shadow: none; border: none; } }
  @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } .head { flex-direction: column; } .doc-tag { text-align: left; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="head">
      <div class="brand">SovannDomNour<small>Cambodian Smart Tourism</small></div>
      <div class="doc-tag"><h1>Invoice</h1><p># ${reference}</p></div>
    </div>
    <div class="body">
      <div class="grid">
        <div class="card">
          <h3>Billed to</h3>
          <p><b>${escapeHtml(contact.fullname || "Traveler")}</b>${contact.email ? escapeHtml(contact.email) : ""}</p>
          <p>${contact.dialCode ? escapeHtml(contact.dialCode) : ""}${contact.phone ? " " + escapeHtml(contact.phone) : ""}</p>
        </div>
        <div class="card">
          <h3>Invoice details</h3>
          <p><b>${today}</b></p>
          <p>${escapeHtml(longDate(booking.date))} • ${escapeHtml(booking.time || "")}</p>
          <p>${qty} adult${qty > 1 ? "s" : ""} • ${escapeHtml(methodLabel)}</p>
        </div>
      </div>

      <table>
        <thead><tr><th>Description</th><th class="qty">Qty</th><th class="num">Unit</th><th class="num">Amount</th></tr></thead>
        <tbody>
          <tr>
            <td>${escapeHtml(booking.title)}<span class="line2">${escapeHtml(booking.subtitle || "")}</span></td>
            <td class="qty">${qty}</td>
            <td class="num">$${unit.toFixed(2)}</td>
            <td class="num">$${(unit * qty).toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          ${rows.map(([label, val]) => `<tr><td colspan="3" class="num">${label}</td><td class="num">${val}</td></tr>`).join("")}
          <tr><td colspan="3" class="num grand">Total</td><td class="num grand">$${money.total.toFixed(2)}</td></tr>
        </tfoot>
      </table>

      <span class="status">✓ ${dueLabel}</span>
    </div>
    <div class="foot">
      Thank you for choosing SovannDomNour. Questions about this invoice? Call +855 275 5071.
    </div>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=820,height=1000");
  if (!win) {
    alert("Please allow pop-ups to download your invoice.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}