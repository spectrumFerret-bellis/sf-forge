import * as Card from "@/components/ui/card"


export function CardWrapper({ title, className, contentClassName, children }) {
  return (
    <Card.Card className={`w-full max-w-sm ${className}`}>
      <Card.CardHeader>
        <Card.CardTitle>{title}</Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent 
        className={`
          pb-5 h-full justify-center items-center flex 
          text-slate-600 dark:text-slate-300 ${contentClassName}`}
      >
        {children}
      </Card.CardContent>
    </Card.Card>
  )
}

export function CardEmptyContent({ icon, title, description }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        {icon}
      </div>

      <h3 className="font-bold mt-4 mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}