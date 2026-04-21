import { Clock } from 'lucide-react'

export default function ActivityFeed({ logs }) {
  return (
    <div className="bg-white border border-[#D2D2D7] rounded-2xl p-8 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-8 border-b border-[#F5F5F7] pb-4">
        <Clock size={20} className="text-[#86868B]" />
        <h2 className="text-xl font-bold">Recent Activity</h2>
      </div>
      
      <div className="space-y-6">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium leading-tight">
                  {log.metadata?.content || 'Automated response sent'}
                </p>
                <p className="text-xs text-[#86868B] mt-1">
                  {new Date(log.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#86868B] text-sm italic">No recent activity logs.</p>
        )}
      </div>
    </div>
  )
}
