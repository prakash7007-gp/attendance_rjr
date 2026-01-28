import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { differenceInDays, startOfMonth, endOfMonth } from 'date-fns'

const MAX_LEAVES_PER_MONTH = 4

export async function POST(request: NextRequest) {
    try {
        // const supabase = await createClient()
        // const { data: { user } } = await supabase.auth.getUser()

        // if (!user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { employeeId, fromDate, toDate, reason } = body

        const from = new Date(fromDate)
        const to = new Date(toDate)
        const totalDays = differenceInDays(to, from) + 1

        if (totalDays <= 0) {
            return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
        }

        // Check monthly limit
        const monthStart = startOfMonth(from)
        const monthEnd = endOfMonth(from)

        const existingLeaves = await prisma.leaveRequest.findMany({
            where: {
                employeeId,
                status: { in: ['APPROVED', 'PENDING'] },
                fromDate: {
                    gte: monthStart,
                    lte: monthEnd,
                },
            },
        })

        const totalApprovedDays = existingLeaves.reduce((sum, leave) => sum + leave.totalDays, 0)

        if (totalApprovedDays + totalDays > MAX_LEAVES_PER_MONTH) {
            return NextResponse.json({
                error: `Cannot request more than ${MAX_LEAVES_PER_MONTH} days of leave per month. You have ${MAX_LEAVES_PER_MONTH - totalApprovedDays} days remaining.`
            }, { status: 400 })
        }

        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                employeeId,
                fromDate: from,
                toDate: to,
                reason,
                totalDays,
                status: 'PENDING',
            },
        })

        return NextResponse.json({
            leaveRequest,
            remainingDays: MAX_LEAVES_PER_MONTH - totalApprovedDays - totalDays,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        // const supabase = await createClient()
        // const { data: { user } } = await supabase.auth.getUser()

        // if (!user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const searchParams = request.nextUrl.searchParams
        const employeeId = searchParams.get('employeeId')
        const status = searchParams.get('status')

        const where: any = {}

        if (employeeId) {
            where.employeeId = employeeId
        }

        if (status) {
            where.status = status
        }

        const leaves = await prisma.leaveRequest.findMany({
            where,
            include: { employee: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(leaves)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, status } = body

        const leave = await prisma.leaveRequest.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(leave)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
