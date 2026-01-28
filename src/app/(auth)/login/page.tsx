'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast.success('Logged in successfully!')
            router.push('/dashboard')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Failed to login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-50/30 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass shadow-2xl border-white/40">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-200">
                            <LogIn className="text-white w-8 h-8" />
                        </div>
                        <CardTitle className="text-3xl font-extrabold text-cyan-900">Welcome Back</CardTitle>
                        <CardDescription className="text-cyan-600 font-medium">
                            Attendance Management System
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-cyan-900 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/50 border-cyan-100 focus:border-cyan-500 h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-cyan-900 ml-1">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white/50 border-cyan-100 focus:border-cyan-500 h-12"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <p className="text-sm text-center text-slate-500">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-cyan-600 font-bold hover:underline">
                                    Register here
                                </Link>
                            </p>

                            <div className="mt-4 p-4 bg-cyan-50/50 rounded-2xl border border-cyan-100 w-full animate-in">
                                <p className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest mb-2 text-center">Evaluation Mode: Suggested Dummy Access</p>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[11px] bg-white/40 px-2 py-1 rounded-lg">
                                        <span className="text-slate-500">Admin:</span>
                                        <code className="text-cyan-700 font-bold">admin@demo.com</code>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] bg-white/40 px-2 py-1 rounded-lg">
                                        <span className="text-slate-500">Employee:</span>
                                        <code className="text-cyan-700 font-bold">emp@demo.com</code>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] bg-white/40 px-2 py-1 rounded-lg">
                                        <span className="text-slate-500">Pwd:</span>
                                        <code className="text-cyan-700 font-bold">password123</code>
                                    </div>
                                </div>
                                <p className="text-[9px] text-cyan-600 mt-2 text-center leading-relaxed">
                                    To use these, first create them exactly as shown on the <Link href="/register" className="font-bold underline">Register</Link> page.
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
