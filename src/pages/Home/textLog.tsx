import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { AudioLines, MapPin } from 'lucide-react'
import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from './../../components/custom/dataTable'

const TextLogEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        Select a playlist to configure the time range
      </p>
    </div>)
}

const TextLogPresent = () => {
  // Sample data type
  interface User {
    id: string
    name: string
    email: string
    role: string
    status: "active" | "inactive" | "pending"
    createdAt: string
  }

  // Sample data
  const sampleData: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Moderator",
      status: "pending",
      createdAt: "2024-02-01",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@example.com",
      role: "User",
      status: "inactive",
      createdAt: "2024-02-10",
    },
    {
      id: "5",
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-02-15",
    },
    {
      id: "6",
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-02-15",
    },
    {
      id: "7",
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-02-15",
    },
    {
      id: "8",
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-02-15",
    },
  ]

  // Column definitions
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Date",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Time",
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: "Talk Group",
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Duration",
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Transcription",
      enableSorting: false,
    },
  ]

  return (<DataTable
    className="w-full rounded-0"
    columns={columns}
    data={sampleData}
    searchKey="name"
    searchPlaceholder="Search users..."
    showSearch={true}
    showColumnVisibility={true}
    showPagination={false}
    showSorting={true}
    showRowSelection={false}
    emptyMessage="No users found."
    tableHeight="200px"
    enableInfiniteScroll={true}
    onLoadMore={async () => {
      // Simulate loading more data
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Loading more data...')
    }}
    hasMore={true}
  />)
}

export function TextLog({ playlist = true, className }: { playlist?: boolean; className?: string }) {
  return (!playlist ?
    (<Card className={`w-full max-w-sm ${className || ''}`}>
      <CardHeader>
        <CardTitle>TX Log</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        <TextLogEmpty />
      </CardContent>
    </Card>)
    : <TextLogPresent />)
}
