
interface ErrorAlertProps {
  error: string | null
  title?: string
  className?: string
}

export default function ErrorAlert({ error, title = "", className = "col-span-2" }: ErrorAlertProps) {
  if (!error) return null
  return (
    <div className={`${className} bg-red-50 border border-red-200 rounded-lg px-3 py-2`}>
      <p className="text-sm font-medium text-red-600">{title}</p>
      <p className="text-xs text-red-400 mt-1 break-all max-h-24 overflow-y-auto whitespace-pre-wrap">
        {error}
      </p>
    </div>
  )
}