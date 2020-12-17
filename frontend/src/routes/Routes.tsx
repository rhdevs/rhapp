import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'

export enum PATHS {
  // MAIN LANDING PAGE
  HOME_PAGE = '/',
  // AUTHENTICATION
  LOGIN_PAGE = '/login',
  SIGNUP_PAGE = '/signup',
  SCHEDULE_PAGE = '/schedule',
  SHARE_TIMETABLE_PAGE = '/shareTimetable',
  EVENT_LIST_PAGE = '/eventList',
  // FACILITY BOOKING
  FACILITY_BOOKING_MAIN = '/facility',
  VIEW_FACILITY = '/facility/:facilityName',
  CREATE_FACILITY_BOOKING = '/facility/create',
  VIEW_FACILITY_BOOKING = '/facility/booking/:bookingId',
  VIEW_MY_BOOKINGS = '/facility/mybooking/:userId',
}

const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))
// AUTHENTICATION
const Login = React.lazy(() => import(/* webpackChunckName: "Login" */ './Authentication/Login'))
const Signup = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Authentication/Signup'))
// SCHEDULING
const Schedule = React.lazy(() => import(/* webpackChunckName: "Scheduling" */ './Schedule'))
const ShareTimetable = React.lazy(() => import(/* webpackChunckName: "ShareTimetable" */ './Schedule/ShareTimetable'))
const EventList = React.lazy(() => import(/* webpackChunckName: "EventList" */ './Schedule/EventList'))
// FACILITY BOOKING
const FacilityBooking = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking'))
const ViewFacility = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/ViewFacility'))
const ViewMyBookings = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/MyBookings'))
const ViewBooking = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/ViewBooking'))

export default class Routes extends React.Component {
  render() {
    return (
      <Root>
        <Suspense fallback={LoadingSpin}>
          <Switch>
            <Route exact path={PATHS.HOME_PAGE} component={Home} />
            <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
            <Route exact path={PATHS.SIGNUP_PAGE} component={Signup} />

            <Route exact path={PATHS.SCHEDULE_PAGE} component={Schedule} />
            <Route exact path={PATHS.SHARE_TIMETABLE_PAGE} component={ShareTimetable} />
            <Route exact path={PATHS.EVENT_LIST_PAGE} component={EventList} />

            <Route exact path={PATHS.FACILITY_BOOKING_MAIN} component={FacilityBooking} />
            <Route exact path={PATHS.VIEW_FACILITY} component={ViewFacility} />
            <Route exact path={PATHS.VIEW_MY_BOOKINGS} component={ViewMyBookings} />
            <Route exact path={PATHS.VIEW_FACILITY_BOOKING} component={ViewBooking} />
          </Switch>
        </Suspense>
      </Root>
    )
  }
}

const Root = styled.div`
  z-index: 0;
`
