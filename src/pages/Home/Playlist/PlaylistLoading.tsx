import { AudioLines } from 'lucide-react'


export function PlaylistLoading() {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">Loading Playlists</h3>
      
      {/* 3-dot bounce animation */}
      <div className="flex justify-center space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
            style={{
              animation: 'bounce-dots 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Fetching available playlists...
      </p>
    </div>
  )
}