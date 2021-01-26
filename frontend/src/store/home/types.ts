/** Types */

export type Account = {
  personalDetails: {
    availableBalance: string
  }
  cca: []
  settings: {
    notifications: boolean
  }
}

export type SearchResult = {
  id: number
  title?: string
  facilityLocation?: string
  facilityName?: string
  description?: string
  avatar?: string
  bio?: string
  displayName?: string
  profilePictureUrl?: string
}

/** Actions' types */

export enum HOME_PAGE_ACTIONS {
  SET_ACCOUNT = 'HOME_PAGE_ACTIONS.SET_ACCOUNT',
  SAMPLE_TEXT = 'HOME_PAGE_ACTIONS.SAMPLE_TEXT',
  SEARCH = 'HOME_PAGE_ACTIONS.SEARCH',
}

/** Actions */

type SetAccount = {
  type: typeof HOME_PAGE_ACTIONS.SET_ACCOUNT
  account: Account
}

type getSampleText = {
  type: typeof HOME_PAGE_ACTIONS.SAMPLE_TEXT
  sampleStateText: string
}

type SetSearchResults = {
  type: typeof HOME_PAGE_ACTIONS.SEARCH
  searchResults: SearchResult[]
}

export type ActionTypes = SetAccount | getSampleText | SetSearchResults
