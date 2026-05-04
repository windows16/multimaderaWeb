import { Button } from "@/components/ui/button"

interface FabButtonProps {
  onClick: () => void
  icon: React.ReactNode
  className?: string
}

export default function FabButton({ onClick, icon, className }: FabButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 rounded-2xl size-12 shadow-xl bg-blue-600 ${className}`}>
      {icon}
    </Button>
  )
}