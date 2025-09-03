import { AlertCircle } from 'lucide-react'


export function PlaylistError({ error }: { error: Error }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-red-100 dark:bg-red-900/20">
        <AlertCircle size={36} strokeWidth={1} className="text-red-500" />
      </div>

      <h3 className="font-bold mt-4 mb-2 text-red-600 dark:text-red-400">
        Error Loading Playlists
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {error.message || 'Failed to load playlists. Please try again.'}
      </p>
    </div>
  )
}