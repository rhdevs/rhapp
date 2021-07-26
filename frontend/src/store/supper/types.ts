export type User = {
  _id: string
  userID: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  modules: string[]
}

export type Food = {
  foodId?: string // specific to food, different for different foodmenu
  restaurantId: string
  foodMenuId: string // same id for food throughout each menu
  foodName: string
  comments?: string
  quantity: number
  price: number
  foodPrice: number //with add ons
  cancelAction?: CancelAction
  custom?: Custom[]
  userIdList?: string[] // for owner to contact users with the same food in collated view
  updates?: Updates // for owner updates
  foodIdList?: string[] //for collated food
}

export type Option = {
  name: string
  isSelected?: boolean
  price: number
}

export enum CancelAction {
  REMOVE = 'Remove',
  CONTACT = 'Contact',
}

// type Custom refers to a section in the customization page
export type Custom = {
  title: string
  options: Option[]
  max: number | null
  min: number
  customNumber?: number //to order the sections in the order card
}

export type FoodMenu = {
  foodMenuId: string
  restaurantId: string
  foodMenuName: string
  section: string
  price: number
  custom?: Custom[]
}

export type Restaurant = {
  restaurantId: string
  name: string
  restaurantLogo: string
  menu: FoodMenu[]
  allSection: string[]
}

export enum Restaurants {
  MCDONALDS = "McDonald's",
  ALAMAANS = "Al Amaan's",
  KIMLYDIMSUM = 'Kimly Dim Sum',
}

export type Order = {
  orderId: string
  user: User
  supperGroupId: number | undefined
  userContact?: number
  foodList: Food[]
  totalCost: number // not inclusive of delivery fee
  hasPaid: boolean //1 if user paid owner (user POV)
  paymentMethod?: PaymentMethod
  hasReceived: boolean //1 if owner received payment (owner POV)
  createdAt: number
}

export type SupperGroup = {
  additionalCost?: number //ie GST, delivery fee
  comments?: string // for cancel reason
  costLimit: number | undefined // can have no limit
  createdAt: number | undefined
  currentFoodCost: number //non inclusive of additionalCost
  location: string //collection point
  numOrders: number
  ownerId: string
  ownerName: string
  ownerTele: string
  paymentInfo: PaymentInfo[]
  restaurantLogo?: string
  restaurantName: string
  restaurantId?: string
  splitAdditionalCost: SplitACMethod | undefined
  status: SupperGroupStatus
  supperGroupId: number | undefined
  supperGroupName: string
  totalPrice: number // additionalcost + currentfoodcost
  userIdList?: string[]
  orderList?: Order[]
  estArrivalTime?: number
  closingTime: number | undefined
  phoneNumber?: number
  wasDeliveryUpdated?: boolean
}

export type HomeSupperGroup = {
  additionalCost?: number //ie GST, delivery fee
  costLimit: number | undefined // can have no limit
  createdAt: number | undefined
  currentFoodCost: number //non inclusive of additionalCost
  numOrders: number
  ownerId: string
  ownerName: string
  ownerTele: string
  restaurantName: string
  restaurantId?: string
  splitAdditionalCost: SplitACMethod | undefined
  status: SupperGroupStatus
  supperGroupId: number | undefined
  supperGroupName: string
  userIdList?: string[]
  closingTime: number | undefined
}

export type CollatedOrder = {
  supperGroupId: number | undefined
  ownerId: string
  collatedOrderList: Food[]
}

export enum SplitACMethod {
  PROPORTIONAL = 'Proportional',
  EQUAL = 'Equal',
}

export enum SupperGroupStatus {
  OPEN = 'Open',
  PENDING = 'Pending', // When order price exceeds 90% of cost limit
  CLOSED = 'Closed',
  ORDERED = 'Ordered',
  ARRIVED = 'Arrived',
  CANCELLED = 'Cancelled',
  AWAITING_PAYMENT = 'Awaiting Payment', // for owner
  ALL_PAID = 'All Paid', // for owner
  PAID = 'Paid', // for user
  NOT_PAID = 'Not Paid', // for user
}

export enum PaymentMethod {
  PAYLAH = 'PayLah!',
  PAYNOW = 'PayNow',
  GOOGLEPAY = 'GooglePay',
  CASH = 'Cash',
}

export type PaymentInfo = {
  paymentMethod: PaymentMethod
  link?: string | null
}

export type PaymentUpdateInfo = {
  orderId: string
  hasReceived: boolean
}

export enum UserType {
  OWNER = 'Owner',
  USER = 'User',
  WATCHER = 'Watcher',
}

export type UserDetails = {
  userId: string
  name: string
  telegramHandle: string
}

export type Updates = {
  updateAction?: UpdateAction
  reason?: string
  change?: string
  updatedPrice?: number
  global?: boolean //true when updating collated food
}

