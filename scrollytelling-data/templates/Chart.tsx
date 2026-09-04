import { useLayoutEffect, useRef } from 'react'
import type { ChartView } from './types'

type Props = {
  view: ChartView
}

/** Paint `view`. No highlight/reset/addSeries. Jumps skip intermediate snapshots. */
export function Chart({ view }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paint = () => {
      const w = svg.clientWidth || 600
      const h = svg.clientHeight || 360
      const max = Math.max(...view.marks.map((m) => m.value), 1)
      const barW = w / (view.marks.length * 1.6)
      const gap = barW * 0.6

      svg.replaceChildren()
      view.marks.forEach((m, i) => {
        const barH = (m.value / max) * (h - 48)
        const x = gap + i * (barW + gap)
        const y = h - 24 - barH
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        el.setAttribute('x', String(x))
        el.setAttribute('y', String(y))
        el.setAttribute('width', String(barW))
        el.setAttribute('height', String(barH))
        el.setAttribute('rx', '4')
        el.setAttribute('fill', 'currentColor')
        el.setAttribute('opacity', m.emphasis ? '1' : '0.35')
        svg.appendChild(el)
      })
    }

    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(svg)
    return () => ro.disconnect()
  }, [view])

  return (
    <figure>
      <svg ref={svgRef} role="img" aria-label={view.annotation ?? 'Chart'} className="h-80 w-full" />
      {view.annotation ? <figcaption>{view.annotation}</figcaption> : null}
    </figure>
  )
}
