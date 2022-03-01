import React, { Suspense } from 'react'
import styled from 'styled-components'
// import { Switch } from 'react-router-dom'
import LoadingSpin from '../components/LoadingSpin'
import { PrivateRoute, PublicRoute, AuthenticateRoute } from './RouteTypes'
import { AnimatedSwitch } from 'react-router-transition'

export enum PATHS {
  // DOCUMENTATION
  DOCS_LANDING_PAGE = '/docs',
  DOCS_SUPPER_BY_FILE = '/docs/supper/:file',
  DOCS_SUPPER = '/docs/supper',
  // MAIN LANDING PAGE
  HOME_PAGE = '/',
  SEARCH_PAGE = '/search',
  // AUTHENTICATION
  LOGIN_PAGE = '/auth/login',
  SIGNUP_PAGE = '/auth/signup',
  FORGET_PASSWORD_PAGE = '/auth/forget',
  RESET_PASSWORD_PAGE = '/auth/reset/:resetToken',
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
  VIEW_FACILITY_CONFLICT = '/facility/booking/create/conflict',
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
  SUPPER_HISTORY = '/supper/history',
  CREATE_SUPPER_GROUP = '/supper/create',
  CREATE_SUPPER_GROUP_BY_PAGE = '/supper/create/:page',
  JOIN_GROUP = '/supper/join/order',
  JOIN_GROUP_BY_ID = '/supper/join/order/:supperGroupId',
  ORDER = '/supper',
  ORDER_BY_ID = '/supper/:supperGroupId/:restaurantId/order',
  ORDER_SUMMARY = '/supper/view/summary',
  ORDER_SUMMARY_BY_ID = '/supper/view/summary/:supperGroupId',
  VIEW_ORDER = '/supper/view/order',
  VIEW_ORDER_BY_ID = '/supper/view/order/:supperGroupId',
  DELIVERY_DETAILS = '/supper/order',
  DELIVERY_DETAILS_BY_ID = '/supper/order/:supperGroupId/details',
  EDIT_SUPPER_GROUP = '/supper/edit/order',
  EDIT_SUPPER_GROUP_BY_ID = '/supper/edit/order/:supperGroupId',
  EDIT_FOOD_ITEM = '/supper/edit',
  EDIT_FOOD_ITEM_BY_ID = '/supper/edit/:supperGroupId/order/:orderId/food/:foodId',
  ADD_FOOD_ITEM = '/supper',
  ADD_FOOD_ITEM_BY_ID = '/supper/:supperGroupId/order/:orderId/add/:foodId',
  UPDATE_FOOD_ITEM = '/supper',
  UPDATE_FOOD_ITEM_BY_ID = '/supper/:supperGroupId/update/order/:orderId/food/:foodId',
  UPDATE_ALL_FOOD_ITEM = '/supper',
  UPDATE_ALL_FOOD_ITEM_BY_ID = '/supper/:supperGroupId/update/collated/:foodId',
  UPDATE_DELIVERY = '/supper',
  UPDATE_DELIVERY_BY_ID = '/supper/:supperGroupId/update/delivery',
  USER_PAYMENT = '/supper/payment/order',
  USER_PAYMENT_BY_ID = '/supper/payment/order/:orderId',

  PREVIEW = '/facility/preview',
}
//DOCUMENTATION
const Docs = React.lazy(() => import(/* webpackChunckName: "Docs" */ '../docs/index'))
const Supper_Documentation = React.lazy(() => import(/* webpackChunckName: "Supper_Documentation" */ '../docs/supper'))

const Home = React.lazy(() => import(/* webpackChunckName: "Home" */ './Home'))
const Search = React.lazy(() => import(/* webpackChunckName: "Search" */ './Home/Search'))
const FallBack = React.lazy(() => import(/* webpackChunckName: "FallBack" */ './ErrorPages/NotFound'))
const ComingSoon = React.lazy(() => import(/* webpackChunckName: "ComingSoon" */ './ErrorPages/ComingSoon'))
// AUTHENTICATION
const Login = React.lazy(() => import(/* webpackChunckName: "Login" */ './Authentication/Login'))
const Signup = React.lazy(() => import(/* webpackChunckName: "Signup" */ './Authentication/Signup'))
const ForgetPassword = React.lazy(() => import(/* webpackChunckName: "ForgetPassword" */ './Authentication/Forget'))
const ResetPassword = React.lazy(() => import(/* webpackChunckName: "ResetPassword" */ './Authentication/Reset'))

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
const ViewConflict = React.lazy(() => import(/* webpackChunckName: "ViewConflict" */ './FacilityBooking/ViewConflicts'))
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
const GroupHistory = React.lazy(() => import(/* webpackChunckName: "GroupHistory" */ './Supper/GroupHistory'))
const CreateSupperGroup = React.lazy(
  () => import(/* webpackChunckName: "CreateSupperGroup" */ './Supper/CreateSupperGroup'),
)
const JoinGroup = React.lazy(() => import(/* webpackChunckName: "JoinGroup" */ './Supper/JoinGroup'))
const Order = React.lazy(() => import(/* webpackChunckName: "Order" */ './Supper/Order'))
const OrderSummary = React.lazy(() => import(/* webpackChunckName: "OrderSummary" */ './Supper/OrderSummary'))
const ViewOrder = React.lazy(() => import(/* webpackChunckName: "ViewOrder" */ './Supper/ViewOrder'))
const DeliveryDetails = React.lazy(() => import(/* webpackChunckName: "DeliveryDetails" */ './Supper/DeliveryDetails'))
const EditSupperGroup = React.lazy(() => import(/* webpackChunckName: "EditSupperGroup" */ './Supper/EditSupperGroup'))
const AddFoodItem = React.lazy(() => import(/* webpackChunckName: "AddFoodItem" */ './Supper/AddFoodItem'))
const EditFoodItem = React.lazy(() => import(/* webpackChunckName: "EditFoodItem" */ './Supper/EditFoodItem'))
const UpdateItem = React.lazy(() => import(/* webpackChunckName: "UpdateItem" */ './Supper/OrderSummary/UpdateItem'))
const UpdateDelivery = React.lazy(
  () => import(/* webpackChunckName: "UpdateDelivery" */ './Supper/OrderSummary/UpdateDelivery'),
)
const UpdateAllItems = React.lazy(
  () => import(/* webpackChuckName: "UpdateAllItems" */ './Supper/OrderSummary/UpdateAllItems'),
)
const Payment = React.lazy(() => import(/* webpackChuckName: "Payment" */ './Supper/Payment'))

