import { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button }              from "@/components/ui/button"
import { LogoArea }            from "@/components/custom/logoArea"
import { HelpModal }           from "@/components/custom/HelpModal"
import { useLogout }           from "@/hooks/api/auth"
import { useThemeStore }       from "@/stores/themeStore"

import * as Dropdown from "@/components/ui/dropdown-menu"
import * as Avatar from "@/components/ui/avatar"

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
  className?     : string
  children       : React.ReactNode
}

const Section = ({ className, children }: SectionProps) =>
  <div className={`flex items-center flex-1 ${className || ''}`}>{children}</div>

export function LayoutNav({ isUserSettings = false }) {
  const [themeMode, setThemeMode] = useState<[React.ReactNode, string]>([<SunOutlined />, 'Light'])
  const [logo, setLogo]           = useState()
  const [helpModalOpen, setHelpModalOpen] = useState(false)

  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const isDark = useThemeStore(state => state.isDark)
  const toggleDarkMode = useThemeStore(state => state.toggleDarkMode)

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

  // NOTE: useMemo doesn't look useful here as the building of this data is cheap
  const NavButtons = isUserSettings ?
    [
      {
        icon: <BookUser />,
        label: "Account Settings",
        onClick: () => { navigate('/user/settings/account') },
      },
      {
        icon: <Palette />,
        label: "Theme Settings",
        onClick: () => { navigate('/user/settings/theme') },
      },
      {
        icon: <BookOpenText />,
        label: "Report Settings",
        onClick: () => { navigate('/user/settings/report') },
      },
    ] : [
      {
        icon: <Clock4 />,
        label: "Real-Time",
        onClick: () => { navigate('/') },
      },
      {
        icon: <FolderViewOutlined />,
        label: "Review",
        onClick: () => {},
      },
      {
        icon: <ReconciliationOutlined />,
        label: "Summarize",
        onClick: () => {},
      },
      {
        icon: <TriangleAlert />,
        label: "Alert",
        onClick: () => {},
      },
    ]

  return (
    <>
      <div className="flex w-full items-center py-4 px-10">
        <Section>
          <LogoArea isDark={isDark} route="/" />
        </Section>

        <Section className="justify-center">
          {NavButtons.map( btn => <Btn 
            key={btn.label} 
            icon={btn.icon}
            label={btn.label}
            onClick={btn.onClick} />)}
        </Section>

        <Section className="justify-end">
          <Btn icon={<QuestionOutlined />} label="Help" onClick={() => setHelpModalOpen(true)} />
          <Btn onClick={toggleDarkMode} icon={themeMode[0]} label={themeMode[1]} />

          <Dropdown.DropdownMenu>
            <Dropdown.DropdownMenuTrigger>
              <Avatar.Avatar className="cursor-pointer">
                <Avatar.AvatarImage src="https://github.com/shadcn.png" />
                <Avatar.AvatarFallback>SF</Avatar.AvatarFallback>
              </Avatar.Avatar>
            </Dropdown.DropdownMenuTrigger>
            <Dropdown.DropdownMenuContent>

              <Dropdown.DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => { navigate("/user/settings/account") }}
              >
                <Settings />
                Settings
              </Dropdown.DropdownMenuItem>
              <Dropdown.DropdownMenuItem 
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut />
                Logout
              </Dropdown.DropdownMenuItem>
            </Dropdown.DropdownMenuContent>
          </Dropdown.DropdownMenu>
        </Section>
      </div>
      
      <HelpModal open={helpModalOpen} onOpenChange={setHelpModalOpen} />
    </>
  )
}
