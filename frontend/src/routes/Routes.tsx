import React, { Suspense } from 'react'
import styled from 'styled-components'
// import { Switch } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'
import { PrivateRoute, PublicRoute, AuthenticateRoute } from './RouteTypes'
import { AnimatedSwitch } from 'react-router-transition'

export enum PATHS {
  // MAIN LANDING PAGE
  HOME_PAGE = '/',
  SEARCH_PAGE = '/search',
  // AUTHENTICATION
  LOGIN_PAGE = '/auth/login',
  SIGNUP_PAGE = '/auth/signup',
  CHANGE_PASSWORD_PAGE = '/auth/changePassword',
  PROFILE_PAGE = '/social/profile/',
  VIEW_PROFILE_PAGE = '/social/profile/:userId',
  EDIT_PROFILE_PAGE = '/social/editprofile',
  FRIEND_LIST_PAGE = '/social/profile/friendList/',
  VIEW_FRIEND_LIST_PAGE = '/social/profile/friendList/:userId',
  // SCHEDULING
  SCHEDULE_PAGE = '/schedule',
  SHARE_TIMETABLE_PAGE = '/schedule/share',
  EVENT_LIST_PAGE = '/schedule/events/view/public',
  EVENT_LIST_PAGE_WITH_PAGE_INDEX = '/schedule/events/view/public/:pageIndex',
  CREATE_EVENT = '/schedule/events/create',
  IMPORT_FROM_NUSMODS = '/schedule/import/nusmods',
  VIEW_EVENT = '/schedule/events/view',
  VIEW_EVENT_ID = '/schedule/events/view/:eventId',
  // FACILITY BOOKING
  FACILITY_BOOKING_MAIN = '/facility',
  VIEW_FACILITY = '/facility/view/:facilityID',
  CREATE_FACILITY_BOOKING = '/facility/booking/create',
  VIEW_FACILITY_BOOKING = '/facility/booking/view/:bookingId',
  VIEW_FACILITY_BOOKING_ID = '/facility/booking/view/',
  VIEW_MY_BOOKINGS = '/facility/booking/user/:userId',
  VIEW_MY_BOOKINGS_USERID = '/facility/booking/user',
  // LAUNDRY
  LAUNDRY_MAIN = '/facility/laundry',
  VIEW_MACHINE = '/facility/laundry/view',
  VIEW_WASHING_MACHINE = '/facility/laundry/view/:machineId',
  //SOCIAL
  VIEW_POST = '/social/post/',
  VIEW_POST_ID = '/social/post/:postId',
  CREATE_POST = '/social/post/create',
  EDIT = '/social/post/edit',
  EDIT_POST = '/social/post/edit/:postId',
  //SUPPER
  SUPPER_HOME = '/supper',
  SUPPER_COMPONENTS_PAGE = '/supper/components',
  SUPPER_GROUP_OVERVIEW = '/supper/overview',
  SUPPER_GROUP_OVERVIEW_BY_SECTION = '/supper/overview/:section',
  CREATE_SUPPER_GROUP = '/supper/create',
  CREATE_SUPPER_GROUP_BY_PAGE = '/supper/create/:page',
  JOIN_ORDER = '/supper/join/order',
  JOIN_ORDER_BY_ID = '/supper/join/order/:supperGroupId',
  PLACE_ORDER = '/supper',
  PLACE_ORDER_BY_ID = '/supper/:supperGroupId/:restaurantId/order',
  ORDER_SUMMARY = '/supper/view/summary',
  ORDER_SUMMARY_BY_ID = '/supper/view/summary/:supperGroupId',
  VIEW_ORDER = '/supper/view/order',
  VIEW_ORDER_BY_ID = '/supper/view/order/:supperGroupId',
  USER_VIEW_ORDER = '/supper/view/user/order', //TODO: Remove after testing
  USER_VIEW_ORDER_BY_ID = '/supper/view/user/order/:supperGroupId', //TODO: Remove after testing
  VIEW_CART = '/supper/view/cart',
  VIEW_CART_BY_ID = '/supper/view/cart/:supperGroupId',
  CONFIRM_ORDER = '/supper',
  CONFIRM_ORDER_BY_ID = '/supper/:supperGroupId/confirm',
  VIEW_PAYMENT_SCREEN = '/supper/view/payment',
  VIEW_PAYMENT_SCREEN_BY_ID = '/supper/view/payment/:supperGroupId',
  DELIVERY_DETAILS = '/supper/order',
  DELIVERY_DETAILS_BY_ID = '/supper/order/:supperGroupId/details',
  EDIT_SUPPER_GROUP = '/supper/edit/order',
  EDIT_SUPPER_GROUP_BY_ID = '/supper/edit/order/:supperGroupId',
  EDIT_FOOD_ITEM = '/supper/edit',
  EDIT_FOOD_ITEM_BY_ID = '/supper/edit/:supperGroupId/order/:orderId/food/:foodId',
  ADD_FOOD_ITEM = '/supper',
  ADD_FOOD_ITEM_BY_ID = '/supper/:supperGroupId/order/:orderId/add/:foodId',
}

