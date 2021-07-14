import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import {
  getCollatedOrder,
  getReadableSupperGroupId,
  getSupperGroupById,
  updateSupperGroup,
} from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND, V1_RED } from '../../../common/colours'
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

const OrderIdText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 17px;
  line-height: 22px;
  width: 80vw;
  margin: 0 auto;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const ButtonContainer = styled.div<{ left?: boolean | undefined }>`
  width: 50%;
  text-align: ${(props) => (props.left ? 'left' : 'right')};
  margin: 20px;
`

const OrderSummary = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { collatedOrder, isLoading, supperGroup } = useSelector((state: RootState) => state.supper)
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    dispatch(getCollatedOrder(params.supperGroupId))
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  const onClick = () => {
    dispatch(updateSupperGroup(params.supperGroupId, { status: SupperGroupStatus.ORDERED }))
    history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
  }

  const handleUpdateSummary = () => {
    setIsEditable(!isEditable)
  }

  return (
    <MainContainer>
      <TopNavBar title={isEditable ? 'Update Summary' : 'Order Summary'} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <OrderIdText>{getReadableSupperGroupId(collatedOrder?.supperGroupId)}</OrderIdText>
          <OrderCard
            collatedOrder={collatedOrder}
            ownerId={supperGroup?.ownerId}
            supperGroupStatus={supperGroup?.status}
            splitCostMethod={supperGroup?.splitAdditionalCost}
            supperGroup={supperGroup}
            supperTotalCost={supperGroup?.totalPrice}
            isEditable={isEditable}
          />

          <ButtonsContainer>
            <ButtonContainer left>
              <SupperButton
                defaultButtonDescription={isEditable ? 'Save Changes' : 'Update Summary'}
                onButtonClick={handleUpdateSummary}
                defaultButtonColor={V1_BACKGROUND}
                defaultTextColor={V1_RED}
                border={`1px solid ${V1_RED}`}
              />
            </ButtonContainer>
            <ButtonContainer>
              <SupperButton defaultButtonDescription="Order Placed" onButtonClick={onClick} />
            </ButtonContainer>
          </ButtonsContainer>
          <InformationCard updateSummary />
        </>
      )}
    </MainContainer>
  )
}

export default OrderSummary
