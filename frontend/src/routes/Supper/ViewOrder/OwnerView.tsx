import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { FileZipTwoTone } from '@ant-design/icons'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import {
  deleteSupperGroup,
  getReadableSupperGroupId,
  unixTo12HourTime,
  updateSupperGroup,
} from '../../../store/supper/action'
import { CollatedOrder, Restaurants, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { PATHS } from '../../Routes'
import Button from '../../../components/Mobile/Button'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
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

const TotalPriceText = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  width: 80vw;
  justify-content: flex-end;
  display: flex;
  margin: 15px auto;
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

type Props = {
  supperGroupIsOpen: boolean
  supperGroup: SupperGroup | null
  collatedOrder: CollatedOrder | null
  supperGroupIsCompleted: boolean
  supperGroupIsCancelled: boolean
}

const OwnerView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()

  const [closeModalIsOpen, setCloseModalIsOpen] = useState<boolean>(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false)
  const [viewCollatedOrder, setViewCollatedOrder] = useState(false)

  const onCloseCancelClick = () => {
    setCloseModalIsOpen(false)
  }

  const onCloseConfirmClick = () => {
    // TODO: Check if this works! (currently theres a middleware problem)
    const updatedInfo = { supperGroupStatus: SupperGroupStatus.CLOSED }
    dispatch(updateSupperGroup(params.supperGroupId, updatedInfo))
    history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)
  }

  const onDeleteCancelClick = () => {
    setDeleteModalIsOpen(false)
  }

  const onDeleteConfirmClick = () => {
    dispatch(deleteSupperGroup(params.supperGroupId))
    history.push(`${PATHS.SUPPER_HOME}`)
  }

  return (
    <>
      {closeModalIsOpen && (
        <ConfirmationModal
          title={'Close Order Early?'}
          description="Close supper group if you are ready to order! No new changes can  be made after supper group is closed."
          hasLeftButton={true}
          leftButtonText={'Confirm'}
          onLeftButtonClick={onCloseConfirmClick}
          rightButtonText={'Cancel'}
          onRightButtonClick={onCloseCancelClick}
        />
      )}
      {deleteModalIsOpen && (
        <ConfirmationModal
          title={'Delete Supper Group?'}
          hasLeftButton={true}
          leftButtonText={'Confirm'}
          onLeftButtonClick={onDeleteConfirmClick}
          rightButtonText={'Cancel'}
          onRightButtonClick={onDeleteCancelClick}
        />
      )}
      {props.supperGroupIsOpen ? (
        <JoinOrderSGCard
          editOnClick={() => history.push(`${PATHS.EDIT_SUPPER_GROUP}/${params.supperGroupId}`)}
          restaurantLogo={props.supperGroup?.restaurantLogo}
          restaurant={props.supperGroup?.restaurantName as Restaurants}
          cardMargin="0 23px"
          isOwner={props.supperGroup?.ownerId === localStorage.userID}
          title={props.supperGroup?.supperGroupName ?? ''}
          orderId={getReadableSupperGroupId(props.supperGroup?.supperGroupId)}
          username={props.supperGroup?.ownerName ?? ''}
          currentAmount={props.supperGroup?.currentFoodCost ?? 0}
          priceLimit={props.supperGroup?.costLimit ?? 50}
          closingTime={unixTo12HourTime(props.supperGroup?.closingTime)}
          numberOfUsers={props.supperGroup?.userIdList?.length ?? 0}
          splitACType={props.supperGroup?.splitAdditionalCost}
          deliveryFee={'$' + String((props.supperGroup?.additionalCost ?? 0).toFixed(2))}
        />
      ) : (
        <SGCardWithStatus
          onClick={() => {
            history.push(`${PATHS.EDIT_SUPPER_GROUP}/${params.supperGroupId}`)
          }}
          restaurant={props.supperGroup?.restaurantName as Restaurants}
          restaurantLogo={props.supperGroup?.restaurantLogo}
          isOwner={props.supperGroup?.ownerId === localStorage.userID}
          isEditable={!(props.supperGroupIsCompleted || props.supperGroupIsCancelled)}
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
      {props.supperGroupIsCompleted ? (
        <Button
          center
          containerPadding="1rem 15px"
          descriptionStyle={{ width: '100%' }}
          stopPropagation={true}
          defaultButtonDescription="Track Payment Progress"
          buttonWidth="fit-content"
          onButtonClick={() => {
            history.push(`${PATHS.VIEW_PAYMENT_SCREEN}/${params.supperGroupId}`)
          }}
          isFlipButton={false}
        />
      ) : (
        <>
          <SummaryContainer>
            <SubContainer>
              <SummaryText>Summary</SummaryText>
              <FileZipTwoTone onClick={() => setViewCollatedOrder(!viewCollatedOrder)} />
            </SubContainer>
            {props.supperGroupIsOpen && (
              <UnderlinedButton
                onClick={() =>
                  history.push(`${PATHS.PLACE_ORDER}/${params.supperGroupId}/${props.supperGroup?.restaurantId}/order`)
                }
                fontWeight={200}
                text="Add Item"
                color="red"
              />
            )}
          </SummaryContainer>
          <OrderSummaryCard
            margin="5px 23px"
            orderByUser
            collatedOrder={viewCollatedOrder ? props.collatedOrder : null}
            isEditable={props.supperGroupIsOpen}
            orderList={props.supperGroup?.orderList}
            onCloseOrderClick={() => setCloseModalIsOpen(true)}
            onDeleteGroupClick={() => setDeleteModalIsOpen(true)}
          />
          {props.supperGroupIsOpen ? (
            <TotalPriceText>Total Price: ${(props.supperGroup?.totalPrice ?? 0).toFixed(2)}</TotalPriceText>
          ) : (
            <BottomContainer>
              <BottomMoneyContainer>
                <StyledText>Total Price</StyledText>
                <StyledText>${(props.supperGroup?.currentFoodCost ?? 0).toFixed(2)}</StyledText>
              </BottomMoneyContainer>
              <BottomMoneyContainer>
                <StyledText>Delivery Fee</StyledText>
                <StyledText>${(props.supperGroup?.additionalCost ?? 0).toFixed(2)}</StyledText>
              </BottomMoneyContainer>
              <BottomMoneyContainer>
                <StyledText>
                  <b>Total</b>
                </StyledText>
                <StyledText>
                  <b>${(props.supperGroup?.totalPrice ?? 0).toFixed(2)}</b>
                </StyledText>
              </BottomMoneyContainer>
            </BottomContainer>
          )}
        </>
      )}
    </>
  )
}

export default OwnerView
