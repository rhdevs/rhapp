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
import { ViewBookingEntry } from './store/facilityBooking/types'
import ViewBlock from './components/ScheduleBlock/ViewBlock'

const mockValues: ViewBookingEntry[] = [
  { id: 1, ccaName: 'Devs', eventName: 'CCA Trg', occupied: true },
  { id: 2, ccaName: 'Devs', eventName: 'CCA Trg', occupied: false },
  { id: 3, ccaName: 'Social', eventName: 'Nil', occupied: true },
  { id: 4, ccaName: 'Welfare', eventName: 'Nil', occupied: true },
  { id: 5, ccaName: 'RR', eventName: 'Nil', occupied: true },
  { id: 6, ccaName: 'RHMP', eventName: 'Nil', occupied: true },
]

class App extends React.Component {
  render() {
    dayjs.extend(CustomParseFormat)
    dayjs.extend(RelativeTime)

    return (
      <Provider store={store}>
        {mockValues.map((value, index) => {
          return <ViewBlock bookingEntry={value} key={index} />
        })}
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
