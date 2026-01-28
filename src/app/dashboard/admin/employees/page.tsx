'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Trash2, Edit, User } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/employees')
            const data = await response.json()
            if (Array.isArray(data)) {
                setEmployees(data)
            }
        } catch (error) {
            toast.error('Failed to fetch employees')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return

        try {
            const response = await fetch(`/api/employees?id=${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setEmployees(employees.filter(e => e.id !== id))
                toast.success('Employee deleted successfully')
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            toast.error('Failed to delete employee')
        }
    }

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-cyan-900">Employee Management</h1>
                    <p className="text-cyan-600 mt-1">Manage your workforce details</p>
                </div>
                {/* Registration is handled via the public registration page for this demo, 
            but an 'Add Employee' button could route to a protected create page */}
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <Card className="glass border-white/40 shadow-xl">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-cyan-500" />
                        <Input
                            placeholder="Search by name, ID, or department..."
                            className="pl-9 border-cyan-100 focus:border-cyan-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-cyan-50/50 border-b border-cyan-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-600 uppercase tracking-wider">Employee</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-600 uppercase tracking-wider">Department</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-600 uppercase tracking-wider">State</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-600 uppercase tracking-wider">Mobile</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-cyan-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-cyan-50">
                                    {filteredEmployees.map((employee) => (
                                        <motion.tr
                                            key={employee.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-cyan-50/30 transition-colors"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-cyan-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                                                        <div className="text-sm text-slate-500">{employee.user?.email || 'No email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                                                {employee.employeeId}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {employee.department}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {employee.state}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {employee.mobileNumber}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                        onClick={() => handleDelete(employee.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredEmployees.length === 0 && (
                                <div className="text-center py-10 text-slate-500">
                                    No employees found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
