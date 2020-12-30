import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { home } from './home/reducer'
import { route } from './route/reducer'
import { facilityBooking } from './facilityBooking/reducer'
import { scheduling } from './scheduling/reducer'

export const rootReducer = combineReducers({ home, route, facilityBooking, scheduling })
const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