const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))
const Search = React.lazy(() => import(/* webpackChunckName: "Search" */ './Home/Search'))
const FallBack = React.lazy(() => import(/* webpackChunckName: "FallBack" */ './ErrorPages/NotFound'))
// AUTHENTICATION
const Login = React.lazy(() => import(/* webpackChunckName: "Login" */ './Authentication/Login'))
const Signup = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Authentication/Signup'))
// PROFILE
const Profile = React.lazy(() => import(/* webpackChunckName: "Profile" */ './Profile/'))
const EditProfile = React.lazy(() => import(/* webpackChunckName: "EditProfile" */ './Profile/EditProfile'))
const ChangePassword = React.lazy(() => import(/* webpackChunckName: "ChangePassword" */ './Profile/ChangePassword'))
const FriendList = React.lazy(() => import(/* webpackChunckName: "FriendList" */ './Profile/FriendList'))
// SCHEDULING
const Schedule = React.lazy(() => import(/* webpackChunckName: "Scheduling" */ './Schedule'))
const ShareTimetable = React.lazy(() => import(/* webpackChunckName: "ShareTimetable" */ './Schedule/ShareTimetable'))
const EventList = React.lazy(() => import(/* webpackChunckName: "EventList" */ './Schedule/EventList'))
const CreateEvent = React.lazy(() => import(/* webpackChunckName: "CreateEvent" */ './Schedule/CreateEvent'))
const ImportFromNusMods = React.lazy(
  () => import(/* webpackChunckName: "ImportFromNusMods" */ './Schedule/ImportFromNusMods'),
)
const ViewEvent = React.lazy(() => import(/*webpackChunckName: "ViewEvent" */ './Schedule/ViewEvent'))
// FACILITY BOOKING
const FacilityBooking = React.lazy(() => import(/* webpackChunckName: "FacilityBooking" */ './FacilityBooking'))
const ViewFacility = React.lazy(() => import(/* webpackChunckName: "ViewFacility" */ './FacilityBooking/ViewFacility'))
const ViewMyBookings = React.lazy(() => import(/* webpackChunckName: "ViewMyBooking" */ './FacilityBooking/MyBookings'))
const ViewBooking = React.lazy(() => import(/* webpackChunckName: "ViewBooking" */ './FacilityBooking/ViewBooking'))
const CreateBooking = React.lazy(
  () => import(/* webpackChunckName: "CreateBooking" */ './FacilityBooking/CreateBooking'),
)
// LAUNDRY
const LaundryMain = React.lazy(() => import(/* webpackChunckName: "LaundryMain" */ './Laundry'))
const ViewWashingMachine = React.lazy(
  () => import(/* webpackChunckName: "ViewWashingMachine" */ './Laundry/ViewWashingMachine'),
)
//SOCIAL
const ViewPost = React.lazy(() => import(/* webpackChunckName: "ViewPost" */ './Social/ViewPost'))
const CreateEditPost = React.lazy(() => import(/* webpackChunckName: "CreateEditPost" */ './Social/CreateEditPost'))

//SUPPER
const SupperComponents = React.lazy(() => import('./Supper/componentsPage'))
const SupperHome = React.lazy(() => import(/* webpackChunckName: "SupperHome" */ './Supper'))
const SGOverview = React.lazy(() => import(/* webpackChunckName: "SGOverview" */ './Supper/SGOverview'))
const CreateSupperGroup = React.lazy(
  () => import(/* webpackChunckName: "CreateSupperGroup" */ './Supper/CreateSupperGroup'),
)
const JoinOrder = React.lazy(() => import(/* webpackChunckName: "JoinOrder" */ './Supper/JoinOrder'))
const PlaceOrder = React.lazy(() => import(/* webpackChunckName: "PlaceOrder" */ './Supper/PlaceOrder'))
const OrderSummary = React.lazy(() => import(/* webpackChunckName: "OrderSummary" */ './Supper/OrderSummary'))
const ViewOrder = React.lazy(() => import(/* webpackChunckName: "ViewOrder" */ './Supper/ViewOrder'))
const UserViewOrder = React.lazy(() => import(/* webpackChunckName: "UserViewOrder" */ './Supper/UserViewOrder'))
const ViewCart = React.lazy(() => import(/* webpackChunckName: "ViewCart" */ './Supper/ViewCart'))
const ConfirmOrder = React.lazy(() => import(/* webpackChunckName: "ConfirmOrder" */ './Supper/ConfirmOrder'))
const PaymentScreen = React.lazy(() => import(/* webpackChunckName: "PaymentScreen" */ './Supper/PaymentScreen'))
const DeliveryDetails = React.lazy(() => import(/* webpackChunckName: "DeliveryDetails" */ './Supper/DeliveryDetails'))
const EditSupperGroup = React.lazy(() => import(/* webpackChunckName: "EditSupperGroup" */ './Supper/EditSupperGroup'))
const AddFoodItem = React.lazy(() => import(/* webpackChunckName: "AddFoodItem" */ './Supper/AddFoodItem'))
const EditFoodItem = React.lazy(() => import(/* webpackChunckName: "EditFoodItem" */ './Supper/EditFoodItem'))

