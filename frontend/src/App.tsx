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
import ViewScheduleBlock from './components/ScheduleBlock/ViewSection'
import ViewMyBookings from './routes/FacilityBooking/MyBookings'
import BookingScheduleBlock from './components/ScheduleBlock/BookingSection'
import BookingSection from './components/ScheduleBlock/BookingSection'

const mockValues: APIEntry[] = [
  {
    bookingID: 1,
    ccaID: 1,
    description: 'For drinking',
    endTime: 1645102800,
    eventName: 'Lol',
    facilityID: 1,
    startTime: 1645099200,
    userID: 'A0165780X',
  },
  {
    bookingID: 2,
    ccaID: 2,
    description: 'For party',
    endTime: 1645077600,
    eventName: 'Bash',
    facilityID: 1,
    startTime: 1645070400,
    userID: 'A0165780X',
  },
]

class App extends React.Component {
  render() {
    dayjs.extend(CustomParseFormat)
    dayjs.extend(RelativeTime)
    return (
      <Provider store={store}>
        <BookingSection resp={mockValues} />
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
