export enum CALENDAR_ACTIONS {
  SET_IS_CLICKED = 'CALENDAR_ACTIONS.SET_IS_CLICKED',
}

type SetIsClicked = {
  type: typeof CALENDAR_ACTIONS.SET_IS_CLICKED
  newIsClicked: boolean
  newClickedDate: number
}

export type ActionTypes = SetIsClicked
