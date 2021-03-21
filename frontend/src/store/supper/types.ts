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
  hasRecieved: boolean //1 if orderer received payment (orderer POV)
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
  additionalCost: number //ie GST, delivery fee
  currentFoodCost: number //non inclusive of additionalCost
  costLimit: number
  status: string
  comments: string
  modeOfPayment: string
  closingTime: string
}

export enum SUPPER_ACTIONS {
  SET_IS_LOADING = 'SUPPER_ACTIONS.SET_IS_LIADING',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

export type ActionTypes = SetIsLoading
