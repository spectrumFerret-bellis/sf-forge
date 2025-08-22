import { Channels }      from './channels'
import { LayoutNav }     from './../../layout'
import { Location }      from './location'
import { Metadata }      from './metadata'
import { Playlist }      from './playlist'
import { TimeRange }     from './timeRange'
import { Transcription } from './transcription'
import { TransmissionTimeline } from './transmissionTimeline'
import { LayoutRowCollapsible } from './../../layout/layoutRowCollapsible'

export function PageHome() {
  const CSS_WRAPPER = `
    flex min-h-screen flex-col w-full items-center text-slate-600 dark:text-slate-300
    bg-white/85 dark:bg-slate-900
    `

  const CSS_CONTENT = `
    w-full grow px-10 py-4 bg-gradient-to-br 
    from-white/85 from-20% to-slate-200 to-30%
    dark:from-slate-900 from-20% dark:via-slate-800 dark:via-40% dark:to-slate-900 dark:to-80%
    `

  return (<div className={CSS_WRAPPER}>
    <LayoutNav />

    <div className={CSS_CONTENT}>
      <LayoutRowCollapsible title="Config" className="mb-2">
        <Playlist className="flex-1 max-w-full" />
        <Channels className="flex-1 max-w-full" />
        <TimeRange className="flex-1 max-w-full" />
      </LayoutRowCollapsible>

      <LayoutRowCollapsible title="Timeline" className="mb-2">
        <TransmissionTimeline />
      </LayoutRowCollapsible>

      <LayoutRowCollapsible title="Config" className="mb-2">
        <Playlist className="flex-1 max-w-full" />
      </LayoutRowCollapsible>

      <LayoutRowCollapsible title="Config">
        <Transcription className="flex-1 max-w-full" />
        <Metadata className="flex-1 max-w-full" />
        <Location className="flex-1 max-w-full" />
      </LayoutRowCollapsible>
    </div>
  </div>)
}
