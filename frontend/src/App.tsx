import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from './store/store'
import Routes from './routes/Routes'

import GlobalStyle from './GlobalStyle'
import dayjs from 'dayjs'
import CustomParseFormat from 'dayjs/plugin/customParseFormat'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { OfflineStatus } from './components/OfflineStatus'
import { NotificationBar } from './components/Supper/NotificationBar'

class App extends React.Component {
  render() {
    dayjs.extend(CustomParseFormat)
    dayjs.extend(RelativeTime)

    return (
      <Provider store={store}>
        <GlobalStyle />
        <BrowserRouter>
          <OfflineStatus />
          <NotificationBar />
          <Routes />
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
