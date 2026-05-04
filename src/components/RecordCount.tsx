interface RecordCountProps {
  count: number
}

export default function RecordCount({ count }: RecordCountProps) {
  return (
    <p className="text-xs text-gray-400 mb-3">
      Mostrando {count} {count !== 1 ? "registros" : "registro"}
    </p>
  )
}