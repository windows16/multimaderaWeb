import { useEffect, useState } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface ComboboxFieldProps<T> {
  items: T[]
  getValue: (item: T) => any
  getLabel: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
  selectedValue: any
  onChange: (value: any ) => void
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
  const selected = items.find(
    (item) => getValue(item) === selectedValue
  )

  const [search, setSearch] = useState("")

  useEffect(() => {
    if (selected) {
      setSearch(getLabel(selected))
    }
  }, [selected])

  const filteredItems = items.filter((item) =>
    getLabel(item)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <Combobox items={filteredItems}>
      <ComboboxInput
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "Cargando..." : "No encontrado"}
        </ComboboxEmpty>
        
        <ComboboxList>
          <ComboboxItem
            value=""
            onClick={() => {
              onChange(null)
              setSearch("")
            }}>
            Ninguno
          </ComboboxItem>
          {filteredItems.map((item) => (
            <ComboboxItem
              key={String(getValue(item))}
              value={getLabel(item)}
              onClick={() => {
                onChange(getValue(item))
                setSearch(getLabel(item))
              }}
            >
              {renderItem
                ? renderItem(item)
                : getLabel(item)}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}