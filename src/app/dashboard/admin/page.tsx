'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, Calendar, FileText, AlertTriangle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface AdminStats {
    totalEmployees: number
    todayAttendance: number
    pendingLeaves: number
    totalPermissionsToday: number
    extraPermissionsToday: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalEmployees: 0,
        todayAttendance: 0,
        pendingLeaves: 0,
        totalPermissionsToday: 0,
        extraPermissionsToday: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            // Fetch employees
            const empRes = await fetch('/api/employees')
            const employees = await empRes.json()

            // Fetch today's attendance
            const today = new Date().toISOString().split('T')[0]
            const attendanceRes = await fetch(`/api/attendance?date=${today}`)
            const attendances = await attendanceRes.json()

            // Fetch today's permissions
            const permissionsRes = await fetch(`/api/permissions?date=${today}`)
            const permissions = await permissionsRes.json()
            const extraPermissions = permissions.filter((p: any) => p.extraMinutes > 0)

            // Fetch pending leaves
            const leavesRes = await fetch('/api/leaves?status=PENDING')
            const leaves = await leavesRes.json()

            setStats({
                totalEmployees: employees.length || 0,
                todayAttendance: attendances.length || 0,
                pendingLeaves: leaves.length || 0,
                totalPermissionsToday: permissions.length || 0,
                extraPermissionsToday: extraPermissions.length || 0,
            })
        } catch (error: any) {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            color: 'cyan',
            bgColor: 'bg-cyan-100',
            textColor: 'text-cyan-600',
            delay: 0.1,
        },
        {
            title: 'Today\'s Attendance',
            value: stats.todayAttendance,
            icon: Clock,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            delay: 0.2,
        },
        {
            title: 'Pending Leave Requests',
            value: stats.pendingLeaves,
            icon: FileText,
            color: 'purple',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            delay: 0.3,
        },
        {
            title: 'Permissions Today',
            value: stats.totalPermissionsToday,
            icon: Calendar,
            color: 'green',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600',
            delay: 0.4,
        },
        {
            title: 'Extra Permission Time',
            value: stats.extraPermissionsToday,
            icon: AlertTriangle,
            color: 'red',
            bgColor: 'bg-red-100',
            textColor: 'text-red-600',
            delay: 0.5,
        },
        {
            title: 'Attendance Rate',
            value: `${stats.totalEmployees > 0 ? Math.round((stats.todayAttendance / stats.totalEmployees) * 100) : 0}%`,
            icon: TrendingUp,
            color: 'orange',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600',
            delay: 0.6,
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-cyan-900">Admin Dashboard</h1>
                    <p className="text-cyan-600 mt-1">Overview of attendance management system</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stat.delay }}
                    >
                        <Card className="glass border-white/40 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.title}</p>
                                        <p className="text-4xl font-extrabold text-slate-900 mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                                        <stat.icon className={`${stat.textColor} w-8 h-8`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card className="glass border-white/40 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <a href="/dashboard/admin/employees" className="block p-4 bg-cyan-50 rounded-2xl hover:bg-cyan-100 transition-colors">
                            <h3 className="font-bold text-cyan-900">Manage Employees</h3>
                            <p className="text-sm text-cyan-600 mt-1">Add, edit, or remove employee records</p>
                        </a>
                        <a href="/dashboard/admin/leaves" className="block p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors">
                            <h3 className="font-bold text-purple-900">Approve Leave Requests</h3>
                            <p className="text-sm text-purple-600 mt-1">{stats.pendingLeaves} requests pending approval</p>
                        </a>
                        <a href="/dashboard/admin/permissions" className="block p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors">
                            <h3 className="font-bold text-orange-900">View Permission Reports</h3>
                            <p className="text-sm text-orange-600 mt-1">{stats.extraPermissionsToday} employees exceeded limit today</p>
                        </a>
                    </CardContent>
                </Card>

                <Card className="glass border-white/40 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="text-green-500" />
                            System Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <span className="text-sm font-semibold text-green-900">Attendance Rate</span>
                            <span className="text-xl font-bold text-green-600">
                                {stats.totalEmployees > 0 ? Math.round((stats.todayAttendance / stats.totalEmployees) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <span className="text-sm font-semibold text-blue-900">Active Employees</span>
                            <span className="text-xl font-bold text-blue-600">{stats.totalEmployees}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                            <span className="text-sm font-semibold text-yellow-900">Permission Requests</span>
                            <span className="text-xl font-bold text-yellow-600">{stats.totalPermissionsToday}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