export enum UpdateAction {
  UPDATE = 'Update',
  REMOVE = 'Remove',
}

export type SupperNotification = {
  supperGroupId: number
  supperGroupName: string
}

export enum Filter {
  DEFAULT = 'Default',
  ASCENDING = 'Ascending',
  DESCENDING = 'Descending',
}

export enum SUPPER_ACTIONS {
  SET_IS_LOADING = 'SUPPER_ACTIONS.SET_IS_LOADING',
  GET_COLLATED_ORDER = 'SUPPER_ACTION.GET_COLLATED_ORDER',
  GET_ORDER_BY_ID = 'SUPPER_ACTION.GET_ORDER_BY_ID',
  GET_ORDER_BY_USER = 'SUPPER_ACTION.GET_ORDER_BY_USER',
  SET_ORDER_BY_ID = 'SUPPER_ACTION.SET_ORDER_BY_ID',
  GET_ALL_RESTAURANTS = 'SUPPER_ACTIONS.GET_ALL_RESTAURANTS',
  GET_RESTAURANT_BY_ID = 'SUPPER_ACTIONS.GET_RESTAURANT_BY_ID',
  GET_FOOD_BY_ID = 'SUPPER_ACTIONS.GET_FOOD_BY_ID',
  SET_FOOD_BY_ID = 'SUPPER_ACTIONS.SET_FOOD_BY_ID',
  SET_SUPPER_GROUP = 'SUPPER_ACTIONS.SET_SUPPER_GROUP',
  GET_SUPPER_GROUP_BY_ID = 'SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID',
  GET_ALL_SUPPER_GROUPS = 'SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS',
  GET_RESTAURANT_MENU = 'SUPPER_ACTIONS.GET_RESTAURANT_MENU',
  GET_MENU_FOOD = 'SUPPER_ACTIONS.GET_MENU_FOOD',
  GET_ORDER_HISTORY = 'SUPPER_ACTIONS.GET_ORDER_HISTORY',
  GET_SUPPER_GROUP_HISTORY = 'SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY',
  GET_JOINED_SUPPER_GROUP_HISTORY = 'SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY',
  SET_COUNT = 'SUPPER_ACTIONS.SET_COUNT',
  SET_PRICE_LIMIT = 'SUPPER_ACTIONS.SET_PRICE_LIMIT',
  SET_DELIVERY_TIME = 'SUPPER_ACTIONS.SET_DELIVERY_TIME',
  SET_EXPANDABLE_CARD_STATUS = 'SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS',
  SET_SELECTED_PAYMENT_METHOD = 'SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD',
  SET_SELECTED_RESTAURANT = 'SUPPER_ACTIONS.SET_SELECTED_RESTAURANT',
  SET_SELECTED_SUPPER_GROUP_STATUS = 'SUPPER_ACTIONS.SET_SELECTED_SUPPER_GROUP_STATUS',
  SET_SEARCHED_SUPPER_GROUPS = 'SUPPER_ACTIONS.SET_SEARCHED_SUPPER_GROUPS',
  SET_SEARCH_SUPPER_GROUP_VALUE = 'SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE',
  SET_TABS_KEY = 'SUPPER_ACTIONS.SET_TABS_KEY',
  GET_EDIT_FOOD_ITEM = 'SUPPER_ACTIONS.GET_EDIT_FOOD_ITEM',
  SET_MENU_TAB_KEY = 'SUPPER_ACTIONS.SET_MENU_TAB_KEY',
  SET_EXPAND_ALL = 'SUPPER_ACTIONS.SET_EXPAND_ALL',
  SET_PAYMENT_EXPANDED_COUNT = 'SUPPER_ACTIONS.SET_PAYMENT_EXPANDED_COUNT',
  SET_ESTIMATED_ARRIVAL_TIME = 'SUPPER_ACTIONS.SET_ESTIMATED_ARRIVAL_TIME',
  SET_EDIT_ORDER_NUMBER = 'SUPPER_ACTIONS.SET_EDIT_ORDER_NUMBER',
  SET_COUNTER = 'SUPPER_ACTIONS.SET_COUNTER',
  SET_FOOD_ID = 'SUPPER_ACTIONS.SET_FOOD_ID',
  SET_ORDER_ID = 'SUPPER_ACTIONS.SET_ORDER_ID',
  SET_PAYMENT_UPDATE_ARRAY = 'SUPPER_ACTIONS.SET_PAYMENT_UPDATE_ARRAY',
  SET_MENU_FOOD_ID = 'SUPPER_ACTIONS.SET_MENU_FOOD_ID',
  SET_CREATE_ORDER_PAGE = 'SUPPER_ACTIONS.SET_CREATE_ORDER_PAGE',
  SET_NEW_SUPPER_GROUP_ID = 'SUPPER_ACTIONS.SET_NEW_SUPPER_GROUP_ID',
  SET_FOOD_STATE = 'SUPPER_ACTIONS.SET_FOOD_STATE',
  GET_SUPPER_NOTIFICATIONS = 'SUPPER_ACTIONS.GET_SUPPER_NOTIFICATIONS',
  GET_FILTERED_SUPPER_GROUPS = 'SUPPER_ACTIONS.GET_FILTERED_SUPPER_GROUPS',
  SET_IS_FOOD_MODAL_OPEN = 'SUPPER_ACTIONS.SET_IS_FOOD_MODAL_OPEN',
  SET_FOOD_MODAL_INFO = 'SUPPER_ACTIONS.SET_FOOD_MODAL_INFO',
  SET_CLOSING_TIME_FILTER = 'SUPPER_ACTIONS.SET_CLOSING_TIME_FILTER',
  SET_AMOUNT_LEFT_FILTER = 'SUPPER_ACTIONS.SET_AMOUNT_LEFT_FILTER',
  SET_RESTAURANT_FILTER = 'SUPPER_ACTIONS.SET_RESTAURANT_FILTER',
  SET_SUPPER_ERROR_MESSAGE = 'SUPPER_ACTIONS.SET_SUPPER_ERROR_MESSAGE',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type GetCollatedOrder = {
  type: typeof SUPPER_ACTIONS.GET_COLLATED_ORDER
  collatedOrder: CollatedOrder | null
}

type GetOrderById = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_BY_ID
  order: Order | null
}

