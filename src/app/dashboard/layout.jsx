"use client";

import { DashboardProvider } from "@/context/DashboardContext";

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
