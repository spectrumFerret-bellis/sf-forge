import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button }              from "@/components/ui/button"
import { LogoArea }            from "@/components/custom/logoArea"
import { useLogout }           from "@/hooks/api/auth"
import { useThemeStore }       from "@/stores/themeStore"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar"

import { 
  Clock4, TriangleAlert, LogOut, Settings, ArrowLeftFromLine,
  BookOpenText,
  BookUser,
  Palette,
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

export function LayoutAccountNav() {
  const [themeMode, setThemeMode] = useState<[React.ReactNode, string]>([<SunOutlined />, 'Light'])
  const [logo, setLogo]           = useState()

  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const { isDark, toggleDarkMode } = useThemeStore()

  useEffect(() => {
    if (isDark)
      setThemeMode([<SunOutlined />, 'Light Mode'])
    else
      setThemeMode([<MoonOutlined />, 'Dark Mode'])
  }, [isDark])

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
      <Btn
        icon={<BookUser />} 
        label="Account Settings"
        onClick={() => { navigate('/user/settings/account') }} />
      <Btn
        icon={<Palette />} 
        label="Theme Settings"
        onClick={() => { navigate('/user/settings/theme') }} />
      <Btn
        icon={<BookOpenText />} 
        label="Report Settings"
        onClick={() => { navigate('/user/settings/report') }} />
    </Section>

    <Section className="justify-end">
      <Btn icon={<ArrowLeftFromLine />} label="Back to Transmissions" onClick={() => { navigate('/') }} />
      <Btn onClick={toggleDarkMode} icon={themeMode[0]} label={themeMode[1]} />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SF</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>

          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => { navigate("/user/settings") }}
          >
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Section>
  </div>)
}
