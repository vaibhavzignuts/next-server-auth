'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports
import themeConfig from '@configs/themeConfig'

const AuthRedirect = () => {
  const pathname = usePathname()

  // ℹ️ Redirect to login with the current pathname as redirectTo parameter
  const redirectUrl = `/login?redirectTo=${pathname}`
  const login = '/login'
  const homePage = themeConfig.homePageUrl || '/home'

  return redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
}

export default AuthRedirect
