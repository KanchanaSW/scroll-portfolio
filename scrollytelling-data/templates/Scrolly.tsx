import { useRef } from 'react'
import { Chart } from './Chart'
import { NumberMorph } from './NumberMorph'
import { useStepIndex } from './useStepIndex'
import { story } from './story'

type Props = {
  reducedMotion: boolean
  pinEnabled: boolean
}

export function Scrolly({ reducedMotion, pinEnabled }: Props) {
  const scrollyRef = useRef<HTMLElement>(null)
  const graphicRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const index = useStepIndex({
    scrollyRef,
    graphicRef,
    stepsRef,
    stepCount: story.steps.length,
    enabled: pinEnabled,
  })
  const step = story.steps[index] ?? story.steps[0]!

  return (
    <article id="scrolly" ref={scrollyRef} className="relative lg:flex lg:items-start">
      <div ref={graphicRef} className="lg:h-screen lg:w-1/2">
        <p>
          <NumberMorph value={step.chart.headline} reducedMotion={reducedMotion} />
          {step.chart.suffix}
        </p>
        <Chart view={step.chart} />
      </div>
      <div ref={stepsRef} className="lg:w-1/2">
        {story.steps.map((s, i) => (
          <section
            key={s.id}
            data-step-index={i}
            aria-current={i === index ? 'step' : undefined}
            className="min-h-screen px-6 py-16"
          >
            <h2>{s.kicker}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </article>
  )
}
