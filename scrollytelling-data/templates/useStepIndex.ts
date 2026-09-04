import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState, type RefObject } from 'react'
import { measureActiveStep } from './measureActiveStep'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Args = {
  scrollyRef: RefObject<HTMLElement | null>
  graphicRef: RefObject<HTMLElement | null>
  stepsRef: RefObject<HTMLElement | null>
  stepCount: number
  enabled: boolean
  triggerRatio?: number
}

export function useStepIndex({
  scrollyRef,
  graphicRef,
  stepsRef,
  stepCount,
  enabled,
  triggerRatio = 0.4,
}: Args) {
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  useGSAP(
    () => {
      if (!enabled) return
      const scrolly = scrollyRef.current
      const graphic = graphicRef.current
      const steps = stepsRef.current
      if (!scrolly || !graphic || !steps) return

      const stepEls = gsap.utils.toArray<HTMLElement>('[data-step-index]', steps)

      const apply = () => {
        const triggerY = window.innerHeight * triggerRatio
        const tops = stepEls.map((el) => el.getBoundingClientRect().top)
        const next = measureActiveStep(tops, triggerY)
        if (next !== indexRef.current) {
          indexRef.current = next
          setIndex(next)
        }
      }

      ScrollTrigger.create({
        trigger: scrolly,
        start: 'top top',
        end: () =>
          '+=' + Math.max(0, steps.scrollHeight - window.innerHeight),
        pin: graphic,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: apply,
        onRefresh: apply,
      })

      apply()
    },
    { dependencies: [enabled, stepCount, triggerRatio], revertOnUpdate: true },
  )

  return index
}
