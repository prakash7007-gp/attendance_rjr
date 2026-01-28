'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, AlertCircle, CheckCircle, Timer, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatTime, formatDuration } from '@/lib/utils'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import prisma from '@/lib/prisma'

interface DashboardStats {
    todayAttendance: any
    usedPermissionTime: number
    extraPermissionTime: number
    remainingLeaves: number
    monthlyAttendance: number
}

export default function EmployeeDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [employeeId, setEmployeeId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch employee data
            const empResponse = await fetch(`/api/employees?userId=${user.id}`)
            const employees = await empResponse.json()
            const employee = employees.find((e: any) => e.userId === user.id)

            if (!employee) return
            setEmployeeId(employee.id)

            // Fetch today's attendance
            const today = new Date().toISOString().split('T')[0]
            const attendanceRes = await fetch(`/api/attendance?employeeId=${employee.id}&date=${today}`)
            const attendances = await attendanceRes.json()
            const todayAttendance = attendances[0] || null

            // Fetch today's permissions
            const permissionsRes = await fetch(`/api/permissions?employeeId=${employee.id}&date=${today}`)
            const permissions = await permissionsRes.json()
            const usedPermissionTime = permissions.reduce((sum: number, p: any) => sum + p.durationMinutes, 0)
            const extraPermissionTime = permissions.reduce((sum: number, p: any) => sum + p.extraMinutes, 0)

            // Fetch month's leaves
            const leavesRes = await fetch(`/api/leaves?employeeId=${employee.id}`)
            const leaves = await leavesRes.json()
            const currentMonth = new Date().getMonth()
            const monthlyLeaves = leaves.filter((l: any) => {
                const leaveMonth = new Date(l.fromDate).getMonth()
                return leaveMonth === currentMonth && l.status !== 'REJECTED'
            })
            const usedLeaves = monthlyLeaves.reduce((sum: number, l: any) => sum + l.totalDays, 0)

            setStats({
                todayAttendance,
                usedPermissionTime,
                extraPermissionTime,
                remainingLeaves: 4 - usedLeaves,
                monthlyAttendance: 0, // This would need more complex calculation
            })
        } catch (error: any) {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const handleCheckIn = async () => {
        if (!employeeId) return
        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, type: 'checkin' }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }

            toast.success('Checked in successfully!')
            loadDashboardData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to check in')
        }
    }

    const handleCheckOut = async () => {
        if (!employeeId) return
        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, type: 'checkout' }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }

            toast.success('Checked out successfully!')
            loadDashboardData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to check out')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        )
    }

    const hasCheckedIn = stats?.todayAttendance && !stats.todayAttendance.checkOut
    const hasCheckedOut = stats?.todayAttendance?.checkOut

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-cyan-900">Employee Dashboard</h1>
                    <p className="text-cyan-600 mt-1">Welcome back! Track your attendance and permissions.</p>
                </div>
            </div>

            {/* Quick Actions */}
            <Card className="glass border-white/40 shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="text-cyan-500" />
                        Today's Attendance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {!hasCheckedIn && !hasCheckedOut && (
                            <Button size="lg" onClick={handleCheckIn} className="flex-1">
                                <CheckCircle className="mr-2" />
                                Check In
                            </Button>
                        )}
                        {hasCheckedIn && (
                            <>
                                <div className="flex-1 bg-cyan-50 rounded-2xl p-4 border-2 border-cyan-200">
                                    <p className="text-sm text-cyan-600 font-semibold">Checked In At</p>
                                    <p className="text-2xl font-bold text-cyan-900 mt-1">{formatTime(stats.todayAttendance.checkIn)}</p>
                                </div>
                                <Button size="lg" onClick={handleCheckOut} variant="secondary" className="flex-1">
                                    <AlertCircle className="mr-2" />
                                    Check Out
                                </Button>
                            </>
                        )}
                        {hasCheckedOut && (
                            <>
                                <div className="flex-1 bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                                    <p className="text-sm text-green-600 font-semibold">Checked In</p>
                                    <p className="text-xl font-bold text-green-900 mt-1">{formatTime(stats.todayAttendance.checkIn)}</p>
                                </div>
                                <div className="flex-1 bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                                    <p className="text-sm text-blue-600 font-semibold">Checked Out</p>
                                    <p className="text-xl font-bold text-blue-900 mt-1">{formatTime(stats.todayAttendance.checkOut)}</p>
                                </div>
                                <div className="flex-1 bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                                    <p className="text-sm text-purple-600 font-semibold">Total Hours</p>
                                    <p className="text-xl font-bold text-purple-900 mt-1">{stats.todayAttendance.totalHours?.toFixed(2)}h</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="glass border-white/40 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-cyan-600">Permission Used Today</p>
                                    <p className="text-3xl font-extrabold text-cyan-900 mt-2">{formatDuration(stats?.usedPermissionTime || 0)}</p>
                                    <p className="text-xs text-cyan-500 mt-1">of 2 hours allowed</p>
                                </div>
                                <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center">
                                    <Timer className="text-cyan-500 w-7 h-7" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="glass border-white/40 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-red-600">Extra Permission</p>
                                    <p className="text-3xl font-extrabold text-red-900 mt-2">{formatDuration(stats?.extraPermissionTime || 0)}</p>
                                    <p className="text-xs text-red-500 mt-1">{stats?.extraPermissionTime ? 'Over limit' : 'Within limit'}</p>
                                </div>
                                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="text-red-500 w-7 h-7" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="glass border-white/40 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Remaining Leaves</p>
                                    <p className="text-3xl font-extrabold text-green-900 mt-2">{stats?.remainingLeaves || 0} days</p>
                                    <p className="text-xs text-green-500 mt-1">this month</p>
                                </div>
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <Calendar className="text-green-500 w-7 h-7" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="glass border-white/40 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-purple-600">Monthly Attendance</p>
                                    <p className="text-3xl font-extrabold text-purple-900 mt-2">0%</p>
                                    <p className="text-xs text-purple-500 mt-1">this month</p>
                                </div>
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="text-purple-500 w-7 h-7" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
