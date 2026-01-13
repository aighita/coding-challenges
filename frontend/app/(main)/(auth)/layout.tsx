import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#020202]">
      {children}
    </div>
  );
}
