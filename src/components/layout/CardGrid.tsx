import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Loading } from "../common/LoadingState"

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

export default function CardGrid<T>({
  items,
  getKey,
  getTitulo,
  cardOptions,
  renderContent,
  onItemClick,
  isLoading = false,
}: CardGridProps<T>) {
  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContextMenu key={getKey(item)}>
          <ContextMenuTrigger asChild>
            <Card
              className="shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => onItemClick?.(item)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex-1 truncate">
                  {getTitulo(item)}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-1 text-sm text-gray-500">
                {renderContent(item)}
              </CardContent>
            </Card>
          </ContextMenuTrigger>

          {cardOptions.length > 0 && (
            <ContextMenuContent>
              {cardOptions.map((option, i) => (
                <div key={i}>
                  {option.separator && <ContextMenuSeparator />}

                  <ContextMenuItem
                    className={option.className}
                    onClick={() => option.onClick(item)}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </ContextMenuItem>
                </div>
              ))}
            </ContextMenuContent>
          )}
        </ContextMenu>
      ))}
    </div>
  )
}