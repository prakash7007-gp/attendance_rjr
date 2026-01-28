import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(request: NextRequest) {
    try {
        // const supabase = await createClient()
        // const { data: { user } } = await supabase.auth.getUser()

        // if (!user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { employeeId, type } = body

        const today = new Date()
        const todayStart = startOfDay(today)
        const todayEnd = endOfDay(today)

        // Check if attendance already exists for today
        let attendance = await prisma.attendance.findFirst({
            where: {
                employeeId,
                date: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
        })

        if (type === 'checkin') {
            if (attendance) {
                return NextResponse.json({ error: 'Already checked in today' }, { status: 400 })
            }

            attendance = await prisma.attendance.create({
                data: {
                    employeeId,
                    checkIn: new Date(),
                    date: today,
                },
            })
        } else if (type === 'checkout') {
            if (!attendance) {
                return NextResponse.json({ error: 'No check-in found for today' }, { status: 400 })
            }

            if (attendance.checkOut) {
                return NextResponse.json({ error: 'Already checked out today' }, { status: 400 })
            }

            const checkoutTime = new Date()
            const totalHours = (checkoutTime.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60)

            attendance = await prisma.attendance.update({
                where: { id: attendance.id },
                data: {
                    checkOut: checkoutTime,
                    totalHours: parseFloat(totalHours.toFixed(2)),
                },
            })
        }

        return NextResponse.json(attendance)
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

        const attendances = await prisma.attendance.findMany({
            where,
            include: { employee: true },
            orderBy: { date: 'desc' },
        })

        return NextResponse.json(attendances)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
