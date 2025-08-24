import imgDark  from './../../assets/logo_dark.png'
import imgLight from './../../assets/logo_light.png'


export function LogoArea({ isDark, useText = true }) {
  const CSS_IMG = "h-12 md:h-16 w-auto hover:scale-110 "
  const CSS_H1 = "text-xl md:text-3xl font-bold leading-6"

  return (<>
    <img src={isDark ? imgDark : imgLight} alt="Spectrum Ferret Logo" className={CSS_IMG} />
    
    {useText && <div className="ml-3">
      <h1 className={CSS_H1}>Ferret Echo</h1>
      <p className="text-xs md:text-sm">
        Radio Transmission Analysis Platform
      </p>
    </div>}
  </>)
}
