import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import KebabButton from "../common/KebabButton"

interface MenuOption {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  className?: string
}

interface PageHeaderProps {
  title: string
  menuOptions?: MenuOption[]
}

export default function PageHeader({ title, menuOptions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">

        {menuOptions && menuOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <KebabButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuOptions.map((option, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={option.onClick}
                  className={option.className}
                >
                  {option.icon}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}