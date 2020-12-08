export type Account = {
  personalDetails: {
    availableBalance: string
  }
  cca: []
  settings: {
    notifications: boolean
  }
}

export enum HOME_PAGE_ACTIONS {
  SET_ACCOUNT = 'HOME_PAGE_ACTIONS.SET_ACCOUNT',
  SAMPLE_TEXT = 'HOME_PAGE_ACTIONS.SAMPLE_TEXT',
}

type SetAccount = {
  type: typeof HOME_PAGE_ACTIONS.SET_ACCOUNT
  account: Account
}

type getSampleText = {
  type: typeof HOME_PAGE_ACTIONS.SAMPLE_TEXT
  sampleStateText: string
}

export type ActionTypes = SetAccount | getSampleText
