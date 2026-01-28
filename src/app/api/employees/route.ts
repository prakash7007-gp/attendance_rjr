import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, employeeId, name, department, state, mobileNumber } = body

        // Create user in database
        const user = await prisma.user.create({
            data: {
                id: userId,
                email: '', // This will be updated by Supabase
                role: 'EMPLOYEE',
            },
        })

        // Create employee
        const employee = await prisma.employee.create({
            data: {
                employeeId,
                name,
                department,
                state,
                mobileNumber,
                userId: user.id,
            },
        })

        return NextResponse.json(employee, { status: 201 })
    } catch (error: any) {
        console.error('Employee creation error:', error)
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

        if (employeeId) {
            const employee = await prisma.employee.findUnique({
                where: { employeeId },
                include: { user: true },
            })
            return NextResponse.json(employee)
        }

        const employees = await prisma.employee.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(employees)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        // const supabase = await createClient()
        // const { data: { user } } = await supabase.auth.getUser()

        // if (!user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { id, ...updateData } = body

        const employee = await prisma.employee.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json(employee)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // const supabase = await createClient()
        // const { data: { user } } = await supabase.auth.getUser()

        // if (!user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const searchParams = request.nextUrl.searchParams
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Employee ID required' }, { status: 400 })
        }

        await prisma.employee.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
