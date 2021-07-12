import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import { ShareAltOutlined } from '@ant-design/icons'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import {
  getCollatedOrder,
  getSupperGroupById,
  setSelectedSupperGroupStatus,
  getUserOrder,
} from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import OwnerView from './OwnerView'
import UserView from './UserView'
import { V1_BACKGROUND, V1_RED } from '../../../common/colours'

const MainContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: '.' '.' '.';
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
  padding-bottom: 2rem;
`

const ViewOrder = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const { supperGroup, collatedOrder, selectedSupperGroupStatus, order } = useSelector(
    (state: RootState) => state.supper,
  )

  let supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
  let supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED
  let supperGroupIsCompleted = selectedSupperGroupStatus === SupperGroupStatus.COMPLETED
  let showTrackPayment =
    selectedSupperGroupStatus === SupperGroupStatus.ARRIVED ||
    selectedSupperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    if (supperGroup?.ownerId === localStorage.userID) {
      dispatch(getCollatedOrder(params.supperGroupId))
    } else {
      dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    }
  }, [dispatch, supperGroup?.ownerId])

  useEffect(() => {
    dispatch(setSelectedSupperGroupStatus(supperGroup?.status ?? null))
    supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
    supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED
    supperGroupIsCompleted = selectedSupperGroupStatus === SupperGroupStatus.COMPLETED
    showTrackPayment =
      selectedSupperGroupStatus === SupperGroupStatus.ARRIVED ||
      selectedSupperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT
  }, [supperGroup?.status])

  const deliveryFee =
    supperGroup?.splitAdditionalCost === 'Equal'
      ? (supperGroup?.additionalCost ?? 0) / supperGroup?.numOrders
      : ((supperGroup?.additionalCost ?? 0) / (supperGroup?.totalPrice ?? 1)) * (order?.totalCost ?? 0)

  const totalFee = (order?.totalCost ?? 0) + deliveryFee

  return (
    <MainContainer>
      <TopNavBar
        title="View Order"
        rightComponent={
          supperGroupIsOpen ? <ShareAltOutlined style={{ fontSize: '1.6rem', color: V1_RED }} /> : undefined
        }
      />
      <div>
        {supperGroup?.ownerId === localStorage.userID ? (
          <OwnerView
            supperGroupIsOpen={supperGroupIsOpen}
            supperGroup={supperGroup}
            collatedOrder={collatedOrder}
            supperGroupIsCompleted={supperGroupIsCompleted}
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
      <BottomNavBar />
    </MainContainer>
  )
}

export default ViewOrder
