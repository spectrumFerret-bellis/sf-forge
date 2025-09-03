import { Fragment }          from 'react'
import * as Dialog           from "@/components/ui/dialog"
import { Badge }             from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator }         from "@/components/ui/separator"
import { ScrollArea }        from "@/components/ui/scroll-area"

import {
  ListInfo,
  keyboardNav,
  CSS_H2,
  CSS_H3,
  CSS_UL,
} from './consts'

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}


function KeyBoardNavInfo({ data, prefix }) {
  return (<>
    <h3 className={CSS_H3}>{data.title}</h3>

    {data.items.map( (item, i) => {
      let internalCss;

      if (i === data.items.length - 1)
        internalCss = "flex items-center space-x-2"
      else
        internalCss = "flex items-center space-x-2 mb-2"

      return (<div className={internalCss} key={`${prefix}-${i}`}>
        <Badge variant="secondary" className="font-mono">{item.badge}</Badge>
        <span>{item.description}</span>
      </div>)
    })}
  </>)
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog.Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.DialogContent className="sm:max-w-9/10">
        <Dialog.DialogHeader className="border-b-1">
          <Dialog.DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
            SF Echo
          </Dialog.DialogTitle>
          <Dialog.DialogDescription className="text-base italic text-slate-600">
            Radio Transmission Monitoring & Analysis Platform
          </Dialog.DialogDescription>
        </Dialog.DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <h2 className={CSS_H2}>📖 What is SF Echo?</h2>

          <div className="space-y-6 mt-4">
            {/* What is SF Echo */}
            <section className="flex gap-4">
              <div className="flex-1 items-start">
                <p className="text-slate-700 leading-relaxed w-8/10">
                  SF Echo is a web-based application for monitoring, viewing, and 
                  analyzing radio transmissions in real-time. 

                  It provides a comprehensive interface for browsing transmission data, 
                  viewing transcriptions, and managing audio playback.
                </p>

                <h3 className={CSS_H3}>{ListInfo.dataSources.title}</h3>
                <ul className={`${CSS_UL} text-slate-700 ml-4`}>
                  {ListInfo.dataSources.items.map( (item, i) =>
                    <Fragment key={`dataSources-${i}`}>{item}</Fragment>)}
                </ul>
              </div>
            </section>

            {/* Keyboard Navigation */}
            <section>
              <h2 className={CSS_H2}>
                ⌨️ Keyboard Navigation
              </h2>
              
              <div className="flex">
                <div className="flex-1 text-sm">
                  <KeyBoardNavInfo 
                    data={keyboardNav.tableNavigation} 
                    prefix="tableNavigation" />
                </div>

                <div className="flex-1 text-sm">
                  <div className="mb-4">
                    <KeyBoardNavInfo 
                      data={keyboardNav.general} 
                      prefix="general" />
                  </div>


                  <div>
                    <KeyBoardNavInfo 
                      data={keyboardNav.advanced} 
                      prefix="advanced" />
                  </div>
                </div>
              </div>
            </section>

            {/* Interface Guide */}
            <section>
              <h2 className={CSS_H2}>{ListInfo.interfaceGuide.title}</h2>
              
              <div className="flex">
                {ListInfo.interfaceGuide.items.map( section => {
                  return (<div className="flex-1">
                    <h3 className={CSS_H3}>{section.title}</h3>
                    <ul className={`${CSS_UL} text-slate-700 text-base`}>
                      {section.items.map( (item, i) =>
                        <Fragment key={`${section.title}-${i}`}>{item}</Fragment>)}
                    </ul>
                  </div>)
                })}
              </div>
            </section>

            {/* Tips */}
            <section>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    {ListInfo.navigationTips.title}
                  </h3>

                  <ul className={`${CSS_UL} text-blue-700`}>
                    {ListInfo.navigationTips.items.map( (item, i) =>
                      <Fragment key={`navigationTips-${i}`}>{item}</Fragment>)}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200 mt-4">
                <CardContent className="pt-4">
                  <h3 className="text-lg font-medium text-green-800 mb-2">💡 Pro Tip</h3>
                  <p className="text-green-700">
                    Use the keyboard shortcuts for efficient navigation. Double-click 
                    any transmission to start playback immediately, or use the arrow 
                    keys to browse and Enter to play.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Data Export */}
            <section>
              <h2 className={CSS_H2}>
                📊 Data Export
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Export your filtered transmission data to CSV format for external analysis. 
                The export includes all visible columns and respects your current filters.
              </p>
            </section>

            {/* Technical Notes */}
            <section>
              <h2 className={CSS_H2}>{ListInfo.technicalNotes.title}</h2>

              <ul className={`${CSS_UL} text-slate-700`}>
                {ListInfo.technicalNotes.items.map( (item, i) =>
                  <Fragment key={`technicalNotes-${i}`}>{item}</Fragment>)}
              </ul>
            </section>

            <Separator />
            
            <div className="text-center text-sm text-slate-500">
              <strong>Spectrum Ferret</strong> • SF Echo v1.0<br />
              For support, contact your system administrator
            </div>
          </div>
        </ScrollArea>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}
