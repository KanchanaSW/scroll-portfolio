import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Args = {
  stageRef: RefObject<HTMLElement | null>
  trackRef: RefObject<HTMLElement | null>
  cameraRef: RefObject<HTMLElement | null>
  enabled: boolean
}

export function useCamera({
  stageRef,
  trackRef,
  cameraRef,
  enabled,
}: Args) {
  const panTween = useRef<gsap.core.Tween | null>(null)

  useGSAP(
    () => {
      if (!enabled) {
        panTween.current = null
        return
      }
      const stage = stageRef.current
      const track = trackRef.current
      const camera = cameraRef.current
      if (!stage || !track || !camera) return

      const distance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth)

      const pan = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + distance(),
        },
      })
      panTween.current = pan

      const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]', track)
      const n = Math.max(scenes.length, 1)

      // Sequential durations must sum to 1 so each keyframe p is scroll progress.
      const keyframes: { p: number; scale: number }[] = [{ p: 0, scale: 1.12 }]
      for (let i = 0; i < n; i++) {
        const id = scenes[i]?.dataset.scene
        const center = (i + 0.5) / n
        const atCenter = i === n - 1 ? 0.55 : id === 'skills' ? 0.88 : 1
        keyframes.push({ p: center, scale: atCenter })
        if (i < n - 1) {
          keyframes.push({ p: (i + 1) / n, scale: 0.82 })
        }
      }
      keyframes.push({ p: 1, scale: 0.55 })

      gsap.set(camera, { scale: keyframes[0].scale, transformOrigin: '50% 50%' })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => '+=' + distance(),
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i]
        const b = keyframes[i + 1]
        tl.to(camera, {
          scale: b.scale,
          duration: b.p - a.p,
          ease: 'none',
        })
      }

      return () => {
        panTween.current = null
      }
    },
    { dependencies: [enabled], revertOnUpdate: true },
  )

  return panTween
}
