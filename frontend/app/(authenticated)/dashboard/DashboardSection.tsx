"use client";

interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalEmployees: number;
  totalAgents: number;
  totalAccounts: number;
}

interface DashboardSectionProps {
  stats: DashboardStats;
}

export default function DashboardSection({ stats }: DashboardSectionProps) {
  return (
    <section className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">📊 Dashboard</h2>
        <p className="text-gray-600">Overview of your database system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          color="blue"
          icon="👥"
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          color="green"
          icon="📋"
          label="Customers"
          value={stats.totalCustomers}
        />
        <StatCard
          color="purple"
          icon="👨‍💼"
          label="Employees"
          value={stats.totalEmployees}
        />
        <StatCard
          color="yellow"
          icon="📱"
          label="m-Cash Agents"
          value={stats.totalAgents}
        />
        <StatCard
          color="orange"
          icon="🏦"
          label="Customer Records"
          value={stats.totalAccounts}
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            bgColor="green"
            icon="✅"
            title="Database Connected"
            subtitle="All systems operational"
          />
          <StatusCard
            bgColor="blue"
            icon="🔒"
            title="Secure Connection"
            subtitle="SSL/TLS enabled"
          />
          <StatusCard
            bgColor="purple"
            icon="⚡"
            title="High Performance"
            subtitle="Optimized queries"
          />
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  color: "blue" | "green" | "purple" | "yellow" | "orange";
  icon: string;
  label: string;
  value: number;
}

function StatCard({ color, icon, label, value }: StatCardProps) {
  const borderColors = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    yellow: "border-yellow-500",
    orange: "border-orange-500",
  };

  return (
    <div
      className={`bg-white overflow-hidden shadow-lg rounded-lg border-l-4 ${borderColors[color]}`}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-2xl">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {label}
              </dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusCardProps {
  bgColor: "green" | "blue" | "purple";
  icon: string;
  title: string;
  subtitle: string;
}

function StatusCard({ bgColor, icon, title, subtitle }: StatusCardProps) {
  const bgColors = {
    green: "bg-green-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
  };

  const textColors = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };

  const titleColors = {
    green: "text-green-900",
    blue: "text-blue-900",
    purple: "text-purple-900",
  };

  const subtitleColors = {
    green: "text-green-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
  };

  return (
    <div className={`${bgColors[bgColor]} text-center p-4 rounded-lg`}>
      <div className={`text-2xl ${textColors[bgColor]} mb-2`}>{icon}</div>
      <div className={`text-sm font-medium ${titleColors[bgColor]}`}>
        {title}
      </div>
      <div className={`text-xs ${subtitleColors[bgColor]}`}>{subtitle}</div>
    </div>
  );
}
