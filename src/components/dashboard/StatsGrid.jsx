export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Active Automations', value: stats.totalAccounts, color: 'text-blue-500' },
    { label: 'Leads Generated', value: stats.totalLeads, color: 'text-green-500' },
    { label: 'Responses Sent', value: stats.totalMessages, color: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {items.map((stat, i) => (
        <div key={i} className="bg-white border border-[#D2D2D7] p-8 rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-[#86868B] mb-2">{stat.label}</p>
          <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
