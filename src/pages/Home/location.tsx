import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Map } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

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

const LocationPresent = () => {
  const position = [51.505, -0.09]; // [latitude, longitude]

  return (<MapContainer 
    center={position} 
    zoom={13} 
    scrollWheelZoom={false}
    style={{ height: 250, width: '100%' }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>)
}

export function Location({ transmission, className }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {transmission ?
          <LocationPresent transmission={transmission} /> : <LocationEmpty />}
      </CardContent>
    </Card>
  )
}
