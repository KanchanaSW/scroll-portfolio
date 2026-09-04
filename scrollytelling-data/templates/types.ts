export type Mark = {
  id: string
  value: number
  emphasis: boolean
}

export type ChartView = {
  headline: number
  suffix: string
  annotation?: string
  marks: readonly Mark[]
}

export type Step = {
  id: string
  kicker: string
  body: string
  chart: ChartView
}

export type Story = {
  identity: {
    title: string
    dek: string
    byline: string
    source: string
  }
  steps: readonly Step[]
}
