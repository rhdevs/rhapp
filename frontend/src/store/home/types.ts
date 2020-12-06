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
  SET_ACCOUNT = 'LANDING_PAGE_ACTIONS.SET_PERSONAL_ACCOUNT',
}

type SetAccount = {
  type: typeof HOME_PAGE_ACTIONS.SET_ACCOUNT
  account: Account
}

export type ActionTypes = SetAccount
