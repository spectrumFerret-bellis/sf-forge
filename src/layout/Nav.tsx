import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button }              from "@/components/ui/button"
import { LogoArea }            from "@/components/custom/logoArea"
import { useLogout }           from "@/hooks/api/auth"

import { 
  Clock4, TriangleAlert, LogOut
} from "lucide-react"

import { 
  FolderViewOutlined, QuestionOutlined, ReconciliationOutlined,
  SunOutlined, MoonOutlined
} from '@ant-design/icons'

interface BtnProps {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
}

const Btn = ({ icon, label, onClick }: BtnProps) => (<Button 
  className="cursor-pointer rounded-xs mx-1" 
  onClick={onClick} variant="secondary" 
  size="sm">{icon}{label}</Button>)

interface SectionProps {
  className?: string
  children: React.ReactNode
}

const Section = ({ className, children }: SectionProps) =>
  <div className={`flex items-center flex-1 ${className || ''}`}>{children}</div>

export function LayoutNav() {
  const [isDark, setIsDark]       = useState(false)
  const [themeMode, setThemeMode] = useState<[React.ReactNode, string]>([<SunOutlined />, 'Light'])
  const [logo, setLogo]           = useState()

  const navigate = useNavigate()
  const logoutMutation = useLogout()

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

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      // Navigate to login page after successful logout
      navigate('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigate('/auth')
    }
  }

  return (<div className="flex w-full items-center py-4 px-10">
    <Section>
      <LogoArea isDark={isDark} />
    </Section>

    <Section className="justify-center">
      <Btn icon={<Clock4 />} label="Real-Time" onClick={() => {}} />
      <Btn icon={<FolderViewOutlined />} label="Review" onClick={() => {}} />
      <Btn icon={<ReconciliationOutlined />} label="Summarize" onClick={() => {}} />
      <Btn icon={<TriangleAlert />} label="Alert" onClick={() => {}} />
    </Section>

    <Section className="justify-end">
      <Btn icon={<QuestionOutlined />} label="Help" onClick={() => {}} />
      <Btn onClick={toggleDarkMode} icon={themeMode[0]} label={themeMode[1]} />
      <Btn 
        icon={<LogOut />} 
        label="Logout" 
        onClick={handleLogout}
      />
    </Section>
  </div>)
}
