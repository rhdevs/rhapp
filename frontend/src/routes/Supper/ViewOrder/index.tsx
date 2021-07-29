import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

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
import { getViewOrderPageDetails } from '../../../store/supper/action/level2'
import { PATHS } from '../../Routes'

const MainContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: '.' '.' '.';
  width: 100vw;
  height: 100vh;
  background-color: ${V1_BACKGROUND};
`

const ViewOrder = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { isLoading, supperGroup, collatedOrder, selectedSupperGroupStatus, order, supperErrorMessage } = useSelector(
    (state: RootState) => state.supper,
  )
  const isOwner = supperGroup?.ownerId === localStorage.userID

  useEffect(() => {
    if (supperGroup?.status === SupperGroupStatus.CLOSED && isOwner) {
      history.replace(`${PATHS.SUPPER_HOME}`)
      history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)
    }
  }, [supperGroup?.status])

  useEffect(() => {
    dispatch(getViewOrderPageDetails(params.supperGroupId))
  }, [dispatch, params.supperGroupId, supperGroup?.status])

  return (
    <PullToRefresh style={{ height: '100vh' }} onRefresh={onRefresh}>
      <MainContainer>
        <TopNavBar title="View Order" />
        {supperErrorMessage === 'Could not get view order page details! Please try again later.' ? (
          <SupperErrorContent />
        ) : isLoading ? (
          <LoadingSpin />
        ) : (
          <div>
            {supperGroup?.ownerId === localStorage.userID ? (
              <OwnerView
                supperGroupIsOpen={selectedSupperGroupStatus === SupperGroupStatus.OPEN}
                supperGroup={supperGroup}
                collatedOrder={collatedOrder}
                supperGroupIsOrdered={selectedSupperGroupStatus === SupperGroupStatus.ORDERED}
                supperGroupIsCancelled={selectedSupperGroupStatus === SupperGroupStatus.CANCELLED}
                showTrackPayment={
                  selectedSupperGroupStatus === SupperGroupStatus.ARRIVED ||
                  selectedSupperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT
                }
              />
            ) : (
              <UserView
                supperGroupIsOpen={selectedSupperGroupStatus === SupperGroupStatus.OPEN}
                supperGroup={supperGroup}
                supperGroupIsCancelled={selectedSupperGroupStatus === SupperGroupStatus.CANCELLED}
                order={order}
              />
            )}
          </div>
        )}
        <BottomNavBar />
      </MainContainer>
    </PullToRefresh>
  )
}

export default ViewOrder
