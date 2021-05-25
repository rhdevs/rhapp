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
  foodId: string
  restaurantId: string
  foodMenuId: string
  foodName: string
  comments?: string
  quantity: number
  price: number
  foodPrice: number //with add ons
  cancelAction?: CancelAction
  custom?: Custom[]
}

export type Option = {
  name: string
  isSelected: boolean
  price: number
}

export enum CancelAction {
  contact = 'contact',
  cancel = 'cancel',
}

// type Custom refers to a section in the customization page
export type Custom = {
  title: string
  options: Option[]
  max: number | null
  min: number
  customNumber: number //to order the sections in the order card
}

export type FoodMenu = {
  foodMenuId: string
  restaurantId: string
  foodMenuName: string
  price: number
  custom?: Custom[]
}

export type Restaurant = {
  restaurantId: string
  name: string
  restaurantLogo: string
  menu: FoodMenu[]
}

export enum Restaurants {
  McDonalds = "McDonald's",
  AlAmmans = "Al Amaan's",
  KimlyDimSum = 'Kimly Dim Sum',
}

export type Order = {
  orderId: string
  user: User
  supperGroupId: string
  userContact?: number
  foodList: Food[]
  totalCost: number
  hasPaid: boolean //1 if user paid owner (user POV)
  paymentMethod: PaymentMethod
  hasReceived: boolean //1 if owner received payment (owner POV)
  createdAt: number
}

export type SupperGroup = {
  additionalCost?: number //ie GST, delivery fee
  comments?: string
  costLimit: number
  createdAt: number
  currentFoodCost: number //non inclusive of additionalCost
  location: string //collection point
  numOrders: number
  ownerId: string
  ownerName: string
  ownerTele: string
  paymentInfo: PaymentInfo[]
  restaurantLogo?: string
  restaurantName: string
  splitAdditionalCost: SplitACMethod
  status: SupperGroupStatus
  supperGroupId: number
  supperGroupName: string
  totalPrice: number
  userIdList: string[]
  orderList?: Order[]
  estArrivalTime?: number
  closingTime: number
}

export type CollatedOrder = {
  supperGroupId: string
  ownerId: string
  collatedOrderList: Food[]
  price?: number
}

export enum SplitACMethod {
  PROPORTIONAL = 'Proportional',
  EQUAL = 'Equal',
}

export enum SupperGroupStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ORDERED = 'Ordered',
  ARRIVED = 'Arrived',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum PaymentMethod {
  PAYLAH = 'PayLah!',
  PAYNOW = 'PayNow',
  GOOGLEPAY = 'GooglePay',
  CASH = 'Cash',
}

export type PaymentInfo = {
  paymentMethod: PaymentMethod
  link?: string
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
  GET_SEARCHED_SUPPER_GROUPS = 'SUPPER_ACTIONS.GET_SEARCHED_SUPPER_GROUPS',
  SET_SEARCH_SUPPER_GROUP_VALUE = 'SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE',
  SET_TABS_KEY = 'SUPPER_ACTIONS.SET_TABS_KEY',
  SET_EXPAND_ALL = 'SUPPER_ACTIONS.SET_EXPAND_ALL',
  SET_PAYMENT_EXPANDED_COUNT = 'SUPPER_ACTIONS.SET_PAYMENT_EXPANDED_COUNT',
  SET_ESTIMATED_ARRIVAL_TIME = 'SUPPER_ACTIONS.SET_ESTIMATED_ARRIVAL_TIME',
  SET_EDIT_ORDER_NUMBER = 'SUPPER_ACTIONS.SET_EDIT_ORDER_NUMBER',
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
  allSupperGroups: SupperGroup[]
}

type GetRestaurantMenu = {
  type: typeof SUPPER_ACTIONS.GET_RESTAURANT_MENU
  menu: FoodMenu[]
}

type GetMenuFood = {
  type: typeof SUPPER_ACTIONS.GET_MENU_FOOD
  menuFood: FoodMenu
}

type GetOrderHistory = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_HISTORY
  orderHistory: Order[]
}

type GetSupperGroupHistory = {
  type: typeof SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY
  supperGroupHistory: SupperGroup[]
}

type GetJoinedSupperGroupHistory = {
  type: typeof SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY
  joinedSupperGroupHistory: SupperGroup[]
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

type GetSearchedSupperGroups = {
  type: typeof SUPPER_ACTIONS.GET_SEARCHED_SUPPER_GROUPS
  searchedSupperGroups: SupperGroup[]
}

type SetSearchSupperGroupValue = {
  type: typeof SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE
  searchValue: string
}

type SetTabsKey = {
  type: typeof SUPPER_ACTIONS.SET_TABS_KEY
  tabsKey: string
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
  | GetJoinedSupperGroupHistory
  | SetCount
  | SetPriceLimit
  | SetDeliveryTime
  | SetExpandableCardStatus
  | SetSelectedPaymentMethod
  | SetSelectedRestaurant
  | SetSelectedSupperGroupStatus
  | GetSearchedSupperGroups
  | SetSearchSupperGroupValue
  | SetTabsKey
  | SetExpandAll
  | SetPaymentExpandedCount
  | SetEstimatedArrivalTime
  | SetEditOrderNumber
