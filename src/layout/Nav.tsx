import { useState, useEffect } from 'react'
import { Button }              from "@/components/ui/button"
import { LogoArea }            from "@/components/custom/logoArea"

import { 
  Clock4, TriangleAlert
} from "lucide-react"

import { 
  FolderViewOutlined, QuestionOutlined, ReconciliationOutlined,
  SunOutlined, MoonOutlined
} from '@ant-design/icons'


const Btn = ({ icon, label, onClick }) => (<Button 
  className="cursor-pointer rounded-xs mx-1" 
  onClick={onClick} variant="secondary" 
  size="sm">{icon}{label}</Button>)


const Section = ({ className, children }) =>
  <div className={`flex items-center flex-1 ${className}`}>{children}</div>


export function LayoutNav() {
  const [isDark, setIsDark]       = useState(false)
  const [themeMode, setThemeMode] = useState([<SunOutlined />, 'Light'])
  const [logo, setLogo]           = useState()

  useEffect(() => {
    if (isDark)
      setThemeMode([<SunOutlined />, 'Light Mode'])
    else
      setThemeMode([<MoonOutlined />, 'Dark Mode'])

    // Set Dark mode on html ELE of DOM 
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleDarkMode = () => { setIsDark(!isDark) }


  return (<div className="flex w-full items-center py-4 px-6">
    <Section>
      <LogoArea isDark={isDark} />
    </Section>

    <Section className="justify-center">
      <Btn icon={<Clock4 />} label="Real-Time" />
      <Btn icon={<FolderViewOutlined />} label="Review" />
      <Btn icon={<ReconciliationOutlined />} label="Summarize" />
      <Btn icon={<TriangleAlert />} label="Alert" />
    </Section>

    <Section className="justify-end">
      <Btn icon={<QuestionOutlined />} label="Help" />
      <Btn onClick={toggleDarkMode} icon={themeMode[0]} label={themeMode[1]} />
      <Btn label="Logout" />
    </Section>
  </div>)
}
