import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

const PASTEL_COLORS = [
  { base: '#98D4B5', light: '#B8E8CF', dark: '#78C49A' }, // sage
  { base: '#C4A8E0', light: '#D8C4EE', dark: '#A888D0' }, // lavender
  { base: '#F0C4A8', light: '#F8D8C4', dark: '#E0A888' }, // peach
  { base: '#A8C8E8', light: '#C4DCF0', dark: '#88B0D8' }, // sky
  { base: '#E8A8C0', light: '#F0C4D4', dark: '#D888A8' }, // rose
  { base: '#B0E0A8', light: '#C8EEC4', dark: '#90D088' }, // mint
  { base: '#E8E0A8', light: '#F0ECC4', dark: '#D8D088' }, // lemon
]

type ColorContextType = {
  pastel: string
  pastelLight: string
  pastelDark: string
}

const ColorContext = createContext<ColorContextType>({
  pastel: PASTEL_COLORS[0].base,
  pastelLight: PASTEL_COLORS[0].light,
  pastelDark: PASTEL_COLORS[0].dark,
})

export function ColorProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState(PASTEL_COLORS[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PASTEL_COLORS.length)
    const selected = PASTEL_COLORS[randomIndex]
    setColors(selected)

    // Set CSS variables for Tailwind
    document.documentElement.style.setProperty('--color-pastel', selected.base)
    document.documentElement.style.setProperty('--color-pastel-light', selected.light)
    document.documentElement.style.setProperty('--color-pastel-dark', selected.dark)
  }, [])

  return (
    <ColorContext.Provider value={{
      pastel: colors.base,
      pastelLight: colors.light,
      pastelDark: colors.dark
    }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColors() {
  return useContext(ColorContext)
}
