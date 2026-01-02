// Next Imports
import { NextResponse } from 'next/server'

import type { UserTable } from './users'

type ResponseUser = Omit<UserTable, 'password'>

// Mock data for demo purpose
import { users } from './users'

export async function POST(req: Request) {
  try {
    // Vars
    const body = await req.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          message: ['Email and password are required']
        },
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }

    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...filteredUserData } = user

      const response: ResponseUser = {
        ...filteredUserData
      }

      return NextResponse.json(response)
    } else {
      // We return 401 status code and error message if user is not found
      return NextResponse.json(
        {
          // We create object here to separate each error message for each field in case of multiple errors
          message: ['Email or Password is invalid']
        },
        {
          status: 401,
          statusText: 'Unauthorized Access'
        }
      )
    }
  } catch (error) {
    // Handle JSON parsing errors or other errors
    return NextResponse.json(
      {
        message: ['Invalid request format']
      },
      {
        status: 400,
        statusText: 'Bad Request'
      }
    )
  }
}
