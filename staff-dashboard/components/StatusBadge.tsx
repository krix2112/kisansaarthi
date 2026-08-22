import React from 'react';

export type StatusVocabulary =
  | 'BOOKED'
  | 'ARRIVED'
  | 'IN_QUEUE'
  | 'PROCURED'
  | 'PAYMENT_PROCESSING'
  | 'PAID';

interface StatusBadgeProps {
  status: StatusVocabulary;
}

const statusStyles: Record<StatusVocabulary, string> = {
  BOOKED: 'bg-blue-100 text-blue-800 border-blue-300',
  ARRIVED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  IN_QUEUE: 'bg-amber-100 text-amber-800 border-amber-300',
  PROCURED: 'bg-teal-100 text-teal-800 border-teal-300',
  PAYMENT_PROCESSING: 'bg-purple-100 text-purple-800 border-purple-300',
  PAID: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};
