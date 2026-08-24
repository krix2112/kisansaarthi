'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToken('TKN-' + Math.floor(1000 + Math.random() * 9000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl bg-white p-8 border border-government-border shadow-sm rounded text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">✓</div>
        <h2 className="text-2xl font-semibold text-government-text mb-2">Registration Successful</h2>
        <p className="text-government-text-secondary mb-6">Your procurement request has been submitted.</p>
        <div className="bg-government-bg p-6 rounded border border-government-border mb-6">
          <div className="text-sm text-government-text-secondary uppercase tracking-wider mb-1">Your Token Number</div>
          <div className="text-3xl font-bold text-government-primary">{token}</div>
        </div>
        <button onClick={() => setSubmitted(false)} className="bg-government-primary hover:bg-government-secondary text-white font-medium py-2 px-6 rounded transition-colors">
          Book Another Slot
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl bg-white p-6 md:p-8 border border-government-border shadow-sm rounded">
      <h2 className="text-xl font-semibold text-government-text mb-6">New Procurement Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-government-text-secondary mb-1">Crop</label>
            <select className="w-full border border-government-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-government-primary bg-white" required>
              <option value="">Select Crop</option>
              <option value="wheat">Wheat (गेहूँ)</option>
              <option value="paddy">Paddy (धान)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-government-text-secondary mb-1">Estimated Quantity (Quintals)</label>
            <input type="number" min="1" className="w-full border border-government-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-government-primary" placeholder="e.g. 50" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-government-text-secondary mb-1">Preferred Centre</label>
            <select className="w-full border border-government-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-government-primary bg-white" required>
              <option value="">Select Mandi</option>
              <option value="mandi1">Karnal New Anaj Mandi</option>
              <option value="mandi2">Kurukshetra Main Mandi</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-government-text-secondary mb-1">Preferred Date</label>
            <input type="date" className="w-full border border-government-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-government-primary" required />
          </div>
        </div>
        <div className="pt-4 border-t border-government-border">
          <button type="submit" className="w-full md:w-auto bg-government-primary hover:bg-government-secondary text-white font-medium py-2 px-8 rounded transition-colors">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}
