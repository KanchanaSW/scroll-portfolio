/**
 * Commutative: same tops + triggerY → same index, scrolling up or down.
 * Fast-scroll safe: does not depend on which steps fired an observer callback.
 */
export function measureActiveStep(tops: number[], triggerY: number): number {
  let index = 0
  for (let i = 0; i < tops.length; i++) {
    if (tops[i]! <= triggerY) index = i
  }
  return index
}
