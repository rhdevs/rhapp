import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from './store/store'
import Routes from './routes/Routes'

import GlobalStyle from './GlobalStyle'
import dayjs from 'dayjs'
import CustomParseFormat from 'dayjs/plugin/customParseFormat'
class App extends React.Component {
  render() {
    dayjs.extend(CustomParseFormat)
    return (
      <Provider store={store}>
        <GlobalStyle />
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
