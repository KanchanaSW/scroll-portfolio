import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

type Props = {
  value: number
  reducedMotion: boolean
}

/** Tweens toward `value`. A jump 12→61 does not pass through intermediate step headlines. */
export function NumberMorph({ value, reducedMotion }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const proxy = useRef({ n: value })

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (reducedMotion) {
        proxy.current.n = value
        el.textContent = String(Math.round(value))
        return
      }
      gsap.to(proxy.current, {
        n: value,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => {
          el.textContent = String(Math.round(proxy.current.n))
        },
      })
    },
    { dependencies: [value, reducedMotion] },
  )

  return <span ref={ref}>{Math.round(value)}</span>
}
