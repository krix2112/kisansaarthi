export default function PricePage() {
  const prices = [
    { crop: 'Wheat (गेहूँ)', mandi: 'Karnal New Anaj Mandi', min: 2100, max: 2275, modal: 2250, date: 'Oct 12, 2026' },
    { crop: 'Paddy (धान)', mandi: 'Karnal New Anaj Mandi', min: 2040, max: 2203, modal: 2183, date: 'Oct 12, 2026' },
    { crop: 'Wheat (गेहूँ)', mandi: 'Kurukshetra Main Mandi', min: 2110, max: 2280, modal: 2260, date: 'Oct 12, 2026' },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-semibold text-government-text">Mandi Prices</h1>
        <div className="text-sm text-government-text-secondary text-right">
          Source: <span className="font-semibold text-government-primary">data.gov.in &middot; Agmarknet</span><br/>
          Last fetched: Oct 12, 2026 06:00 AM
        </div>
      </div>

      <div className="bg-white border border-government-border rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-government-bg border-b border-government-border">
            <tr>
              <th className="p-4 font-semibold text-government-text-secondary">Crop</th>
              <th className="p-4 font-semibold text-government-text-secondary">Mandi</th>
              <th className="p-4 font-semibold text-government-text-secondary text-right">Min (₹/q)</th>
              <th className="p-4 font-semibold text-government-text-secondary text-right">Max (₹/q)</th>
              <th className="p-4 font-semibold text-government-text-secondary text-right">Modal (₹/q)</th>
              <th className="p-4 font-semibold text-government-text-secondary">Date</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p, i) => (
              <tr key={i} className="border-b border-government-border last:border-0 hover:bg-emerald-50 transition-colors">
                <td className="p-4 font-medium">{p.crop}</td>
                <td className="p-4 text-government-text-secondary">{p.mandi}</td>
                <td className="p-4 text-right text-government-text-secondary">{p.min}</td>
                <td className="p-4 text-right text-government-text-secondary">{p.max}</td>
                <td className="p-4 text-right font-bold text-government-primary">{p.modal}</td>
                <td className="p-4 text-government-text-secondary text-xs">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
