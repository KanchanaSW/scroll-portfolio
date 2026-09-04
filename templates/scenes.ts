export const SCENES = [
  { id: 'hero', label: 'Hero', digit: '1' },
  { id: 'summary', label: 'Summary', digit: '2' },
  { id: 'impact', label: 'Impact', digit: '3' },
  { id: 'skills', label: 'Skills', digit: '4' },
  { id: 'experience', label: 'Experience', digit: '5' },
  { id: 'projects', label: 'Projects', digit: '6' },
  { id: 'speaking', label: 'Speaking', digit: '7' },
  { id: 'education', label: 'Education', digit: '8' },
  { id: 'contact', label: 'Contact', digit: '9' },
] as const

export type SceneId = (typeof SCENES)[number]['id']
