import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showColumnVisibility?: boolean
  showPagination?: boolean
  showSorting?: boolean
  showRowSelection?: boolean
  pageSize?: number
  className?: string
  emptyMessage?: string
  tableHeight?: string
  enableOverflowScroll?: boolean
  enableInfiniteScroll?: boolean
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showSearch = true,
  showColumnVisibility = true,
  showPagination = true,
  showSorting = true,
  showRowSelection = true,
  pageSize = 10,
  className = "",
  tableClassName = "",
  headClassName = "",
  rowClassName = "",
  rowCellClassName = "",
  emptyMessage = "No data available.",
  tableHeight,
  enableOverflowScroll = false,
  enableInfiniteScroll = false,
  onLoadMore,
  hasMore = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: showRowSelection,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleScroll = React.useCallback(() => {
    if (!enableInfiniteScroll || !onLoadMore || isLoadingMore || !hasMore) return

    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const threshold = 100 // pixels from bottom

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setIsLoadingMore(true)
      onLoadMore().finally(() => setIsLoadingMore(false))
    }
  }, [enableInfiniteScroll, onLoadMore, isLoadingMore, hasMore])

  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !enableInfiniteScroll) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll, enableInfiniteScroll])

  const renderTableHead = (sticky) => {
    const HeaderComponent = sticky ? 'thead' : TableHeader
    const RowComponent = sticky ? 'tr' : TableRow
    const HeadComponent = sticky ? 'th' : TableHead
    
    return (
      <HeaderComponent className={sticky ? '[&_tr]:border-b' : ''}>
        {table.getHeaderGroups().map((headerGroup) => (
          <RowComponent key={headerGroup.id} className={sticky ? 'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors' : ''}>
            {showRowSelection && (
              <HeadComponent className={`h-10 ${headClassName} w-12 ${sticky ? 'text-foreground px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] sticky top-0 z-20 bg-background' : ''}`}>
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                />
              </HeadComponent>
            )}
            {headerGroup.headers.map((header) => {
              return (
                <HeadComponent key={header.id} className={`h-10 ${headClassName} ${sticky ? 'text-foreground px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] sticky top-0 z-20 bg-background' : ''}`}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort() && showSorting
                          ? "flex items-center space-x-2 cursor-pointer select-none"
                          : "flex items-center space-x-2"
                      }
                      onClick={header.column.getCanSort() && showSorting ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && showSorting && (
                        <div className="flex flex-col">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </HeadComponent>
              )
            })}
          </RowComponent>
        ))}
      </HeaderComponent>
    )
  }

  const renderTableBody = (sticky = false) => {
    const BodyComponent = sticky ? 'tbody' : TableBody
    const RowComponent = sticky ? 'tr' : TableRow
    const CellComponent = sticky ? 'td' : TableCell

    const CSS_STICKY = sticky ? 'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors' : '';
    const CSS_CELL = `
      text-left 
      ${sticky ? 'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]' : ''}
      ${rowCellClassName}`

    return (
      <BodyComponent className={sticky ? '[&_tr:last-child]:border-0' : ''}>
        {table.getRowModel().rows?.length ? (
          <>
            {table.getRowModel().rows.map((row) => (
              <RowComponent
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${rowClassName} ${CSS_STICKY}`}
              >
                {showRowSelection && (
                  <CellComponent className={CSS_CELL}>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </CellComponent>
                )}
                {row.getVisibleCells().map((cell) => (
                  <CellComponent key={cell.id} className={CSS_CELL}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </CellComponent>
                ))}
              </RowComponent>
            ))}
            {enableInfiniteScroll && isLoadingMore && (
              <RowComponent className={`${rowClassName} ${CSS_STICKY}`}>
                <CellComponent
                  colSpan={columns.length + (showRowSelection ? 1 : 0)}
                  className={CSS_CELL}
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    <span className="ml-2">Loading more...</span>
                  </div>
                </CellComponent>
              </RowComponent>
            )}
          </>
        ) : (
          <RowComponent className={`${rowClassName} ${CSS_STICKY}`}>
            <CellComponent
              colSpan={columns.length + (showRowSelection ? 1 : 0)}
              className={CSS_CELL}
            >
              {emptyMessage}
            </CellComponent>
          </RowComponent>
        )}
      </BodyComponent>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Column Visibility Controls */}
      {(showSearch || showColumnVisibility) && (
        <div className="flex items-center justify-between">
          {showSearch && searchKey && (
            <div className="flex items-center py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn(searchKey)?.setFilterValue(event.target.value)
                  }
                  className="pl-8 max-w-sm"
                />
              </div>
            </div>
          )}
          
          {showColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Table */}
        {enableInfiniteScroll && tableHeight ? (
        <div 
          ref={scrollContainerRef}
          className="overflow-auto border rounded-md"
          style={{ height: tableHeight }}
        >
          <table className={`w-full caption-bottom text-sm ${tableClassName}`}>
            {renderTableHead(true)}
            {renderTableBody(true)}
          </table>
        </div>
      ) : (
        <Table className={tableClassName}>
          {renderTableHead()}
          {renderTableBody()}
        </Table>
      )}

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
