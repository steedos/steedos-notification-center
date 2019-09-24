import { BaseColumn, BaseColumnFilters, ColumnSubscriptionData } from './devhub'

export interface SteedosUser {
  id: string | number
  node_id?: string
  display_login?: string
  login: string
  name: string
  avatar_url: string
  gravatar_id?: string
  type?: 'User'
  site_admin?: boolean
  company?: string
  blog?: string
  location?: string
  email?: string
  hireable?: boolean
  bio?: string
  public_gists?: number
  public_repos?: number
  total_private_repos?: number
  private_gists?: number
  followers?: number
  following?: number
  owned_private_repos?: number
  disk_usage?: number
  collaborators?: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
  url: string
  html_url?: string
  created_at: string
  updated_at: string
}

export interface SteedosLabel {
  id: number | string
  name: string
  color: string // CCCCCC
  default: boolean
  url: string // https://api.github.com/repos/richelbilderbeek/pbdmms/comments/19954756
}

export interface SteedosMilestone {
  id: number | string // 1165557
  number: number // 5
  title: string // 30
  description: string // Knesset 30 - future issues / will be fixed later
  creator: SteedosUser
  open_issues: number // 17
  closed_issues: number // 1
  state: 'open' | 'closed' // open
  created_at: string // 2015-06-15T18:46:59Z
  updated_at: string // 2016-05-23T18:01:44Z
  due_on: string // 2035-04-30T21:00:00Z
  closed_at: string | null // null
  html_url: string // https://github.com/hasadna/Open-Knesset/milestones/30
  url: string // https://api.github.com/repos/hasadna/Open-Knesset/milestones/5
}

export interface SteedosObject {
  id: number | string
  name: string
  user: SteedosUser
  assignee?: SteedosUser | null
  assignees?: SteedosUser[]
  number: number
  body: string
  title: string
  labels: SteedosLabel[]
  state: 'open' | 'closed'
  draft?: boolean
  locked: boolean
  milestone?: SteedosMilestone | null
  comments: number
  created_at: string // 2016-11-24T16:00:16Z
  updated_at: string // 2016-11-24T16:00:16Z
  html_url: string // https://github.com/hasadna/Open-Knesset/issues/345
  url: string // https://api.github.com/repos/hasadna/Open-Knesset/issues/345
  repository_url: string // https://api.github.com/repos/devhubapp/devhub
}

export type EnhancedSteedosObject = SteedosObject

export type SteedosObjectSubjectType = 'Issue' | 'PullRequest' // Object Name

export interface SteedosObjectColumnFilters extends BaseColumnFilters {
  involves?: Partial<Record<string, boolean>>
  subjectTypes?: Partial<Record<SteedosObjectSubjectType, boolean>>
}

export interface SteedosObjectColumnFilters extends BaseColumnFilters {
  involves?: Partial<Record<string, boolean>>
  subjectTypes?: Partial<Record<SteedosObjectSubjectType, boolean>>
}

export interface SteedosObjectColumn extends BaseColumn {
  id: string
  type: 'issue_or_pr'
  filters?: SteedosObjectColumnFilters
}

export interface SteedosObjectColumnSubscription {
  id: string
  type: SteedosObjectColumn['type']
  subtype: 'ISSUES' | 'PULLS' | undefined
  params: {
    owners?: SteedosObjectColumnFilters['owners']
    involves?: SteedosObjectColumnFilters['involves']
    subjectType: SteedosObjectSubjectType | undefined
    state?: SteedosObjectColumnFilters['state']
    draft?: SteedosObjectColumnFilters['draft']
    query?: string
  }
  data: ColumnSubscriptionData<any>
  createdAt: string
  updatedAt: string
}
