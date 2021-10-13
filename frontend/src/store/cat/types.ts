export type Cat = {
  catCount: number
  displayCatNumber: number
  isCatCountSingular: boolean
}

export enum CAT_ACTIONS {
  SET_CAT_COUNT = 'CAT_ACTIONS.SET_CAT_COUNT',
  SET_DISPLAY_CAT_NUMBER = 'CAT_ACTIONS.SET_DISPLAY_CAT_NUMBER',
  SET_IS_CAT_COUNT_SINGULAR = 'CAT_ACTIONS.SET_IS_CAT_COUNT_SINGULAR',
}

type SetCatCount = {
  type: typeof CAT_ACTIONS.SET_CAT_COUNT
  catCount: number
}

type SetDisplayCatNumber = {
  type: typeof CAT_ACTIONS.SET_DISPLAY_CAT_NUMBER
  displayCatNumber: number
}

type SetIsCatCountSingular = {
  type: typeof CAT_ACTIONS.SET_IS_CAT_COUNT_SINGULAR
  isCatCountSingular: boolean
}

export type ActionTypes = SetCatCount | SetDisplayCatNumber | SetIsCatCountSingular
