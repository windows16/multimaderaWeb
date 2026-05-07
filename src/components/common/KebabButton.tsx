import { forwardRef } from "react"

const KebabButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button
      ref={ref}
      {...props}
      className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition text-xl leading-none tracking-widest">
      ⋮
    </button>
  )
)

KebabButton.displayName = "KebabButton"

export default KebabButton