import React from "react";
import AppShell from "@/components/layout/AppShell";

export default function SkeletonDashboard() {
  return (
    <AppShell>
      <div className="h-screen flex flex-col bg-background relative overflow-hidden">
        {/* Mobile Header Skeleton */}
        <div className="sm:hidden h-14 border-b border-zinc-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
          <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
          <div className="w-24 h-6 rounded bg-zinc-200 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
        </div>

        <div className="flex flex-1 relative overflow-hidden">
          {/* Sidebar Skeleton */}
          <div className="hidden sm:flex w-64 border-r border-zinc-200/60 bg-white/40 flex-col p-4">
            <div className="w-32 h-8 rounded bg-zinc-200 animate-pulse mb-8" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-full h-10 rounded-sm bg-zinc-200/60 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <main className="flex-1 p-4 sm:p-5 flex flex-col">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-48 h-8 rounded bg-zinc-200 animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="w-32 h-8 rounded-sm bg-zinc-200 animate-pulse hidden md:block" />
                <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-sm border border-zinc-200 bg-white/80 backdrop-blur-md h-28 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 rounded bg-zinc-200 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
                  </div>
                  <div className="w-16 h-8 rounded bg-zinc-200 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Main Section */}
            <div className="flex-1 rounded-sm border border-zinc-200 bg-white/80 backdrop-blur-md p-6 shadow-sm">
              <div className="w-40 h-6 rounded bg-zinc-200 animate-pulse mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 rounded-sm bg-zinc-100 animate-pulse" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
}
