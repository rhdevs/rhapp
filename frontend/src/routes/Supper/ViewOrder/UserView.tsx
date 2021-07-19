import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { NotificationBar } from '../../../components/Supper/NotificationBar'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { getReadableSupperGroupId, unixTo12HourTime, updateOrderDetails } from '../../../store/supper/action'
import { Order, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { PATHS } from '../../Routes'
import { UpperRowButtons, UpperRowButtonContainer, LowerRowButton } from '../ViewCart'
import { OrderContainer } from './OwnerView'

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
  margin: 40px 15px;
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

// http://localhost:3000/supper/view/order/4
const UserView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const [hasPaid, setHasPaid] = useState<boolean>(props.order?.hasPaid ?? false)
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)

  const showBottomSection = () => {
    if (props.supperGroupIsOpen) {
      return (
        <UpperRowButtons>
          <UpperRowButtonContainer left>
            <SupperButton
              ghost
              buttonWidth="90%"
              defaultButtonDescription="Delete Order"
              onButtonClick={() => setDeleteOrderModalIsOpen(true)}
            />
          </UpperRowButtonContainer>
          <UpperRowButtonContainer>
            <SupperButton
              buttonWidth="90%"
              defaultButtonDescription="Save Changes"
              onButtonClick={() => {
                'save changes'
              }}
            />
          </UpperRowButtonContainer>
        </UpperRowButtons>
      )
    } else if (props.supperGroupIsCancelled) {
      return (
        <>
          <InformationCard />
          <SupperButton
            descriptionStyle={{ width: '100%' }}
            defaultButtonDescription="Main Page"
            buttonWidth="200px"
            onButtonClick={() => {
              setHasPaid(!hasPaid)
              dispatch(updateOrderDetails(props.order?.orderId, { hasPaid: hasPaid }))
            }}
          />
        </>
      )
    } else {
      return (
        <SupperButton
          descriptionStyle={{ width: '100%' }}
          defaultButtonDescription="Mark Payment Complete"
          updatedButtonDescription="Payment Completed"
          buttonWidth="200px"
          onButtonClick={() => {
            setHasPaid(!hasPaid)
            dispatch(updateOrderDetails(props.order?.orderId, { hasPaid: hasPaid }))
          }}
          isFlipButton
        />
      )
    }
  }
  return (
    <>
      {deleteOrderModalIsOpen && (
        <DeleteOrderModal
          isOwner={false}
          supperGroupId={params.supperGroupId}
          orderId={props.order?.orderId}
          order={props.order}
          onLeftButtonClick={() => history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)}
          modalSetter={setDeleteOrderModalIsOpen}
        />
      )}
      <SupperGroupCard supperGroup={props.supperGroup} isHome={false} />
      <OrderContainer>
        <OrderCard
          supperGroup={props.supperGroup}
          ownerId={props.supperGroup?.ownerId}
          supperGroupStatus={props.supperGroup?.status}
          isEditable={props.supperGroupIsOpen}
          foodList={props.order?.foodList}
        />
      </OrderContainer>
      <ButtonContainer>{showBottomSection()}</ButtonContainer>
      {/* {props.supperGroupIsOpen ? (
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
      )} */}
    </>
  )
}

export default UserView
// function setDeleteOrderModalIsOpen(arg0: boolean): void {
//   throw new Error('Function not implemented.')
// }
