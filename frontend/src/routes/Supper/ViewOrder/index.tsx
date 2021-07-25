import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import PullToRefresh from 'pull-to-refresh-react'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import OwnerView from './OwnerView'
import UserView from './UserView'
import { V1_BACKGROUND } from '../../../common/colours'
import LoadingSpin from '../../../components/LoadingSpin'
import { SupperErrorContent } from '../../../components/Supper/SupperErrorContent'
import { onRefresh } from '../../../common/reloadPage'
import { setSelectedSupperGroupStatus } from '../../../store/supper/action/setter'
import { getCollatedOrder, getSupperGroupById, getUserOrder } from '../../../store/supper/action/level1/getReqests'

const MainContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: '.' '.' '.';
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
`

const ViewOrder = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const { supperGroup, collatedOrder, selectedSupperGroupStatus, order } = useSelector(
    (state: RootState) => state.supper,
  )
  const [supperGroupNotFound, setSupperGroupNotFound] = useState<boolean>(false)

  let supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
  let supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED
  let supperGroupIsOrdered = selectedSupperGroupStatus === SupperGroupStatus.ORDERED
  let showTrackPayment =
    selectedSupperGroupStatus === SupperGroupStatus.ARRIVED ||
    selectedSupperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  useEffect(() => {
    if (supperGroup) {
      dispatch(setSelectedSupperGroupStatus(supperGroup?.status ?? null))
      if (supperGroup?.ownerId === localStorage.userID) {
        dispatch(getCollatedOrder(params.supperGroupId))
      } else {
        dispatch(getUserOrder(params.supperGroupId))
      }
    }
  }, [supperGroup])

  useEffect(() => {
    if (selectedSupperGroupStatus) {
      supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
      supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED
      supperGroupIsOrdered = selectedSupperGroupStatus === SupperGroupStatus.ORDERED
      showTrackPayment =
        selectedSupperGroupStatus === SupperGroupStatus.ARRIVED ||
        selectedSupperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT
    }
  }, [selectedSupperGroupStatus])

  const deliveryFee =
    supperGroup?.splitAdditionalCost === 'Equal'
      ? (supperGroup?.additionalCost ?? 0) / supperGroup?.numOrders
      : ((supperGroup?.additionalCost ?? 0) / (supperGroup?.totalPrice ?? 1)) * (order?.totalCost ?? 0)

  const totalFee = (order?.totalCost ?? 0) + deliveryFee

  setTimeout(() => {
    //throw error after 5s if suppergroup not found
    if (!selectedSupperGroupStatus) setSupperGroupNotFound(true)
  }, 5000)

  return (
    <MainContainer>
      <TopNavBar title="View Order" />
      <PullToRefresh onRefresh={onRefresh}>
        {!selectedSupperGroupStatus ? (
          supperGroupNotFound ? (
            <SupperErrorContent />
          ) : (
            <LoadingSpin />
          )
        ) : (
          <div>
            {supperGroup?.ownerId === localStorage.userID ? (
              <OwnerView
                supperGroupIsOpen={supperGroupIsOpen}
                supperGroup={supperGroup}
                collatedOrder={collatedOrder}
                supperGroupIsOrdered={supperGroupIsOrdered}
                supperGroupIsCancelled={supperGroupIsCancelled}
                showTrackPayment={showTrackPayment}
              />
            ) : (
              <UserView
                supperGroupIsOpen={supperGroupIsOpen}
                supperGroup={supperGroup}
                supperGroupIsCancelled={supperGroupIsCancelled}
                order={order}
                deliveryFee={deliveryFee}
                totalFee={totalFee}
              />
            )}
          </div>
        )}
      </PullToRefresh>
      <BottomNavBar />
    </MainContainer>
  )
}

export default ViewOrder
