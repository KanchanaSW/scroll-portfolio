import type { Story } from './types'

export const story = {
  identity: {
    title: 'What actually grew',
    dek: 'Replace with the one-sentence claim. Numbers below are placeholders — fill from the dataset.',
    byline: '',
    source: '',
  },
  steps: [
    {
      id: 'overview',
      kicker: 'The mix',
      body: 'Start with the whole picture. The chart shows every series; none are emphasized.',
      chart: {
        headline: 12,
        suffix: '%',
        annotation: 'Renewables share, start year',
        marks: [
          { id: 'coal', value: 48, emphasis: false },
          { id: 'gas', value: 31, emphasis: false },
          { id: 'wind', value: 8, emphasis: false },
          { id: 'solar', value: 4, emphasis: false },
        ],
      },
    },
    {
      id: 'coal',
      kicker: 'Coal',
      body: 'This snapshot is the full view with coal emphasized — not an addSeries("coal") patch.',
      chart: {
        headline: 48,
        suffix: '%',
        annotation: 'Coal',
        marks: [
          { id: 'coal', value: 48, emphasis: true },
          { id: 'gas', value: 31, emphasis: false },
          { id: 'wind', value: 8, emphasis: false },
          { id: 'solar', value: 4, emphasis: false },
        ],
      },
    },
    {
      id: 'now',
      kicker: 'Now',
      body: 'Jumping here from overview must look like this snapshot, not a queued film of the beats in between.',
      chart: {
        headline: 42,
        suffix: '%',
        annotation: 'Renewables share, latest year',
        marks: [
          { id: 'coal', value: 22, emphasis: false },
          { id: 'gas', value: 36, emphasis: false },
          { id: 'wind', value: 20, emphasis: false },
          { id: 'solar', value: 22, emphasis: true },
        ],
      },
    },
  ],
} as const satisfies Story
