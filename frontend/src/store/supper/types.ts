export type User = {
  userId: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  modules: string[]
  contactNumber?: number
}

export type Food = {
  foodId: string
  foodName: string
  price: number
  comments?: string //hopper comments (undefined if in menu)
  quantity?: number //hopper order quantity (undefined if in menu)
}

export type Restaurant = {
  restaurantId: string
  name: string
  menu: Food[]
  closingTime: number
  contactNumber?: number
}

export type Suborder = {
  suborderId: string
  hopperId: string
  orderId: string
  paymentContactNumber?: number
  foodList: Food[]
  totalCost: number
  hasPaid: boolean //1 if hopper paid orderer (hopper POV)
  modeOfPayment: string
  hasReceived: boolean //1 if orderer received payment (orderer POV)
}

export type Order = {
  orderId: string
  orderName: string
  ordererId: string
  ordererName: string
  paymentContactNumber?: number
  restaurantName: string
  hopperIdList: string[]
  orderList: Suborder[]
  additionalCost?: number //ie GST, delivery fee
  splitAdditionalCost: string
  currentFoodCost: number //non inclusive of additionalCost
  costLimit: number
  status: string
  comments: string
  modeOfPayment: string
  closingTime: string
}

export type CollatedOrder = {
  orderId: string
  ordererId: string
  collatedOrderList: Food[]
}

export enum OrderStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ORDERED = 'Ordered',
  ARRIVED = 'Arrived',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum SUPPER_ACTIONS {
  SET_IS_LOADING = 'SUPPER_ACTIONS.SET_IS_LOADING',
  GET_ALL_SUBORDERS = 'SUPPER_ACTION.GET_ALL_SUBORDER',
  GET_COLLATED_ORDER = 'SUPPER_ACTION.GET_COLLATED_ORDER',
  GET_ORDER = 'SUPPER_ACTION.GET_ORDER',
  GET_SUBORDER = 'SUPPER_ACTION.GET_SUBORDER',
  GET_ORDER_STATUS = 'SUPPER_ACTION.GET_ORDER_STATUS',
  SET_ORDER = 'SUPPER_ACTION.SET_ORDER',
  SET_SUBORDER = 'SUPPER_ACTION.SET_SUBORDER',
  SET_ORDER_STATUS = 'SUPPER_ACTION.SET_ORDER_STATUS',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type GetAllSuborders = {
  type: typeof SUPPER_ACTIONS.GET_ALL_SUBORDERS
  allSuborders: Suborder[]
}

type GetCollatedOrder = {
  type: typeof SUPPER_ACTIONS.GET_COLLATED_ORDER
  collatedOrder: CollatedOrder | null
}

type GetOrder = {
  type: typeof SUPPER_ACTIONS.GET_ORDER
  order: Order | null
}

type GetSuborder = {
  type: typeof SUPPER_ACTIONS.GET_SUBORDER
  suborder: Suborder | null
}

type GetOrderStatus = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_STATUS
  orderStatus: OrderStatus
}

type SetOrder = {
  type: typeof SUPPER_ACTIONS.SET_ORDER
  order: Order | null
}

type SetSuborder = {
  type: typeof SUPPER_ACTIONS.SET_SUBORDER
  suborder: Suborder | null
}

type SetOrderStatus = {
  type: typeof SUPPER_ACTIONS.SET_ORDER_STATUS
  orderStatus: OrderStatus
}

export type ActionTypes =
  | SetIsLoading
  | GetAllSuborders
  | GetCollatedOrder
  | GetOrder
  | GetSuborder
  | GetOrderStatus
  | SetOrder
  | SetSuborder
  | SetOrderStatus
