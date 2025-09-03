import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { RadioTransmission } from '@/hooks/api/transmissions'


const isValidCoordinate = (lat: number | null | undefined, lon: number | null | undefined): boolean => {
  if (lat === null || lat === undefined || lon === null || lon === undefined) return false
  const latNum = Number(lat)
  const lonNum = Number(lon)
  return latNum !== 0 && lonNum !== 0 && !isNaN(latNum) && !isNaN(lonNum)
}


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


export function LocationPresent({ transmission }: { transmission: RadioTransmission }) {
  const { position, type } = useMemo(() => 
    getValidCoordinates(transmission), 
    [transmission.rip_rx_latitude, transmission.rip_rx_longitude, transmission.tx_latitude, transmission.tx_longitude]
  )

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