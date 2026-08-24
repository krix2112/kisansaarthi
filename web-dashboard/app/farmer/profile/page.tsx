'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [center, setCenter] = useState('Karnal New Anaj Mandi');
  
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-government-text">My Profile</h1>
        <button 
          onClick={() => setEditing(!editing)} 
          className="text-sm font-medium border border-government-border rounded px-4 py-2 hover:bg-gray-50 transition-colors text-government-text"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 border border-government-border shadow-sm rounded space-y-8">
        {/* Core Identity */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-government-text-secondary mb-4 border-b border-government-border pb-2">Identity Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-government-text-secondary uppercase mb-1">Full Name</label>
              <div className="text-government-text font-medium text-lg">Ramesh Kumar</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-government-text-secondary uppercase mb-1">Aadhaar Number</label>
              <div className="text-government-text font-medium text-lg tracking-widest font-mono">XXXX XXXX 1234</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-government-text-secondary uppercase mb-1">Mobile Number</label>
              {editing ? (
                 <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-government-border rounded p-2 focus:ring-1 focus:ring-government-primary" />
              ) : (
                <div className="text-government-text font-medium text-lg">{phone}</div>
              )}
            </div>
          </div>
        </div>

        {/* Agricultural Details */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-government-text-secondary mb-4 border-b border-government-border pb-2">Agricultural Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-government-text-secondary uppercase mb-1">Total Land Owned</label>
              <div className="text-government-text font-medium text-lg">2.5 Acres</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-government-text-secondary uppercase mb-1">Primary Crop</label>
              <div className="text-government-text font-medium text-lg">Wheat (गेहूँ)</div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-government-text-secondary uppercase mb-1">Registered Procurement Centre</label>
              {editing ? (
                <select value={center} onChange={(e) => setCenter(e.target.value)} className="w-full border border-government-border rounded p-2 focus:ring-1 focus:ring-government-primary bg-white">
                  <option value="Karnal New Anaj Mandi">Karnal New Anaj Mandi</option>
                  <option value="Kurukshetra Main Mandi">Kurukshetra Main Mandi</option>
                </select>
              ) : (
                <div className="text-government-text font-medium text-lg">{center}</div>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="pt-4 border-t border-government-border">
            <button onClick={() => setEditing(false)} className="bg-government-primary hover:bg-government-secondary text-white font-medium py-2 px-6 rounded transition-colors w-full md:w-auto">
              Save Changes
            </button>
            <p className="text-xs text-government-text-secondary mt-2">Note: Certain changes may require staff verification at the mandi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