type GetOrderByUser = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_BY_USER
  order: Order | null
}

type SetOrderById = {
  type: typeof SUPPER_ACTIONS.SET_ORDER_BY_ID
  order: Order | null
}

type GetAllRestaurants = {
  type: typeof SUPPER_ACTIONS.GET_ALL_RESTAURANTS
  allRestaurants: Restaurant[]
}

type GetRestaurantById = {
  type: typeof SUPPER_ACTIONS.GET_RESTAURANT_BY_ID
  restaurant: Restaurant
}

type GetFoodById = {
  type: typeof SUPPER_ACTIONS.GET_FOOD_BY_ID
  food: Food
}

type SetFoodById = {
  type: typeof SUPPER_ACTIONS.SET_FOOD_BY_ID
  food: Food
}

type SetSupperGroup = {
  type: typeof SUPPER_ACTIONS.SET_SUPPER_GROUP
  supperGroup: SupperGroup | null
}

type GetSupperGroupById = {
  type: typeof SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID
  supperGroup: SupperGroup | null
}

type GetAllSupperGroups = {
  type: typeof SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS
  allSupperGroups: HomeSupperGroup[]
}

type GetRestaurantMenu = {
  type: typeof SUPPER_ACTIONS.GET_RESTAURANT_MENU
  menu: FoodMenu[]
}

type GetMenuFood = {
  type: typeof SUPPER_ACTIONS.GET_MENU_FOOD
  foodMenu: FoodMenu
}

type GetOrderHistory = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_HISTORY
  orderHistory: Order[]
}

type GetSupperGroupHistory = {
  type: typeof SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY
  createdSupperHistory: HomeSupperGroup[]
}

type GetJoinedSupperGroupHistory = {
  type: typeof SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY
  joinedSupperHistory: HomeSupperGroup[]
}

type SetCount = {
  type: typeof SUPPER_ACTIONS.SET_COUNT
  count: number
}

type SetPriceLimit = {
  type: typeof SUPPER_ACTIONS.SET_PRICE_LIMIT
  priceLimit: number
}

type SetDeliveryTime = {
  type: typeof SUPPER_ACTIONS.SET_DELIVERY_TIME
  deliveryTime: number
}

type SetExpandableCardStatus = {
  type: typeof SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS
  isExpanded: boolean
}

type SetSelectedPaymentMethod = {
  type: typeof SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD
  selectedPaymentMethod: PaymentMethod[]
}

type SetSelectedRestaurant = {
  type: typeof SUPPER_ACTIONS.SET_SELECTED_RESTAURANT
  selectedRestaurant: string | null
}

type SetSelectedSupperGroupStatus = {
  type: typeof SUPPER_ACTIONS.SET_SELECTED_SUPPER_GROUP_STATUS
  selectedSupperGroupStatus: SupperGroupStatus | null
}

type setFilteredSupperGroups = {
  type: typeof SUPPER_ACTIONS.SET_SEARCHED_SUPPER_GROUPS
  filteredSupperGroups: HomeSupperGroup[]
}

type SetSearchSupperGroupValue = {
  type: typeof SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE
  searchValue: string
}

type SetTabsKey = {
  type: typeof SUPPER_ACTIONS.SET_TABS_KEY
  tabsKey: string
}

type GetEditFoodItem = {
  type: typeof SUPPER_ACTIONS.GET_EDIT_FOOD_ITEM
  editFoodItem: Food | null
}

