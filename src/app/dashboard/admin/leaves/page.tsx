'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, Calendar, User, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

export default function AdminLeavesPage() {
    const [leaves, setLeaves] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        fetchLeaves()
    }, [])

    const fetchLeaves = async () => {
        try {
            // Fetch pending leaves first, then others if needed, or all sorted
            const response = await fetch('/api/leaves')
            let data = await response.json()

            // Sort: Pending first, then by date
            if (Array.isArray(data)) {
                data.sort((a: any, b: any) => {
                    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1
                    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
                setLeaves(data)
            }
        } catch (error) {
            toast.error('Failed to fetch leave requests')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setProcessingId(id)
        try {
            const response = await fetch('/api/leaves', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            })

            if (response.ok) {
                toast.success(`Leave request ${status.toLowerCase()}`)
                // Update local state
                setLeaves(leaves.map(leave =>
                    leave.id === id ? { ...leave, status } : leave
                ))
            } else {
                throw new Error('Failed to update status')
            }
        } catch (error) {
            toast.error('Failed to update leave status')
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold border border-green-200">Approved</span>
            case 'REJECTED':
                return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">Rejected</span>
            default:
                return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200">Pending</span>
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-cyan-900">Leave Requests</h1>
                <p className="text-cyan-600 mt-1">Review and manage employee leave applications</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    </div>
                ) : leaves.length === 0 ? (
                    <Card className="glass p-8 text-center text-slate-500">
                        No leave requests found.
                    </Card>
                ) : (
                    leaves.map((leave, index) => (
                        <motion.div
                            key={leave.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className={`glass border-white/40 shadow-md ${leave.status === 'PENDING' ? 'border-l-4 border-l-yellow-400' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center text-cyan-700">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{leave.employee?.name}</h3>
                                                    <div className="flex items-center text-sm text-slate-500 gap-2">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{leave.employee?.employeeId}</span>
                                                        <span>•</span>
                                                        <span>{leave.employee?.department}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4 ml-1 md:ml-13">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <Calendar className="h-4 w-4 text-cyan-500" />
                                                    <span className="font-medium">{formatDate(leave.fromDate)}</span>
                                                    <span className="text-slate-400">to</span>
                                                    <span className="font-medium">{formatDate(leave.toDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <Clock className="h-4 w-4 text-cyan-500" />
                                                    <span className="font-bold">{leave.totalDays} Days</span>
                                                </div>
                                            </div>

                                            <div className="ml-1 md:ml-13 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 italic">
                                                "{leave.reason}"
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 justify-center min-w-[140px]">
                                            {leave.status === 'PENDING' ? (
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <Button
                                                        onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                                                        disabled={processingId === leave.id}
                                                        className="bg-green-600 hover:bg-green-700 flex-1 md:flex-initial"
                                                        size="sm"
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                                                        disabled={processingId === leave.id}
                                                        variant="danger"
                                                        size="sm"
                                                        className="flex-1 md:flex-initial"
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-xs text-slate-400 uppercase font-semibold">Status</span>
                                                    {getStatusBadge(leave.status)}
                                                </div>
                                            )}

                                            <span className="text-xs text-slate-400">
                                                Requested on {formatDate(leave.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
