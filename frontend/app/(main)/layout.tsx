import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#020202]">
      <div className="container mx-auto p-4 pt-[140px] sm:pt-[180px] md:pt-[220px]">
        {children}
      </div>
    </div>
  );
}
