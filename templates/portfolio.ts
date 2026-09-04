import type { Portfolio } from './types'

export const portfolio = {
  identity: {
    name: 'Kanchana Walagambahu',
    role: 'Senior Software Engineer — Frontend',
    location: 'Colombo, Sri Lanka',
    email: '',
    phone: '',
    resumeUrl: '/kanchana-walagambahu.pdf',
    links: {
      github: '',
      linkedin: '',
    },
  },
  summary: '',
  impact: [
    { value: 4, suffix: '+', label: 'years' },
    { value: 20, suffix: '+', label: 'critical bugs resolved' },
    { value: 10, suffix: '+', label: 'frontend issues' },
    { value: 2, suffix: '', label: 'live products' },
    { value: 3, suffix: '', label: 'companies' },
  ],
  skills: [
    { group: 'Languages', items: [] },
    { group: 'Frameworks', items: ['React', 'Next.js'] },
    { group: 'State/Data', items: [] },
    { group: 'UI', items: [] },
    { group: 'Backend/Cloud', items: [] },
    { group: 'Mobile', items: [] },
    { group: 'Analytics', items: [] },
  ],
  experience: [
    {
      company: 'Informatics',
      period: 'Mar 2022',
      start: '2022-03',
      end: '2022-10',
      titles: ['Software Engineer'],
      highlights: [],
    },
    {
      company: 'Axiata Digital Labs',
      period: 'Oct 2022 – Present',
      start: '2022-10',
      end: null,
      titles: ['Software Engineer', 'Senior Software Engineer'],
      promotion: {
        from: 'Software Engineer',
        to: 'Senior Software Engineer',
      },
      highlights: [],
    },
    {
      company: 'Tribird',
      period: '',
      start: '',
      end: null,
      titles: [],
      highlights: [],
    },
  ],
  projects: [
    {
      name: 'JSON Vibe',
      url: 'https://jsonshare.org',
      live: true,
      stack: [],
      highlights: [],
    },
    { name: 'SL Stocks', url: '', live: false, stack: [], highlights: [] },
    {
      name: 'Wildwood Packiyo',
      url: '',
      live: false,
      stack: [],
      highlights: [],
    },
    { name: 'SmartNas', url: '', live: false, stack: [], highlights: [] },
  ],
  speaking: [
    {
      title: 'Exploring the Future of Coding with Cursor AI',
      kind: 'tech-talk' as const,
      context: '',
    },
  ],
  mentorship: [] as string[],
  education: {
    school: 'Staffordshire University (APIIT)',
    credential: '',
    period: '',
  },
  certifications: [{ name: 'Udemy React', issuer: 'Udemy', year: '' }],
} as const satisfies Portfolio
