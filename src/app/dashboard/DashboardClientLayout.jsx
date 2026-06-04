"use client";

import { DashboardProvider } from "@/context/DashboardContext";

export default function DashboardClientLayout({ children, initialData }) {
    return (
        <DashboardProvider initialData={initialData}>
            {children}
        </DashboardProvider>
    );
}
