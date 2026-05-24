import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import KebabButton from "../common/KebabButton"

interface CardOption<T> {
  label: string
  icon?: React.ReactNode
  onClick: (item: T) => void
  className?: string
  separator?: boolean
}

interface CardGridProps<T> {
  items: T[]
  getKey: (item: T) => string | number
  getTitulo: (item: T) => string
  cardOptions: CardOption<T>[]
  renderContent: (item: T) => React.ReactNode
  onItemClick?: (item: T) => void
  isLoading?: boolean
}



export default function CardGrid<T>({ items, getKey, getTitulo, cardOptions, renderContent, onItemClick, isLoading = false }: CardGridProps<T>) {
  
  if (isLoading) {
    return (
      <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-md animate-pulse">
            <CardHeader className="flex items-start justify-between">
              <div className="h-6 w-2/3 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-6 w-6 bg-gray-200 rounded-full dark:bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-700" />
              <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-700" />
              <div className="h-4 bg-gray-200 rounded w-4/5 dark:bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={getKey(item)} className="shadow-md hover:shadow-lg transition"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('[data-radix-collection-item]')) return
          if ((e.target as HTMLElement).closest('button')) return
          onItemClick?.(item)
        }}>
          <CardHeader className="flex items-start justify-between">
            <CardTitle className="text-lg flex-1 truncate pr-2">
              {getTitulo(item)}
            </CardTitle>

            {cardOptions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild >
                  <KebabButton />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {cardOptions.map((option, i) => (
                    <div key={i}>
                      {option.separator && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        className={option.className}
                        onClick={() => setTimeout(() => option.onClick(item), 0)}>
                        {option.icon}
                        {option.label}
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>

          <CardContent className="space-y-1 text-sm text-gray-500">
            {renderContent(item)}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}