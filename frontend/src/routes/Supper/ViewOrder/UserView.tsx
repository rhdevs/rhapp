import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Button from '../../../components/Mobile/Button'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { getReadableSupperGroupId, unixTo12HourTime, updateOrderDetails } from '../../../store/supper/action'
import { Order, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { PATHS } from '../../Routes'

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const BottomMoneyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
  margin: 10px 0;
`

const SummaryText = styled.h3`
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

type Props = {
  supperGroupIsOpen: boolean
  supperGroup: SupperGroup | null
  supperGroupIsCancelled: boolean
  order: Order | null
  deliveryFee: number
  totalFee: number
}

const UserView = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [hasPaid, setHasPaid] = useState<boolean>(props.order?.hasPaid ?? false)

  return (
    <>
      {props.supperGroupIsOpen ? (
        <ExpandableSGCard
          isOwner={props.supperGroup?.ownerId === localStorage.userID}
          supperGroupName={props.supperGroup?.supperGroupName ?? ''}
          supperGroupId={getReadableSupperGroupId(props.supperGroup?.supperGroupId)}
          ownerName={props.supperGroup?.ownerName ?? ''}
          priceLimit={props.supperGroup?.costLimit ?? 50}
          currentAmount={props.supperGroup?.currentFoodCost ?? 10}
          closingTime={unixTo12HourTime(props.supperGroup?.closingTime)}
          numberOfUsers={props.supperGroup?.userIdList?.length ?? 0}
          deliveryFee={String(props.supperGroup?.additionalCost ?? '-')}
        />
      ) : props.supperGroupIsCancelled ? (
        <SGCardWithStatus
          onClick={() => history.push(`${PATHS.EDIT_SUPPER_GROUP}/${props.supperGroup?.supperGroupId}`)}
          supperGroupStatus={SupperGroupStatus.CANCELLED}
          username={props.supperGroup?.ownerName ?? '-'}
          title={props.supperGroup?.supperGroupName ?? '-'}
          orderId={getReadableSupperGroupId(props.supperGroup?.supperGroupId)}
          buttonTeleHandle={props.supperGroup?.ownerTele}
          cancelReason={props.supperGroup?.comments}
        />
      ) : (
        <SGCardWithStatus
          onClick={() => history.push(`${PATHS.EDIT_SUPPER_GROUP}/${props.supperGroup?.supperGroupId}`)}
          restaurantLogo={props.supperGroup?.restaurantLogo}
          isOwner={props.supperGroup?.ownerId === localStorage.userID}
          supperGroupStatus={props.supperGroup?.status}
          location={props.supperGroup?.location}
          collectionTime={unixTo12HourTime(props.supperGroup?.estArrivalTime)}
          username={props.supperGroup?.ownerName ?? '-'}
          title={props.supperGroup?.supperGroupName ?? '-'}
          orderId={getReadableSupperGroupId(props.supperGroup?.supperGroupId)}
          buttonTeleHandle={props.supperGroup?.ownerTele}
          paymentMethod={props.supperGroup?.paymentInfo}
        />
      )}
      {props.supperGroupIsCancelled ? (
        <></>
      ) : (
        <>
          <SummaryContainer>
            <SummaryText>My Order</SummaryText>
            {props.supperGroupIsOpen && <UnderlinedButton fontWeight={200} text="Add Item" color="red" />}
          </SummaryContainer>
          <OrderSummaryCard margin="5px 23px" isEditable={props.supperGroupIsOpen} foodList={props.order?.foodList} />
          {props.supperGroupIsOpen ? (
            <BottomContainer>
              <BottomMoneyContainer>
                <StyledText>
                  <b>Subtotal</b>
                </StyledText>
                <StyledText>${(props.order?.totalCost ?? 0).toFixed(2)}</StyledText>
              </BottomMoneyContainer>
            </BottomContainer>
          ) : (
            <>
              <BottomContainer>
                <BottomMoneyContainer>
                  <StyledText>Subtotal</StyledText>
                  <StyledText>${(props.order?.totalCost ?? 0).toFixed(2)}</StyledText>
                </BottomMoneyContainer>
                <BottomMoneyContainer>
                  <StyledText>Delivery Fee</StyledText>
                  <StyledText>${props.deliveryFee.toFixed(2)}</StyledText>
                </BottomMoneyContainer>
                <BottomMoneyContainer>
                  <StyledText>
                    <b>Total</b>
                  </StyledText>
                  <StyledText>
                    <b>${props.totalFee.toFixed(2)}</b>
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
                    setHasPaid(!hasPaid)
                    dispatch(updateOrderDetails(props.order?.orderId, { hasPaid: hasPaid }))
                  }}
                  isFlipButton
                />
              </ButtonContainer>
            </>
          )}
        </>
      )}
    </>
  )
}

export default UserView
