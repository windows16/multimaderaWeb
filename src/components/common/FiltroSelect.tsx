
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FiltroSelectProps {
  label: string
  placeholder?: string
  opciones: string[]
  value: string
  onChange: (value: string) => void
}

export function FiltroSelect({
  label,
  placeholder = "Todos",
  opciones,
  value,
  onChange,
}: FiltroSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={value || "__todos__"} onValueChange={v => onChange(v === "__todos__" ? "" : v)}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__todos__">{placeholder}</SelectItem>
          {opciones.map(op => (
            <SelectItem key={op} value={op}>{op}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}