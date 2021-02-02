import { Action } from 'redux'
import { rootReducer } from './store'

export type RootState = ReturnType<typeof rootReducer>

type ThunkDispatch<S, A extends Action> = {
  (action: A): A
  <R>(asyncAction: ThunkAction<R, S, A>): R
}
type ThunkAction<R, S, A extends Action> = (dispatch: ThunkDispatch<S, A>, getState: () => S) => R

export type Dispatch<CustomActionTypes extends Action> = ThunkDispatch<RootState, CustomActionTypes>
export type GetState = () => RootState
