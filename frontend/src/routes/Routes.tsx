import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'

export enum PATHS {
  // MAIN LANDING PAGE
  HOME_PAGE = '/',
  SEARCH_PAGE = '/search',
  // AUTHENTICATION
  LOGIN_PAGE = '/auth/login',
  SIGNUP_PAGE = '/auth/signup',
  CHANGE_PASSWORD_PAGE = '/auth/changePassword',
  PROFILE_PAGE = '/social/profile',
  FRIEND_LIST_PAGE = '/social/profile/friendList',
  // SCHEDULING
  SCHEDULE_PAGE = '/schedule',
  SHARE_TIMETABLE_PAGE = '/sharetimetable',
  EVENT_LIST_PAGE = '/eventList',
  // FACILITY BOOKING
  FACILITY_BOOKING_MAIN = '/facility',
  VIEW_FACILITY = '/facility/view/:facilityName',
  CREATE_FACILITY_BOOKING = '/facility/booking/create',
  VIEW_FACILITY_BOOKING = '/facility/booking/view/:bookingId',
  VIEW_MY_BOOKINGS = '/facility/booking/user/:userId',
  // LAUNDRY
  LAUNDRY_MAIN = '/facility/laundry',
  VIEW_WASHING_MACHINE = '/facility/laundry/view/:machineId',
  //SOCIAL
  VIEW_POST = '/social/post/',
  VIEW_POST_ID = '/social/post/:postId',
}

const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))
const Search = React.lazy(() => import(/* webpackChunckName: "Search" */ './Home/Search'))
// AUTHENTICATION
const Login = React.lazy(() => import(/* webpackChunckName: "Login" */ './Authentication/Login'))
const Signup = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Authentication/Signup'))
// PROFILE
const Profile = React.lazy(() => import(/* webpackChunckName: "Profile" */ './Profile/'))
const ChangePassword = React.lazy(() => import(/* webpackChunckName: "ChangePassword" */ './Profile/ChangePassword'))
const FriendList = React.lazy(() => import(/* webpackChunckName: "FriendList" */ './Profile/FriendList'))
// SCHEDULING
const Schedule = React.lazy(() => import(/* webpackChunckName: "Scheduling" */ './Schedule'))
const ShareTimetable = React.lazy(() => import(/* webpackChunckName: "ShareTimetable" */ './Schedule/ShareTimetable'))
const EventList = React.lazy(() => import(/* webpackChunckName: "EventList" */ './Schedule/EventList'))
// FACILITY BOOKING
const FacilityBooking = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking'))
const ViewFacility = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/ViewFacility'))
const ViewMyBookings = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/MyBookings'))
const ViewBooking = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/ViewBooking'))
const CreateBooking = React.lazy(() => import(/* webpackChunckName: "Signup" */ './FacilityBooking/CreateBooking'))
// LAUNDRY
const LaundryMain = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Laundry'))
const ViewWashingMachine = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Laundry/ViewWashingMachine'))
//SOCIAL
const ViewPost = React.lazy(() => import(/* webpackChunckName: "ViewPost" */ './Social/ViewPost'))

export default class Routes extends React.Component {
  render() {
    return (
      <Root>
        <Suspense fallback={LoadingSpin}>
          <Switch>
            <Route exact path={PATHS.HOME_PAGE} component={Home} />
            <Route exact path={PATHS.SEARCH_PAGE} component={Search} />
            <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
            <Route exact path={PATHS.SIGNUP_PAGE} component={Signup} />

            <Route exact path={PATHS.PROFILE_PAGE} component={Profile} />
            <Route exact path={PATHS.CHANGE_PASSWORD_PAGE} component={ChangePassword} />
            <Route exact path={PATHS.FRIEND_LIST_PAGE} component={FriendList} />

            <Route exact path={PATHS.SCHEDULE_PAGE} component={Schedule} />
            <Route exact path={PATHS.SHARE_TIMETABLE_PAGE} component={ShareTimetable} />
            <Route exact path={PATHS.EVENT_LIST_PAGE} component={EventList} />

            <Route exact path={PATHS.FACILITY_BOOKING_MAIN} component={FacilityBooking} />
            <Route exact path={PATHS.VIEW_FACILITY} component={ViewFacility} />
            <Route exact path={PATHS.VIEW_MY_BOOKINGS} component={ViewMyBookings} />
            <Route exact path={PATHS.VIEW_FACILITY_BOOKING} component={ViewBooking} />
            <Route exact path={PATHS.CREATE_FACILITY_BOOKING} component={CreateBooking} />

            <Route exact path={PATHS.LAUNDRY_MAIN} component={LaundryMain} />
            <Route exact path={PATHS.VIEW_WASHING_MACHINE} component={ViewWashingMachine} />

            <Route path={PATHS.VIEW_POST_ID} component={ViewPost} />
          </Switch>
        </Suspense>
      </Root>
    )
  }
}

const Root = styled.div`
  z-index: 0;
`
