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

export enum SUPPER_ACTIONS {
  SET_IS_LOADING = 'SUPPER_ACTIONS.SET_IS_LOADING',
  GET_ORDERER_INFO = 'SUPPER_ACTIONS.GET_ORDERER_INFO',
  GET_RESTAURANT_INFO = 'SUPPER_ACTIONS.GET_RESTAURANT_INFO',
  GET_ALL_RESTAURANTS_INFO = 'SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO',
  GET_HOPPER_INFO = 'SUPPER_ACTIONS.GET_HOPPER_INFO',
  GET_ALL_HOPPERS = 'SUPPER_ACTIONS.GET_ALL_HOPPERS',
  GET_SUBORDER = 'SUPPER_ACTIONS.GET_SUBORDER',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type GetOrdererInfo = {
  type: typeof SUPPER_ACTIONS.GET_ORDERER_INFO
  orderer: User
}

type GetRestaurantInfo = {
  type: typeof SUPPER_ACTIONS.GET_RESTAURANT_INFO
  restaurant: Restaurant
}

type GetAllRestaurantsInfo = {
  type: typeof SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO
  allRestaurant: Restaurant[]
}

type GetHopperInfo = {
  type: typeof SUPPER_ACTIONS.GET_HOPPER_INFO
  hopper: User
}

type GetAllHopperInfo = {
  type: typeof SUPPER_ACTIONS.GET_ALL_HOPPERS
  allHopper: User[]
}

type GetSuborder = {
  type: typeof SUPPER_ACTIONS.GET_SUBORDER
  suborder: Suborder
}

export type ActionTypes =
  | SetIsLoading
  | GetOrdererInfo
  | GetRestaurantInfo
  | GetAllRestaurantsInfo
  | GetHopperInfo
  | GetAllHopperInfo
  | GetSuborder
