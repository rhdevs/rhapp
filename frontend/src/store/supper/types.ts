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
  comments?: string
  quantity: number
  foodMenu: FoodMenu
}

export type Option = {
  name: string
  isSelected: boolean
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
  price: string
  custom?: Custom[]
}

export type Restaurant = {
  restaurantId: string
  name: string
  menu: FoodMenu[]
}

export type Order = {
  orderId: string
  user: string
  supperGroupId: string
  userContact?: number
  foodList: Food[]
  totalCost: number
  hasPaid: boolean //1 if user paid owner (user POV)
  paymentMethod: PaymentMethod
  hasReceived: boolean //1 if owner received payment (owner POV)
}

export type SupperGroup = {
  supperGroupId: string
  supperGroupName: string
  owner: string
  ownerName: string
  paymentInfo: PaymentInfo[]
  restaurantName: string
  allUsers: User[]
  orderList: Order[]
  additionalCost?: number //ie GST, delivery fee
  splitAdditionalCost: SplitACMethod
  currentFoodCost: number //non inclusive of additionalCost
  costLimit: number
  status: string
  location: string //collection point
  deliveryDuration: number
  arrivalTime: number // = creationTime + estimated delivery duration
  closingTime: string
}

export type CollatedOrder = {
  supperGroupId: string
  ownerId: string
  collatedOrderList: Food[]
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
  GET_ALL_ORDERS = 'SUPPER_ACTION.GET_ALL_ORDERS',
  GET_COLLATED_ORDER = 'SUPPER_ACTION.GET_COLLATED_ORDER',
  GET_SUPPER_GROUP = 'SUPPER_ACTION.GET_SUPPER_GROUP',
  GET_ORDER = 'SUPPER_ACTION.GET_ORDER',
  GET_SUPPER_GROUP_STATUS = 'SUPPER_ACTION.GET_SUPPER_GROUP_STATUS',
  SET_SUPPER_GROUP = 'SUPPER_ACTION.SET_SUPPER_GROUP',
  SET_ORDER = 'SUPPER_ACTION.SET_ORDER',
  SET_SUPPER_GROUP_STATUS = 'SUPPER_ACTION.SET_SUPPER_GROUP_STATUS',
  GET_RESTAURANT_INFO = 'SUPPER_ACTIONS.GET_RESTAURANT_INFO',
  GET_ALL_RESTAURANTS_INFO = 'SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO',
  GET_USER_INFO = 'SUPPER_ACTIONS.GET_USER_INFO',
  GET_ALL_USERS = 'SUPPER_ACTIONS.GET_ALL_USERS',
  GET_FOOD_BY_FOOD_ID = 'SUPPER_ACTIONS.GET_FOOD_BY_FOOD_ID',
  SET_FOOD_BY_FOOD_ID = 'SUPPER_ACTIONS.SET_FOOD_BY_FOOD_ID',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type GetAllOrders = {
  type: typeof SUPPER_ACTIONS.GET_ALL_ORDERS
  allOrders: Order[]
}

type GetCollatedOrder = {
  type: typeof SUPPER_ACTIONS.GET_COLLATED_ORDER
  collatedOrder: CollatedOrder | null
}

type GetSupperGroup = {
  type: typeof SUPPER_ACTIONS.GET_SUPPER_GROUP
  supperGroup: SupperGroup | null
}

type GetOrder = {
  type: typeof SUPPER_ACTIONS.GET_ORDER
  order: Order | null
}

type GetSupperGroupStatus = {
  type: typeof SUPPER_ACTIONS.GET_SUPPER_GROUP_STATUS
  supperGroupStatus: SupperGroupStatus
}

type SetSupperGroup = {
  type: typeof SUPPER_ACTIONS.SET_SUPPER_GROUP
  supperGroup: SupperGroup | null
}

type SetOrder = {
  type: typeof SUPPER_ACTIONS.SET_ORDER
  order: Order | null
}

type SetSupperGroupStatus = {
  type: typeof SUPPER_ACTIONS.SET_SUPPER_GROUP_STATUS
  supperGroupStatus: SupperGroupStatus
}

type GetRestaurantInfo = {
  type: typeof SUPPER_ACTIONS.GET_RESTAURANT_INFO
  restaurant: Restaurant | null
}

type GetAllRestaurantsInfo = {
  type: typeof SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO
  allRestaurants: Restaurant[]
}

type GetUserInfo = {
  type: typeof SUPPER_ACTIONS.GET_USER_INFO
  user: User | null
}

type GetAllUserInfo = {
  type: typeof SUPPER_ACTIONS.GET_ALL_USERS
  allUsers: User[]
}

type GetFoodByFoodId = {
  type: typeof SUPPER_ACTIONS.GET_FOOD_BY_FOOD_ID
  food: Food
}

type SetFoodByFoodId = {
  type: typeof SUPPER_ACTIONS.SET_FOOD_BY_FOOD_ID
  food: Food
}

export type ActionTypes =
  | SetIsLoading
  | GetRestaurantInfo
  | GetAllRestaurantsInfo
  | GetUserInfo
  | GetAllUserInfo
  | GetOrder
  | GetAllOrders
  | GetCollatedOrder
  | GetSupperGroup
  | GetSupperGroupStatus
  | SetSupperGroup
  | SetOrder
  | SetSupperGroupStatus
  | GetFoodByFoodId
  | SetFoodByFoodId
