import { TransmissionsTable } from '@/components/custom/transmissionsTable'
import type { RadioTransmission } from '@/hooks/api/transmissions'
import { usePlaylistStore } from '@/stores/playlistStore'

// This component is now replaced by TransmissionsTable

export function TextLog({ 
  playlist, 
  className,
  onTransmissionSelect 
}: { 
  playlist?: boolean; 
  className?: string;
  onTransmissionSelect?: (transmission: RadioTransmission | null) => void;
}) {
  const { selectedTransmission, setSelectedTransmission } = usePlaylistStore()

  const handleTransmissionSelect = (transmission: RadioTransmission | null) => {
    setSelectedTransmission(transmission)
    onTransmissionSelect?.(transmission)
  }

  return (
    <TransmissionsTable 
      className={className} 
      onTransmissionSelect={handleTransmissionSelect}
      selectedTransmissionId={selectedTransmission?.id || null}
    />
  )
}
