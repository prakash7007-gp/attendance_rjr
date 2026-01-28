import * as React from "react"
import { cn } from "@/lib/utils"

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100", className)}>
        {children}
    </div>
)

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("flex flex-col space-y-1.5 p-0 mb-4", className)}>
        {children}
    </div>
)

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={cn("text-2xl font-bold leading-none tracking-tight text-slate-900", className)}>
        {children}
    </h3>
)

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <p className={cn("text-sm text-slate-500", className)}>
        {children}
    </p>
)

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("p-0", className)}>
        {children}
    </div>
)

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("flex items-center p-0 mt-6", className)}>
        {children}
    </div>
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
