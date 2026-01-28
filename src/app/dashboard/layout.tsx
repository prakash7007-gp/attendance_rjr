'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Home, Users, Clock, Calendar, FileText, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isAdmin = pathname?.includes('/dashboard/admin')

    const adminNav = [
        { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
        { name: 'Employees', href: '/dashboard/admin/employees', icon: Users },
        { name: 'Attendance', href: '/dashboard/admin/attendance', icon: Clock },
        { name: 'Permissions', href: '/dashboard/admin/permissions', icon: Calendar },
        { name: 'Leave Requests', href: '/dashboard/admin/leaves', icon: FileText },
    ]

    const employeeNav = [
        { name: 'Dashboard', href: '/dashboard/employee', icon: Home },
        { name: 'Attendance', href: '/dashboard/employee/attendance', icon: Clock },
        { name: 'Permissions', href: '/dashboard/employee/permissions', icon: Calendar },
        { name: 'Leave Requests', href: '/dashboard/employee/leaves', icon: FileText },
    ]

    const navItems = isAdmin ? adminNav : employeeNav

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success('Logged out successfully')
            router.push('/login')
        } catch (error) {
            toast.error('Failed to logout')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100">
            {/* Desktop Sidebar */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white/80 backdrop-blur-sm border-r border-cyan-100 shadow-xl">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex items-center flex-shrink-0 px-6 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200 mr-3">
                                <Clock className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold text-cyan-900">RJR Attendance</h1>
                                <p className="text-xs text-cyan-600 font-semibold">{isAdmin ? 'Admin Panel' : 'Employee Portal'}</p>
                            </div>
                        </div>
                        <nav className="mt-5 flex-1 space-y-2 px-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${isActive
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-200'
                                                : 'text-cyan-700 hover:bg-cyan-50'
                                            }`}
                                    >
                                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-cyan-500'}`} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-cyan-100 p-4">
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="md:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-cyan-100 bg-white/90 backdrop-blur-sm px-4 shadow-lg">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-cyan-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                <div className="flex-1 text-sm font-extrabold text-cyan-900">RJR Attendance</div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween' }}
                        className="md:hidden fixed inset-0 z-30 bg-white"
                    >
                        <div className="flex flex-col h-full pt-20 pb-6 px-4">
                            <nav className="flex-1 space-y-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${isActive
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-200'
                                                    : 'text-cyan-700 hover:bg-cyan-50'
                                                }`}
                                        >
                                            <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-cyan-500'}`} />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="md:pl-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-cyan-100 shadow-2xl z-30">
                <div className="flex justify-around py-2">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-cyan-600' : 'text-gray-400'
                                    }`}
                            >
                                <item.icon className={`h-6 w-6 ${isActive ? 'text-cyan-500' : ''}`} />
                                <span className="text-xs mt-1 font-semibold">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
