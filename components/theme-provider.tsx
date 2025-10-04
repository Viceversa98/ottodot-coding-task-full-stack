"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps & Omit<NextThemesProviderProps, 'children'>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