type SetMenuTabKey = {
  type: typeof SUPPER_ACTIONS.SET_MENU_TAB_KEY
  menuTabKey: string
}

type SetExpandAll = {
  type: typeof SUPPER_ACTIONS.SET_EXPAND_ALL
  isExpandAll: boolean
}

type SetPaymentExpandedCount = {
  type: typeof SUPPER_ACTIONS.SET_PAYMENT_EXPANDED_COUNT
  expandedCount: number
}

type SetEstimatedArrivalTime = {
  type: typeof SUPPER_ACTIONS.SET_ESTIMATED_ARRIVAL_TIME
  estArrivalTime: string
}

type SetEditOrderNumber = {
  type: typeof SUPPER_ACTIONS.SET_EDIT_ORDER_NUMBER
  editOrderNumber: number
}

type SetCounter = {
  type: typeof SUPPER_ACTIONS.SET_COUNTER
  counter: number
}

type SetFoodId = {
  type: typeof SUPPER_ACTIONS.SET_FOOD_ID
  foodId: string
}

type GetOrderId = {
  type: typeof SUPPER_ACTIONS.SET_ORDER_ID
  orderId: string
}

type SetPaymentUpdateArray = {
  type: typeof SUPPER_ACTIONS.SET_PAYMENT_UPDATE_ARRAY
  paymentUpdateArray: PaymentUpdateInfo[]
}

type SetMenuFoodId = {
  type: typeof SUPPER_ACTIONS.SET_MENU_FOOD_ID
  foodMenuId: string
}

type SetCreateOrderPage = {
  type: typeof SUPPER_ACTIONS.SET_CREATE_ORDER_PAGE
  createOrderPage: number
}

type SetNewSupperGroupId = {
  type: typeof SUPPER_ACTIONS.SET_NEW_SUPPER_GROUP_ID
  newSupperGroupId: number
}

type SetFoodState = {
  type: typeof SUPPER_ACTIONS.SET_FOOD_STATE
  food: null | Food
}

type getSupperNotificationss = {
  type: typeof SUPPER_ACTIONS.GET_SUPPER_NOTIFICATIONS
  supperNotifications: SupperNotification[]
}

type SetIsFoodModalOpen = {
  type: typeof SUPPER_ACTIONS.SET_IS_FOOD_MODAL_OPEN
  isFoodMenuModalOpen: boolean
}

type SetFoodModalInfo = {
  type: typeof SUPPER_ACTIONS.SET_FOOD_MODAL_INFO
  foodMenuModalId: string
  modalMenuFoodName: string
}

type setClosingTimeFilter = {
  type: typeof SUPPER_ACTIONS.SET_CLOSING_TIME_FILTER
  closingTimeFilter: Filter
}

type setAmountLeftFilter = {
  type: typeof SUPPER_ACTIONS.SET_AMOUNT_LEFT_FILTER
  amountLeftFilter: Filter
}

type setRestaurantFilter = {
  type: typeof SUPPER_ACTIONS.SET_RESTAURANT_FILTER
  restaurantFilter: Restaurants[]
}

type SetSupperErrorMessage = {
  type: typeof SUPPER_ACTIONS.SET_SUPPER_ERROR_MESSAGE
  supperErrorMessage: string | undefined
}

export type ActionTypes =
  | SetIsLoading
  | GetAllRestaurants
  | GetRestaurantById
  | GetOrderById
  | GetOrderByUser
  | GetCollatedOrder
  | SetOrderById
  | GetFoodById
  | SetFoodById
  | SetSupperGroup
  | GetSupperGroupById
  | GetAllSupperGroups
  | GetRestaurantMenu
  | GetMenuFood
  | GetOrderHistory
  | GetSupperGroupHistory
  | GetEditFoodItem
  | GetJoinedSupperGroupHistory
  | SetCount
  | SetPriceLimit
  | SetDeliveryTime
  | SetExpandableCardStatus
  | SetSelectedPaymentMethod
  | SetSelectedRestaurant
  | SetSelectedSupperGroupStatus
  | setFilteredSupperGroups
  | SetSearchSupperGroupValue
  | SetTabsKey
  | SetMenuTabKey
  | SetExpandAll
  | SetPaymentExpandedCount
  | SetEstimatedArrivalTime
  | SetEditOrderNumber
  | SetCounter
  | SetFoodId
  | GetOrderId
  | SetPaymentUpdateArray
  | SetMenuFoodId
  | SetCreateOrderPage
  | SetNewSupperGroupId
  | SetFoodState
  | getSupperNotificationss
  | SetIsFoodModalOpen
  | SetFoodModalInfo
  | setClosingTimeFilter
  | setAmountLeftFilter
  | setRestaurantFilter
  | SetSupperErrorMessage
