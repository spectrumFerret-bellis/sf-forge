import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Map } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { RadioTransmission } from '@/hooks/api/transmissions'
import { usePlaylistStore } from '@/stores/playlistStore'

const LocationEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <Map size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No transmission selected</h3>
      <p>
        Select a transmission to view its location information
      </p>
    </div>)
}

// Helper function to validate coordinates (following sf-echo pattern)
const isValidCoordinate = (lat: number | null | undefined, lon: number | null | undefined): boolean => {
  if (lat === null || lat === undefined || lon === null || lon === undefined) return false
  const latNum = Number(lat)
  const lonNum = Number(lon)
  return latNum !== 0 && lonNum !== 0 && !isNaN(latNum) && !isNaN(lonNum)
}

// Helper function to get valid coordinates with priority
const getValidCoordinates = (transmission: RadioTransmission): { position: [number, number]; type: 'rx' | 'tx' | null } => {
  const hasValidRxCoordinates = isValidCoordinate(transmission.rip_rx_latitude, transmission.rip_rx_longitude)
  const hasValidTxCoordinates = isValidCoordinate(transmission.tx_latitude, transmission.tx_longitude)

  if (hasValidRxCoordinates) {
    return {
      position: [Number(transmission.rip_rx_latitude), Number(transmission.rip_rx_longitude)],
      type: 'rx'
    }
  } else if (hasValidTxCoordinates) {
    return {
      position: [Number(transmission.tx_latitude), Number(transmission.tx_longitude)],
      type: 'tx'
    }
  } else {
    // Default position if no valid coordinates
    return {
      position: [39.987600, -105.222300] as [number, number], // Boulder area as default
      type: null
    }
  }
}

const LocationPresent = ({ transmission }: { transmission: RadioTransmission }) => {
  const { position, type } = getValidCoordinates(transmission)

  const getMarkerColor = (type: 'rx' | 'tx') => {
    return type === 'rx' ? '#10b981' : '#3b82f6' // Green for RX, Blue for TX
  }

  const getMarkerTitle = (type: 'rx' | 'tx') => {
    return type === 'rx' ? 'Receiver Location' : 'Transmitter Location'
  }

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: 250, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {type && (
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

interface LocationProps {
  className?: string
}

export function Location({ className }: LocationProps) {
  const { selectedTransmission } = usePlaylistStore()
  
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {selectedTransmission ? (
          <LocationPresent transmission={selectedTransmission} />
        ) : (
          <LocationEmpty />
        )}
      </CardContent>
    </Card>
  )
}
