'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        employeeId: '',
        department: '',
        state: '',
        mobileNumber: '',
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            })

            if (authError) throw authError

            // Create employee record
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: authData.user?.id,
                    employeeId: formData.employeeId,
                    name: formData.name,
                    department: formData.department,
                    state: formData.state,
                    mobileNumber: formData.mobileNumber,
                }),
            })

            if (!response.ok) throw new Error('Failed to create employee record')

            toast.success('Registration successful! Please check your email to verify your account.')
            router.push('/login')
        } catch (error: any) {
            toast.error(error.message || 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    const states = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Telangana', 'Puducherry', 'Andhra Pradesh']

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-50/30 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="glass shadow-2xl border-white/40">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-200">
                            <UserPlus className="text-white w-8 h-8" />
                        </div>
                        <CardTitle className="text-3xl font-extrabold text-cyan-900">Create Account</CardTitle>
                        <CardDescription className="text-cyan-600 font-medium">
                            Join the Attendance Management System
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-cyan-900 ml-1">Full Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="bg-white/50 border-cyan-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-cyan-900 ml-1">Employee ID</label>
                                    <Input
                                        placeholder="EMP001"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        required
                                        className="bg-white/50 border-cyan-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-cyan-900 ml-1">Department</label>
                                    <Input
                                        placeholder="Engineering"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        required
                                        className="bg-white/50 border-cyan-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-cyan-900 ml-1">State</label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        required
                                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all"
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-cyan-900 ml-1">Mobile Number</label>
                                <Input
                                    type="tel"
                                    placeholder="+91 9876543210"
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    required
                                    className="bg-white/50 border-cyan-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-cyan-900 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-white/50 border-cyan-100"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-cyan-900 ml-1">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="bg-white/50 border-cyan-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-cyan-900 ml-1">Confirm Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="bg-white/50 border-cyan-100"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                            <p className="text-sm text-center text-slate-500">
                                Already have an account?{' '}
                                <Link href="/login" className="text-cyan-600 font-bold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
