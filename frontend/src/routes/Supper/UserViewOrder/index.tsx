import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { getSupperGroupById, getUserOrder, readableSupperGroupId, unixTo12HourTime } from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 2rem;
`

const OrderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const Header = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  padding-right: 5px;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: 1rem auto;
  align-items: flex-end;
`

const BottomMoneyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
  margin: 10px 0;
`

const StyledText = styled.text`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const ButtonContainer = styled.div`
  display: flex;
  margin: 23px 15px;
  justify-content: space-around;
`

export default function UserViewOrder() {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const { supperGroup, selectedSupperGroupStatus, order } = useSelector((state: RootState) => state.supper)
  const supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
  const supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
  }, [dispatch])

  const deliveryFee =
    supperGroup?.splitAdditionalCost === 'Equal'
      ? (supperGroup?.additionalCost ?? 0) / supperGroup?.numOrders
      : ((supperGroup?.additionalCost ?? 0) / (supperGroup?.totalPrice ?? 1)) * (order?.totalCost ?? 0)

  const totalFee = (order?.totalCost ?? 0) + deliveryFee

  return (
    <MainContainer>
      <TopNavBar title="View Order" />
      {supperGroupIsOpen ? (
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
      ) : supperGroupIsCancelled ? (
        <SGCardWithStatus
          supperGroupStatus={SupperGroupStatus.CANCELLED}
          username={supperGroup?.ownerName ?? '-'}
          title={supperGroup?.supperGroupName ?? '-'}
          orderId={readableSupperGroupId(supperGroup?.supperGroupId)}
          buttonTeleHandle={supperGroup?.ownerTele}
          cancelReason={supperGroup?.comments}
        />
      ) : (
        <SGCardWithStatus
          restaurantLogo={supperGroup?.restaurantLogo}
          isOwner={supperGroup?.ownerId === localStorage.userID}
          supperGroupStatus={supperGroup?.status}
          location={supperGroup?.location}
          collectionTime={unixTo12HourTime(supperGroup?.estArrivalTime)}
          username={supperGroup?.ownerName ?? '-'}
          title={supperGroup?.supperGroupName ?? '-'}
          orderId={readableSupperGroupId(supperGroup?.supperGroupId)}
          buttonTeleHandle={supperGroup?.ownerTele}
          paymentMethod={supperGroup?.paymentInfo}
        />
      )}
      {supperGroupIsCancelled ? (
        <></>
      ) : (
        <>
          <OrderContainer>
            <Header>My Order</Header>
            {supperGroupIsOpen && <UnderlinedButton fontWeight={200} text="Add Item" color="red" />}
          </OrderContainer>
          <OrderSummaryCard margin="5px 23px" isEditable={supperGroupIsOpen} foodList={order?.foodList} />
          {supperGroupIsOpen ? (
            <BottomContainer>
              <BottomMoneyContainer>
                <StyledText>
                  <b>Subtotal</b>
                </StyledText>
                <StyledText>${(order?.totalCost ?? 0).toFixed(2)}</StyledText>
              </BottomMoneyContainer>
            </BottomContainer>
          ) : (
            <>
              <BottomContainer>
                <BottomMoneyContainer>
                  <StyledText>Subtotal</StyledText>
                  <StyledText>${(order?.totalCost ?? 0).toFixed(2)}</StyledText>
                </BottomMoneyContainer>
                <BottomMoneyContainer>
                  <StyledText>Delivery Fee</StyledText>
                  <StyledText>${deliveryFee.toFixed(2)}</StyledText>
                </BottomMoneyContainer>
                <BottomMoneyContainer>
                  <StyledText>
                    <b>Total</b>
                  </StyledText>
                  <StyledText>
                    <b>${totalFee.toFixed(2)}</b>
                  </StyledText>
                </BottomMoneyContainer>
              </BottomContainer>
              <ButtonContainer>
                <Button
                  descriptionStyle={{ width: '100%' }}
                  stopPropagation={true}
                  defaultButtonDescription="Mark Payment Complete"
                  updatedButtonDescription="Payment Completed"
                  buttonWidth="200px"
                  onButtonClick={() => {
                    console.log('success')
                  }}
                  isFlipButton
                />
              </ButtonContainer>
            </>
          )}
        </>
      )}
      <BottomNavBar />
    </MainContainer>
  )
}
