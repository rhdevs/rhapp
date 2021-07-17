import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { getCollatedOrder, getSupperGroupById, updateSupperGroup } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND } from '../../../common/colours'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { SupperGroupStatus } from '../../../store/supper/types'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
  display: flex;
  flex-direction: column;
`

const OrderSummary = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { collatedOrder, isLoading, supperGroup } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(getCollatedOrder(params.supperGroupId))
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  const onClick = () => {
    dispatch(updateSupperGroup(params.supperGroupId, { status: SupperGroupStatus.ORDERED }))
    history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
  }

  return (
    <MainContainer>
      <TopNavBar title="Order Summary" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <OrderCard
            margin="0 23px"
            collatedOrder={collatedOrder}
            ownerId={supperGroup?.ownerId}
            supperGroupStatus={supperGroup?.status}
            splitCostMethod={supperGroup?.splitAdditionalCost}
            supperGroup={supperGroup}
            supperTotalCost={supperGroup?.totalPrice}
            isEditable
          />
          <SupperButton
            style={{ margin: '2rem auto 0 auto' }}
            center
            defaultButtonDescription="Order Placed"
            onButtonClick={onClick}
          />
          <InformationCard updateSummary />
        </>
      )}
    </MainContainer>
  )
}

export default OrderSummary
