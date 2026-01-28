import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { startOfDay, endOfDay } from 'date-fns'

const MAX_PERMISSION_MINUTES = 120

export async function POST(request: NextRequest) {
    try {
        // const supabase = await createClient()
        // const { data: { user } } = await supabase.auth.getUser()

        // if (!user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { employeeId, startTime, endTime, reason } = body

        const start = new Date(startTime)
        const end = new Date(endTime)
        const durationMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))

        if (durationMinutes <= 0) {
            return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
        }

        const today = new Date()
        const todayStart = startOfDay(today)
        const todayEnd = endOfDay(today)

        // Calculate total permissions for today
        const existingPermissions = await prisma.permission.findMany({
            where: {
                employeeId,
                date: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
        })

        const totalUsedMinutes = existingPermissions.reduce((sum, p) => sum + p.durationMinutes, 0)
        const remainingMinutes = MAX_PERMISSION_MINUTES - totalUsedMinutes

        let extraMinutes = 0
        if (totalUsedMinutes + durationMinutes > MAX_PERMISSION_MINUTES) {
            extraMinutes = (totalUsedMinutes + durationMinutes) - MAX_PERMISSION_MINUTES
        }

        const permission = await prisma.permission.create({
            data: {
                employeeId,
                startTime: start,
                endTime: end,
                reason,
                durationMinutes,
                extraMinutes,
                date: today,
            },
        })

        return NextResponse.json({
            permission,
            totalUsedMinutes: totalUsedMinutes + durationMinutes,
            remainingMinutes: Math.max(0, remainingMinutes - durationMinutes),
            exceededLimit: extraMinutes > 0,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const employeeId = searchParams.get('employeeId')
        const date = searchParams.get('date')

        const where: any = {}

        if (employeeId) {
            where.employeeId = employeeId
        }

        if (date) {
            const targetDate = new Date(date)
            where.date = {
                gte: startOfDay(targetDate),
                lte: endOfDay(targetDate),
            }
        }

        const permissions = await prisma.permission.findMany({
            where,
            include: { employee: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(permissions)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
