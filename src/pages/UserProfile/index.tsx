import { Routes, Route }    from 'react-router-dom'
import { LayoutAccountNav } from './../../layout'
import { SectionProfile }   from './profile'
import { SectionTheming }   from './theming'
import { SectionReporting } from './reporting'

import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"


export function PageUserProfile () {
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
      <LayoutAccountNav />

      <div className={CSS_CONTENT}>
        <Routes>
          <Route path="account" element={<SectionProfile />} />
          <Route path="theme" element={<SectionTheming />} />
          <Route path="report" element={<SectionReporting />} />
        </Routes>
      </div>
    </div>)
}