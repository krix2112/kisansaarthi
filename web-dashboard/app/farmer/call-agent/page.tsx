export default function CallAgentPage() {
  const callOutcomes = [
    { date: 'Oct 12, 2026', time: '10:30 AM', intent: 'Slot Confirmation', outcome: 'Confirmed slot for tomorrow' },
    { date: 'Oct 10, 2026', time: '02:15 PM', intent: 'Price Enquiry', outcome: 'Informed wheat price at Karnal' },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-government-text mb-2">Voice Assistance</h1>
        <p className="text-government-text-secondary">Talk to our AI agent for any queries regarding registration, slots, queue, or payments.</p>
      </div>

      <div className="bg-white p-6 md:p-10 border border-government-border shadow-sm rounded text-center space-y-6">
        <button className="bg-government-accent hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded text-xl shadow-md transition-colors w-full md:w-auto">
          Call KisanSaarthi Now
        </button>
        
        <div className="mt-8 border-t border-government-border pt-8">
          <p className="text-sm text-government-text-secondary mb-2 uppercase tracking-wider font-semibold">Or dial from your phone</p>
          <div className="inline-block border-2 border-government-primary bg-emerald-50 px-8 py-4 rounded">
            <span className="font-mono text-3xl font-bold text-government-primary tracking-wider">1800-11-2026</span>
          </div>
          <p className="text-sm text-government-text-secondary mt-3">Available 8 AM &ndash; 8 PM, Hindi and English</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-government-text mb-4">Past Voice Interactions</h2>
        <div className="bg-white border border-government-border rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-government-bg border-b border-government-border">
              <tr>
                <th className="p-3 font-semibold text-government-text-secondary">Date & Time</th>
                <th className="p-3 font-semibold text-government-text-secondary">Intent</th>
                <th className="p-3 font-semibold text-government-text-secondary">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {callOutcomes.map((call, i) => (
                <tr key={i} className="border-b border-government-border last:border-0 hover:bg-gray-50">
                  <td className="p-3 align-top whitespace-nowrap">{call.date}<br/><span className="text-government-text-secondary text-xs">{call.time}</span></td>
                  <td className="p-3 align-top font-medium">{call.intent}</td>
                  <td className="p-3 align-top text-government-text-secondary">{call.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