const Preview = React.lazy(() => import(/* webpackChuckName: "Preview" */ './FacilityBooking/CreateBooking/Preview'))
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
            <PublicRoute exact path={PATHS.FORGET_PASSWORD_PAGE} component={ForgetPassword} />
            <PublicRoute exact path={PATHS.RESET_PASSWORD_PAGE} component={ResetPassword} />

            <PrivateRoute exact path={PATHS.VIEW_PROFILE_PAGE} component={Profile} />
            <PrivateRoute exact path={PATHS.EDIT_PROFILE_PAGE} component={EditProfile} />
            <PrivateRoute exact path={PATHS.CHANGE_PASSWORD_PAGE} component={ChangePassword} />
            <PrivateRoute exact path={PATHS.VIEW_FRIEND_LIST_PAGE} component={FriendList} />

            <PrivateRoute exact path={PATHS.SCHEDULE_PAGE} component={ComingSoon} />
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
            <PublicRoute exact path={PATHS.VIEW_FACILITY_CONFLICT} component={ViewConflict} />

            <PublicRoute exact path={PATHS.LAUNDRY_MAIN} component={ComingSoon} />
            <PublicRoute exact path={PATHS.VIEW_WASHING_MACHINE} component={ComingSoon} />

            <PrivateRoute exact path={PATHS.CREATE_POST} component={CreateEditPost} />
            <PrivateRoute exact path={PATHS.EDIT_POST} component={CreateEditPost} />
            <PublicRoute exact path={PATHS.VIEW_POST_ID} component={ViewPost} />

            <PrivateRoute exact path={PATHS.SUPPER_HOME} component={SupperHome} />
            <PrivateRoute exact path={PATHS.SUPPER_COMPONENTS_PAGE} component={SupperComponents} />
            <PrivateRoute exact path={PATHS.SUPPER_HISTORY} component={GroupHistory} />
            <PrivateRoute exact path={PATHS.CREATE_SUPPER_GROUP_BY_PAGE} component={CreateSupperGroup} />
            <PublicRoute exact path={PATHS.JOIN_GROUP_BY_ID} component={JoinGroup} />
            <PrivateRoute exact path={PATHS.ORDER_BY_ID} component={Order} />
            <PrivateRoute exact path={PATHS.ORDER_SUMMARY_BY_ID} component={OrderSummary} />
            <PrivateRoute exact path={PATHS.VIEW_ORDER_BY_ID} component={ViewOrder} />
            <PrivateRoute exact path={PATHS.DELIVERY_DETAILS_BY_ID} component={DeliveryDetails} />
            <PrivateRoute exact path={PATHS.EDIT_SUPPER_GROUP_BY_ID} component={EditSupperGroup} />
            <PrivateRoute exact path={PATHS.EDIT_FOOD_ITEM_BY_ID} component={EditFoodItem} />
            <PrivateRoute exact path={PATHS.ADD_FOOD_ITEM_BY_ID} component={AddFoodItem} />
            <PrivateRoute exact path={PATHS.UPDATE_FOOD_ITEM_BY_ID} component={UpdateItem} />
            <PrivateRoute exact path={PATHS.UPDATE_DELIVERY_BY_ID} component={UpdateDelivery} />
            <PrivateRoute exact path={PATHS.UPDATE_ALL_FOOD_ITEM_BY_ID} component={UpdateAllItems} />
            <PrivateRoute exact path={PATHS.USER_PAYMENT_BY_ID} component={Payment} />

            <PublicRoute exact path={PATHS.DOCS_LANDING_PAGE} component={Docs} />
            <PublicRoute exact path={PATHS.DOCS_SUPPER_BY_FILE} component={Supper_Documentation} />

            {/* TODO: Remove before merging */}
            <PublicRoute exact path={PATHS.PREVIEW} component={Preview} />

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
