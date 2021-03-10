export enum WMStatus {
  AVAIL = 'Available',
  INUSE = 'In Use',
  UNCOLLECTED = 'Uncollected',
  COMPLETED = 'Completed',
  RESERVED = 'Reserved',
  ALERTED = 'Alerted',
}
export type WashingMachine = {
  machineID: string
  locationID: string
  userID: string
  jobID?: string
  type: string
  startTime: number
  duration: number
  job: WMStatus
  capacity: number
  userImage?: string
}

export type Location = {
  locationID: string
  block: number
  level: number
  name: string
}

export enum LAUNDRY_ACTIONS {
  GET_LOCATION_LIST = 'LAUNDRY_ACTIONS.GET_LOCATION_LIST',
  SET_IS_LOADING = 'LAUNDRY_ACTIONS.SET_IS_LOADING',
  SET_BLOCK_LEVEL_SELECTIONS = 'LAUNDRY_ACTIONS.SET_BLOCK_LEVEL_SELECTIONS',
  SET_FILTERED_MACHINES = 'LAUNDRY_ACTIONS.SET_FILTERED_MACHINES',
  SET_SELECTED_MACHINE = 'LAUNDRY_ACTIONS.SET_SELECTED_MACHINE',
  SET_EDIT_MODE = 'LAUNDRY_ACTIONS.SET_EDIT_MODE',
  SET_DURATION = 'LAUNDRY_ACTIONS.SET_DURATION',
  SET_TELEGRAM_HANDLE = 'LAUNDRY_ACTIONS.SET_TELEGRAM_HANDLE',
}

type GetLocationList = {
  type: typeof LAUNDRY_ACTIONS.GET_LOCATION_LIST
  locations: Location[]
  blocks: string[]
  levels: string[]
}

type SetIsLoading = {
  type: typeof LAUNDRY_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type SetBlockLevelSelections = {
  type: typeof LAUNDRY_ACTIONS.SET_BLOCK_LEVEL_SELECTIONS
  selectedBlock: string
  selectedLevel: string
}

type SetFilteredMachines = {
  type: typeof LAUNDRY_ACTIONS.SET_FILTERED_MACHINES
  filteredMachines: WashingMachine[]
}

type SetSelectedMachine = {
  type: typeof LAUNDRY_ACTIONS.SET_SELECTED_MACHINE
  selectedMachine: WashingMachine
}

type SetEditMode = {
  type: typeof LAUNDRY_ACTIONS.SET_EDIT_MODE
  isEdit: boolean
}

type SetDuration = {
  type: typeof LAUNDRY_ACTIONS.SET_DURATION
  duration: number
}

type SetTelegramHandle = {
  type: typeof LAUNDRY_ACTIONS.SET_TELEGRAM_HANDLE
  telegramHandle: string
}

export type ActionTypes =
  | GetLocationList
  | SetIsLoading
  | SetBlockLevelSelections
  | SetFilteredMachines
  | SetSelectedMachine
  | SetEditMode
  | SetDuration
  | SetTelegramHandle
