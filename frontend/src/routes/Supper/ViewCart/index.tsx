import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { getSupperGroupById, getUserOrder, readableSupperGroupId, unixTo12HourTime } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
`

const ButtonContainer = styled.div`
  display: flex;
  width: 80vw;
  justify-content: center;
  margin: 20px auto 5px auto;
`

const MyOrderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin: auto;
  justify-content: space-between;
  width: 80vw;
`

const MyOrderText = styled.h2`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 14px;
`

const SubtotalText = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  justify-content: flex-end;
  display: flex;
  width: 80vw;
  margin: 0 auto;
`

const ViewCart = () => {
  const dispatch = useDispatch()
  const params = useParams<{ supperGroupId: string }>()

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
  }, [])

  const { supperGroup, order, isLoading } = useSelector((state: RootState) => state.supper)

  console.log(supperGroup)
  console.log(order)

  return (
    <MainContainer>
      <TopNavBar title="View Cart" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <ExpandableSGCard
            isOwner={supperGroup?.ownerId === localStorage.userID}
            supperGroupName={supperGroup?.supperGroupName ?? ''}
            supperGroupId={readableSupperGroupId(supperGroup?.supperGroupId)}
            ownerName={supperGroup?.ownerName ?? ''}
            priceLimit={supperGroup?.costLimit ?? 50}
            currentAmount={supperGroup?.currentFoodCost ?? 10}
            closingTime={unixTo12HourTime(supperGroup?.closingTime)}
            numberOfUsers={supperGroup?.userIdList.length ?? 0}
            deliveryFee={String(supperGroup?.additionalCost ?? '-')}
          />
          <>
            <MyOrderContainer>
              <MyOrderText>My Order</MyOrderText>
              <UnderlinedButton text="Add Item" color="red" fontWeight={200} />
            </MyOrderContainer>
            <OrderSummaryCard isEditable foodList={order?.foodList} orderList={supperGroup?.orderList} />
            <SubtotalText>Subtotal: ${order?.totalCost?.toFixed(2) ?? '-'}</SubtotalText>
            <ButtonContainer>
              <Button
                stopPropagation
                defaultButtonDescription="Submit Order"
                onButtonClick={() => console.log('submit order')}
                isFlipButton={false}
              />
            </ButtonContainer>
          </>
        </>
      )}
    </MainContainer>
  )
}

export default ViewCart
