import { SplitACMethod, SupperGroup, SupperGroupStatus } from '../store/supper/types'

/**
 *
 * @param userOrderTotalPrice user's total order price (excluding delivery fee)
 * @param supperGroup
 * @returns calculated delivery fee for selected individual
 */
export const getIndivDeliveryFee = (userOrderTotalPrice: number, supperGroup: SupperGroup | null | undefined) => {
  let indivDeliveryFee = 0
  if (supperGroup) {
    const splitMethod = supperGroup?.splitAdditionalCost
    const deliveryFee = supperGroup?.additionalCost ?? 0
    const supperGroupStatus = supperGroup?.status
    let numberOfOrders = supperGroup?.numOrders ?? 1
    const currentGroupTotalPrice = supperGroup?.currentFoodCost ?? 1

    if (splitMethod === SplitACMethod.EQUAL) {
      // Remove users with no price from calculation of indiv delivery fee
      if (supperGroupStatus === SupperGroupStatus.ARRIVED || supperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT) {
        numberOfOrders = supperGroup?.orderList?.filter((order) => order.totalCost !== 0).length ?? 1
        if (userOrderTotalPrice === 0) return 0 // return 0 for users with $0 order cost
      }
      indivDeliveryFee = deliveryFee / numberOfOrders
    } else if (splitMethod === SplitACMethod.PROPORTIONAL) {
      const indivPercentage = (userOrderTotalPrice ?? 0) / currentGroupTotalPrice
      indivDeliveryFee = indivPercentage * deliveryFee
    }
  }
  return indivDeliveryFee
}
