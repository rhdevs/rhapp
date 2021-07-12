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

const TotalPriceText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  width: 80vw;
  margin: 10px auto;
  display: flex;
  justify-content: center;
`

const DeliveryFeeContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 83vw;
  margin: 10px auto;
  align-items: baseline;
`

const FinalDeliveryFeeText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  width: 130%;
`

const ButtonContainer = styled.div`
  margin: 20px auto;
  width: 100vw;
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
`

const Input = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 0px 0px 0px 0px;
  height: 35px;
`

const ErrorText = styled.p`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-family: 'Inter';
`

const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
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

          <ButtonContainer>
            <SupperButton
              defaultButtonDescription={isEditable ? 'Save Changes' : 'Update Summary'}
              onButtonClick={handleUpdateSummary}
              defaultButtonColor={V1_BACKGROUND}
              defaultTextColor={V1_RED}
              border={`1px solid ${V1_RED}`}
            />
            <SupperButton defaultButtonDescription="Order Placed" onButtonClick={onClick} />
          </ButtonContainer>
          <InformationCard updateSummary />
        </>
      )}
    </MainContainer>
  )
}

export default OrderSummary
