export default function DashboardLoading() {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar skeleton */}
      <div className="w-60 bg-white border-r border-zinc-100 p-3 flex flex-col gap-2">
        <div className="h-7 w-28 mb-2 bg-zinc-100 rounded-lg animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-full bg-zinc-50 rounded-xl animate-pulse" />
        ))}
      </div>
      {/* Main skeleton */}
      <div className="flex flex-col flex-1">
        <div className="h-14 border-b border-zinc-100 bg-white flex items-center px-4 gap-3">
          <div className="h-7 w-32 bg-zinc-100 rounded-lg animate-pulse" />
          <div className="ml-auto h-7 w-28 bg-zinc-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-white">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 animate-pulse" />
          <div className="h-6 w-48 bg-zinc-100 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-zinc-50 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-full bg-zinc-50 rounded-xl border border-zinc-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
