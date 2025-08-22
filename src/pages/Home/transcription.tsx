import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Textarea } from "@/components/ui/textarea"

import { Captions } from 'lucide-react'

const TranscriptionEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <Captions size={40} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No transmission selected</h3>
      <p>
        Select a transmission from the table or timeline to view its transcription
      </p>
    </div>)
}

const TranscriptionPresent = ({ audioRef, audioUrl }) => {
  return (<div className="w-full flex flex-col justify-between h-full gap-4">
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="h-[8px] w-[8px] rounded-full bg-red-500" />
        <p>Fire Dispatch</p>
      </div>
      <p>08/21/2025, 12:34:08</p>
    </div>

    <Textarea className="grow resize-none" />
    <audio ref={audioRef} controls {...(audioUrl && { src: audioUrl })} className="w-full" />
  </div>)
}

export function Transcription({ transmission, className }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Transcription</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {transmission ?
          <TranscriptionPresent transmission={transmission} /> : <TranscriptionEmpty />}
      </CardContent>
    </Card>
  )
}
