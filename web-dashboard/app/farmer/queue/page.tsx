export default function QueuePage() {
  const steps = [
    { label: 'Booked', status: 'completed' },
    { label: 'Arrived', status: 'completed' },
    { label: 'In Queue', status: 'current' },
    { label: 'Procured', status: 'upcoming' },
    { label: 'Payment Processing', status: 'upcoming' },
    { label: 'Paid', status: 'upcoming' },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-government-text">Queue & Status</h1>

      {/* Booking Details */}
      <div className="bg-white p-6 border border-government-border shadow-sm rounded grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-government-text-secondary uppercase tracking-wider mb-1">Mandi</div>
          <div className="font-semibold text-government-text">Karnal New Anaj Mandi</div>
        </div>
        <div>
          <div className="text-sm text-government-text-secondary uppercase tracking-wider mb-1">Slot Date & Time</div>
          <div className="font-semibold text-government-text">Tomorrow, 09:00 AM</div>
        </div>
        <div>
          <div className="text-sm text-government-text-secondary uppercase tracking-wider mb-1">Token Number</div>
          <div className="font-semibold text-government-text font-mono tracking-wide">TKN-3842</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stepper */}
        <div className="lg:col-span-2 bg-white p-6 border border-government-border shadow-sm rounded">
          <h2 className="text-lg font-semibold text-government-text mb-6">Procurement Lifecycle</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                  step.status === 'completed' ? 'bg-government-primary border-government-primary text-white' :
                  step.status === 'current' ? 'border-government-primary text-government-primary' :
                  'border-government-border text-government-text-secondary'
                }`}>
                  {step.status === 'completed' ? '✓' : i + 1}
                </div>
                <div className={`font-medium ${
                  step.status === 'completed' ? 'text-government-primary' :
                  step.status === 'current' ? 'text-government-text font-bold' :
                  'text-government-text-secondary'
                }`}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Queue Box */}
        <div className="bg-white p-6 border border-government-border shadow-sm rounded flex flex-col justify-center items-center text-center space-y-4">
          <h3 className="font-semibold text-government-text-secondary uppercase tracking-wider">Live Position</h3>
          <div className="w-32 h-32 rounded-full border-4 border-government-accent flex flex-col justify-center items-center">
            <span className="text-4xl font-bold text-government-primary">14</span>
            <span className="text-xs text-government-text-secondary mt-1">in line</span>
          </div>
          <p className="text-sm font-medium text-government-text">Estimated wait: ~45 mins</p>
          <button className="text-government-primary text-sm font-medium hover:underline mt-2 border border-government-primary rounded px-3 py-1">Refresh</button>
        </div>
      </div>
    </div>
  );
}
