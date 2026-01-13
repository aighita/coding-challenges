import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#020202]">
      <div className="container mx-auto p-4 pt-[100px] sm:pt-[140px] md:pt-[180px]">
        {children}
      </div>
    </div>
  );
}
