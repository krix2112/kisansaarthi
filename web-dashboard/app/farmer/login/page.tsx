'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FarmerLoginPage() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setOtpSent(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) router.push('/farmer/home');
  };

  return (
    <div className="flex-1 flex justify-center items-center p-4 bg-government-bg">
      <div className="max-w-md w-full bg-white p-8 border border-government-border shadow-sm rounded">
        <h2 className="text-2xl font-semibold text-government-primary mb-6">Farmer Login</h2>
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-government-text-secondary mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full border border-government-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-government-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-government-primary hover:bg-government-secondary text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-sm text-government-text-secondary mb-4">
              OTP sent to {phone}. <button type="button" onClick={() => setOtpSent(false)} className="text-government-primary hover:underline">Edit</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-government-text-secondary mb-1">Enter 6-digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full border border-government-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-government-primary text-center tracking-widest text-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-government-primary hover:bg-government-secondary text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
