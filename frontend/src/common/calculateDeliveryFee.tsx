import { SplitACMethod } from '../store/supper/types'

/**
 * numberOfUsers is required for EQUAL split
 * userOrderTotalPrice and currentGroupTotalPrice are required for PROPORTIONAL split
 *
 * @param splitMethod method delivery fee is split (equal or proportional)
 * @param deliveryFee total delivery fee of suppergroup
 * @param numberOfUsers total number of users in suppergroup / used for calculation
 * @param userOrderTotalPrice user's total order price (excluding delivery fee)
 * @param currentGroupTotalPrice group's total price (excluding delivery fee)
 * @returns calculated delivery fee for selected individual
 */
export const getIndivDeliveryFee = (
  splitMethod: SplitACMethod | undefined,
  deliveryFee: number | undefined,
  numberOfUsers?: number,
  userOrderTotalPrice?: number,
  currentGroupTotalPrice?: number,
) => {
  let indivDeliveryFee = 0
  if (splitMethod === SplitACMethod.EQUAL) {
    indivDeliveryFee = (deliveryFee ?? 0) / (numberOfUsers ?? 1)
  } else if (splitMethod === SplitACMethod.PROPORTIONAL) {
    const indivPercentage = (userOrderTotalPrice ?? 0) / (currentGroupTotalPrice ?? 1)
    indivDeliveryFee = indivPercentage * (deliveryFee ?? 0)
  }
  return indivDeliveryFee
}
