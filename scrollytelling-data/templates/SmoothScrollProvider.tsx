import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

// In the app, register plugins once in src/scroll/gsap.ts and import from there.
gsap.registerPlugin(ScrollTrigger)

type SmoothScrollValue = {
  getLenis: () => Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  getLenis: () => null,
})

export function useLenis() {
  return useContext(SmoothScrollContext).getLenis
}

type Props = {
  children: ReactNode
  reducedMotion: boolean
}

export function SmoothScrollProvider({ children, reducedMotion }: Props) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: reducedMotion ? 1 : 0.1,
      syncTouch: true,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  const getLenis = useCallback(() => lenisRef.current, [])

  return (
    <SmoothScrollContext.Provider value={{ getLenis }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
