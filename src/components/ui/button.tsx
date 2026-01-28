import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md shadow-cyan-200',
            secondary: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
            outline: 'border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50',
            ghost: 'text-cyan-600 hover:bg-cyan-50',
            danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200',
        }
        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-6 py-2.5',
            lg: 'px-8 py-3.5 text-lg',
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
