export type GymStatus = {
  keyStatus: string
  gymStatus: boolean
}

export type HistoryEntry = {
  gymStatus: boolean
  keyStatus: string
  requesttime: number
  telegramHandle: string
  userID: string
}