export default class Routes extends React.Component {
  render() {
    return (
      <Root>
        <Suspense fallback={LoadingSpin}>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <PrivateRoute exact path={PATHS.HOME_PAGE} component={Home} />
            <PrivateRoute exact path={PATHS.SEARCH_PAGE} component={Search} />
            <AuthenticateRoute exact path={PATHS.LOGIN_PAGE} component={Login} />
            <PublicRoute exact path={PATHS.SIGNUP_PAGE} component={Signup} />

            <PrivateRoute exact path={PATHS.VIEW_PROFILE_PAGE} component={Profile} />
            <PrivateRoute exact path={PATHS.EDIT_PROFILE_PAGE} component={EditProfile} />
            <PrivateRoute exact path={PATHS.CHANGE_PASSWORD_PAGE} component={ChangePassword} />
            <PrivateRoute exact path={PATHS.VIEW_FRIEND_LIST_PAGE} component={FriendList} />

            <PrivateRoute exact path={PATHS.SCHEDULE_PAGE} component={Schedule} />
            <PrivateRoute exact path={PATHS.SHARE_TIMETABLE_PAGE} component={ShareTimetable} />
            <PrivateRoute exact path={PATHS.EVENT_LIST_PAGE_WITH_PAGE_INDEX} component={EventList} />
            <PrivateRoute exact path={PATHS.CREATE_EVENT} component={CreateEvent} key={PATHS.CREATE_EVENT} />
            <PrivateRoute exact path={PATHS.IMPORT_FROM_NUSMODS} component={ImportFromNusMods} />
            <PrivateRoute exact path={PATHS.VIEW_EVENT_ID} component={ViewEvent} key={PATHS.VIEW_EVENT_ID} />

            <PrivateRoute exact path={PATHS.FACILITY_BOOKING_MAIN} component={FacilityBooking} />
            <PrivateRoute exact path={PATHS.VIEW_FACILITY} component={ViewFacility} />
            <PrivateRoute exact path={PATHS.VIEW_MY_BOOKINGS} component={ViewMyBookings} />
            <PublicRoute exact path={PATHS.VIEW_FACILITY_BOOKING} component={ViewBooking} />
            <PrivateRoute exact path={PATHS.CREATE_FACILITY_BOOKING} component={CreateBooking} />

            <PublicRoute exact path={PATHS.LAUNDRY_MAIN} component={LaundryMain} />
            <PublicRoute exact path={PATHS.VIEW_WASHING_MACHINE} component={ViewWashingMachine} />

            <PrivateRoute exact path={PATHS.CREATE_POST} component={CreateEditPost} />
            <PrivateRoute exact path={PATHS.EDIT_POST} component={CreateEditPost} />
            <PublicRoute exact path={PATHS.VIEW_POST_ID} component={ViewPost} />

            <PrivateRoute exact path={PATHS.SUPPER_HOME} component={SupperHome} />
            <PrivateRoute exact path={PATHS.SUPPER_COMPONENTS_PAGE} component={SupperComponents} />
            <PrivateRoute exact path={PATHS.SUPPER_GROUP_OVERVIEW_BY_SECTION} component={SGOverview} />
            <PrivateRoute exact path={PATHS.CREATE_SUPPER_GROUP_BY_PAGE} component={CreateSupperGroup} />
            <PublicRoute exact path={PATHS.JOIN_ORDER_BY_ID} component={JoinOrder} />
            <PrivateRoute exact path={PATHS.PLACE_ORDER_BY_ID} component={PlaceOrder} />
            <PrivateRoute exact path={PATHS.ORDER_SUMMARY_BY_ID} component={OrderSummary} />
            <PrivateRoute exact path={PATHS.VIEW_ORDER_BY_ID} component={ViewOrder} />
            <PrivateRoute exact path={PATHS.USER_VIEW_ORDER_BY_ID} component={UserViewOrder} />
            <PrivateRoute exact path={PATHS.VIEW_CART_BY_ID} component={ViewCart} />
            <PrivateRoute exact path={PATHS.CONFIRM_ORDER_BY_ID} component={ConfirmOrder} />
            <PrivateRoute exact path={PATHS.VIEW_PAYMENT_SCREEN_BY_ID} component={PaymentScreen} />
            <PrivateRoute exact path={PATHS.VIEW_CART} component={ViewCart} />
            <PrivateRoute exact path={PATHS.DELIVERY_DETAILS_BY_ID} component={DeliveryDetails} />
            <PrivateRoute exact path={PATHS.EDIT_SUPPER_GROUP_BY_ID} component={EditSupperGroup} />
            <PrivateRoute exact path={PATHS.EDIT_FOOD_ITEM_BY_ID} component={EditFoodItem} />
            <PrivateRoute exact path={PATHS.ADD_FOOD_ITEM_BY_ID} component={AddFoodItem} />

            <PublicRoute component={FallBack} />
          </AnimatedSwitch>
        </Suspense>
      </Root>
    )
  }
}

const Root = styled.div`
  z-index: 0;
`
