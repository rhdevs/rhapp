import { Dispatch, GetState } from '../types'
import { ActionTypes, HOME_PAGE_ACTIONS, Account } from './types'
// import { get, ENDPOINTS } from '../endpoints'

export const mockActionSetAccount = () => (dispatch: Dispatch<ActionTypes>) => {
  // This is how you call an API
  // get(ENDPOINTS.MOCK_ENDPOINT).then((resp) => {
  //   const personalAccount = resp.data
  //   dispatch({
  //     type: HOME_PAGE_ACTIONS.SET_ACCOUNT,
  //     personalAccount: personalAccount,
  //   })
  // })
  const returnAccount = <Account>{}
  dispatch({
    type: HOME_PAGE_ACTIONS.SET_ACCOUNT,
    account: returnAccount,
  })
}

export const getUpdateMockString = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { sampleStateText } = getState().home
  console.log('Hello')
  console.log(getState().home.sampleStateText)
  dispatch({
    type: HOME_PAGE_ACTIONS.SAMPLE_TEXT,
    sampleStateText: sampleStateText + 'n',
  })
}
