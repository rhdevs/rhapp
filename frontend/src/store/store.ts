import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { home } from './home/reducer'
import { route } from './route/reducer'
import { facilityBooking } from './facilityBooking/reducer'
import { scheduling } from './scheduling/reducer'
import { social } from './social/reducer'
import { laundry } from './laundry/reducer'
import { profile } from './profile/reducer'
import { supper } from './supper/reducer'
import { gym } from './gym/reducer'

export const rootReducer = combineReducers({
  home,
  route,
  facilityBooking,
  scheduling,
  social,
  profile,
  laundry,
  supper,
  gym,
})
const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
