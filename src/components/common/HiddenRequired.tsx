// components/common/HiddenRequired.tsx
interface HiddenRequiredProps {
  value: string | number | null | undefined
}

export function HiddenRequired({ value }: HiddenRequiredProps) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={() => {}}
      required
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
    />
  )
}