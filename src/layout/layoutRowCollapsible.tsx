import { CaretDownFilled } from '@ant-design/icons'

export function LayoutRowCollapsible({ title, children, className }) {
  const CSS_ROW = `
    flex w-full
    `

  return (<div className={`${CSS_ROW} ${className}`}>
    {/* Collapse Action */}
    <div className=" rounded-tl-md rounded-bl-md px-1 pt-2 pb-6 flex flex-col items-center text-center bg-slate-300 dark:bg-gray-850">
      <CaretDownFilled />
      <div className="h-full flex items-center">
        <p className="rotate-180 [writing-mode:vertical-lr]">
          {title}
        </p>
      </div>
    </div>

    <div className="flex gap-4 w-full px-6 py-4 bg-white rounded-tr-md rounded-br-md border-t-1 border-r-1 border-b-1 bg-white dark:bg-slate-750">
      {children}
    </div>
  </div>)
}