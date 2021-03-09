import { Dispatch, GetState } from '../types'
import { ActionTypes, HOME_PAGE_ACTIONS, Account } from './types'
import { get, ENDPOINTS, DOMAINS } from '../endpoints'

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
  dispatch({
    type: HOME_PAGE_ACTIONS.SAMPLE_TEXT,
    sampleStateText: sampleStateText + 'n',
  })
}

export const getSearchResults = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.SEARCH, DOMAINS.SOCIAL, `?term=${query}`).then((results) => {
    const combinedResults = Object.keys(results).reduce((acc, key) => acc.concat(results[key]), [])
    dispatch({
      type: HOME_PAGE_ACTIONS.SEARCH,
      searchResults: combinedResults,
    })
  })
}
