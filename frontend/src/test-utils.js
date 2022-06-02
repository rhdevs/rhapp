import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { rootReducer } from './store/store'
import thunk from 'redux-thunk'

const middlewares = [thunk]

const render = (
  ui,
  { initialState, store = createStore(rootReducer, applyMiddleware(...middlewares)), ...renderOptions } = {},
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
export * from '@testing-library/react'
export { render }
