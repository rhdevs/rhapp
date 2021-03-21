import { Dispatch } from 'react'
import { ActionTypes } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

export const SetIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}
