export type SkillGroup = {
  group: string
  items: readonly string[]
}

export type Experience = {
  company: string
  period: string
  start: string
  end: string | null
  titles: readonly string[]
  promotion?: { from: string; to: string }
  highlights: readonly string[]
}

export type Project = {
  name: string
  url: string
  live: boolean
  stack: readonly string[]
  highlights: readonly string[]
}

export type ImpactStat = {
  value: number
  suffix: string
  label: string
}

export type Portfolio = {
  identity: {
    name: string
    role: string
    location: string
    email: string
    phone: string
    resumeUrl: string
    links: { github: string; linkedin: string }
  }
  summary: string
  impact: readonly ImpactStat[]
  skills: readonly SkillGroup[]
  experience: readonly Experience[]
  projects: readonly Project[]
  speaking: readonly {
    title: string
    kind: 'tech-talk' | 'workshop' | 'other'
    context: string
  }[]
  mentorship: readonly string[]
  education: {
    school: string
    credential: string
    period: string
  }
  certifications: readonly {
    name: string
    issuer: string
    year: string
  }[]
}
