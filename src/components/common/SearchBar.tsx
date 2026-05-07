import { FaSearch, FaTimes } from "react-icons/fa"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ value, onChange, placeholder = "Buscar...", className }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className={`relative flex-1 ${className ?? ""}`}>
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>
    </div>
    
  )
}