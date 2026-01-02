// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'

// Util Imports
import { getServerMode } from '@core/utils/serverHelpers'

// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async () => {
  // Vars
  const mode = await getServerMode()

  return (
    <GuestOnlyRoute>
      <Login mode={mode} />
    </GuestOnlyRoute>
  )
}

export default LoginPage
