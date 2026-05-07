// components/ui/ComboboxField.tsx

import {
  Combobox, ComboboxContent, ComboboxEmpty,
  ComboboxInput, ComboboxItem, ComboboxList,
} from "@/components/ui/combobox"

interface ComboboxFieldProps<T> {
  items: T[]
  getValue: (item: T) => any 
  getLabel: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
  selectedValue: any
  onChange: (value: any) => void
  placeholder?: string
  isLoading?: boolean
}

export function ComboboxField<T>({
  items,
  getValue,
  getLabel,
  renderItem,
  selectedValue,
  onChange,
  placeholder = "Selecciona una opción",
  isLoading = false,
}: ComboboxFieldProps<T>) {
  const selected = items.find((item) => getValue(item) === selectedValue)

  return (
    <Combobox items={items}>
      <ComboboxInput
        placeholder={placeholder}
        value={selected ? getLabel(selected) : ""}
      />
      <ComboboxContent>
        <ComboboxEmpty>{isLoading ? "Cargando..." : "No encontrado"}</ComboboxEmpty>
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem
              key={String(getValue(item))}
              value={getLabel(item)}
              onClick={() => onChange(getValue(item))}>
              {renderItem ? renderItem(item) : getLabel(item)}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}