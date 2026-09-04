# Content model

One file owns the claim. Steps import it. The chart never receives a delta.

Canonical shape (use verbatim field names):

```ts
export const story = {
  identity: {
    title: 'What actually grew',
    dek: 'One sentence claim the graphic will prove.',
    byline: '',
    source: '',
  },
  steps: [
    {
      id: 'overview',
      kicker: 'The whole mix',
      body: 'Prose for this beat. No numbers that disagree with chart.',
      chart: {
        headline: 12,
        suffix: '%',
        annotation: 'Renewables, 2000',
        marks: [
          { id: 'coal', value: 48, emphasis: false },
          { id: 'gas', value: 31, emphasis: false },
          { id: 'wind', value: 8, emphasis: false },
          { id: 'solar', value: 4, emphasis: false },
        ],
      },
    },
    {
      id: 'solar',
      kicker: 'Solar',
      body: '…',
      chart: {
        headline: 22,
        suffix: '%',
        annotation: 'Solar, latest year',
        marks: [
          { id: 'coal', value: 28, emphasis: false },
          { id: 'gas', value: 30, emphasis: false },
          { id: 'wind', value: 20, emphasis: false },
          { id: 'solar', value: 22, emphasis: true },
        ],
      },
    },
  ],
} as const
```

Every step's `chart` is the **entire** view. To hide coal, the snapshot omits it or sets its value; it does not say `{ remove: 'coal' }`.

Fill numbers from the real dataset during interview. Do not invent series.

Types: `src/content/types.ts`. Copy [templates/story.ts](../templates/story.ts) and [templates/types.ts](../templates/types.ts).
