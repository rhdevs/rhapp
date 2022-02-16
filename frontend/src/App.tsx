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
import { APIEntry } from './store/facilityBooking/types'
import BookingBlock from './components/ScheduleBlock/BookingBlock'
import ViewScheduleBlock from './components/ScheduleBlock/ViewScheduleBlock'
import ViewMyBookings from './routes/FacilityBooking/MyBookings'

const mockValues: APIEntry[] = [
  {
    bookingID: 2,
    ccaID: 1,
    description: 'Lol',
    endTime: 1615924800,
    eventName: 'Lol',
    facilityID: 1,
    startTime: 1615910400,
    userID: 'A0165780X',
  },
]

class App extends React.Component {
  render() {
    dayjs.extend(CustomParseFormat)
    dayjs.extend(RelativeTime)

    return (
      <Provider store={store}>
        {ViewScheduleBlock(mockValues)}
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
