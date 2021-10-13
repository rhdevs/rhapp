import { Dispatch, GetState } from '../types'
import { ActionTypes, CAT_ACTIONS } from './types'

export const SetDisplayCatNumber = (newDisplayCatNumber: number) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: CAT_ACTIONS.SET_DISPLAY_CAT_NUMBER,
    displayCatNumber: newDisplayCatNumber,
  })
}

export const IncreaseCatCount = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { catCount } = getState().cat
  handleCatCountSingular(catCount + 1)
  dispatch({
    type: CAT_ACTIONS.SET_CAT_COUNT,
    catCount: catCount + 1,
  })
}

export const DecreaseCatCount = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { catCount } = getState().cat
  handleCatCountSingular(catCount - 1)
  dispatch({
    type: CAT_ACTIONS.SET_CAT_COUNT,
    catCount: catCount - 1,
  })
}

const handleCatCountSingular = (newCount: number) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: CAT_ACTIONS.SET_IS_CAT_COUNT_SINGULAR,
    isCatCountSingular: newCount === 1,
  })

  // if (newCount === 1) {
  //   dispatch({
  //     type: CAT_ACTIONS.SET_IS_CAT_COUNT_SINGULAR,
  //     isCatCountSingular: true,
  //   })
  // } else {
  //   dispatch({
  //     type: CAT_ACTIONS.SET_IS_CAT_COUNT_SINGULAR,
  //     isCatCountSingular: false,
  //   })
  // }
}

// export const SetCreateBookingError = (newError: string) => async (dispatch: Dispatch<ActionTypes>) => {
//   dispatch({
//     type: CAT_ACTIONS.SET_CREATE_BOOKING_ERROR,
//     createBookingError: newError,
//   })
// }
