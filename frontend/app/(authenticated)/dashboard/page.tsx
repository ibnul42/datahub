"use client";
import DashboardSection from "./DashboardSection";

export default function DashboardPage() {
  const stats = {
    totalUsers: 100,
    totalCustomers: 50,
    totalEmployees: 25,
    totalAgents: 10,
    totalAccounts: 40,
  };

  return <DashboardSection stats={stats} />;
}
