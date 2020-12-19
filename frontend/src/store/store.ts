import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { home } from './home/reducer'
import { route } from './route/reducer'
import { facilityBooking } from './facilityBooking/reducer'

export const rootReducer = combineReducers({ home, route, facilityBooking })
const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
