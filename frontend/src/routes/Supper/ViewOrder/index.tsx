import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { FileZipTwoTone, ShareAltOutlined } from '@ant-design/icons'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import {
  deleteSupperGroup,
  getCollatedOrder,
  getSupperGroupById,
  readableSupperGroupId,
  setSelectedSupperGroupStatus,
  unixTo12HourTime,
  updateSupperGroup,
  getUserOrder,
} from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import Button from '../../../components/Mobile/Button'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 2rem;
`

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

const ButtonContainer = styled.div`
  display: flex;
  margin: 23px 15px;
  justify-content: space-around;
`

const ViewOrder = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { supperGroup, collatedOrder, selectedSupperGroupStatus, order } = useSelector(
    (state: RootState) => state.supper,
  )
  const [viewCollatedOrder, setViewCollatedOrder] = useState(false)
  const [closeModalIsOpen, setCloseModalIsOpen] = useState<boolean>(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false)
  let supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
  const supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    if (supperGroup?.ownerId === localStorage.userID) {
      dispatch(getCollatedOrder(params.supperGroupId))
    } else {
      dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    }
  }, [dispatch, supperGroup?.ownerId])

  useEffect(() => {
    console.log(supperGroup?.status)
    dispatch(setSelectedSupperGroupStatus(supperGroup?.status ?? null))
    supperGroupIsOpen = selectedSupperGroupStatus === SupperGroupStatus.OPEN
  }, [supperGroup?.status])

  const deliveryFee =
    supperGroup?.splitAdditionalCost === 'Equal'
      ? (supperGroup?.additionalCost ?? 0) / supperGroup?.numOrders
      : ((supperGroup?.additionalCost ?? 0) / (supperGroup?.totalPrice ?? 1)) * (order?.totalCost ?? 0)

  const totalFee = (order?.totalCost ?? 0) + deliveryFee

  const onCloseCancelClick = () => {
    setCloseModalIsOpen(false)
  }

  const onCloseConfirmClick = () => {
    // TODO: Find endpoint to update suppergroup status
    dispatch(updateSupperGroup(params.supperGroupId, undefined, SupperGroupStatus.CLOSED))
    history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)
  }

  const onDeleteCancelClick = () => {
    setDeleteModalIsOpen(false)
  }

  const onDeleteConfirmClick = () => {
    dispatch(deleteSupperGroup(params.supperGroupId))
    history.push(`${PATHS.SUPPER_HOME}`)
  }

  if (supperGroup?.ownerId === localStorage.userID) {
    return (
      <MainContainer>
        {closeModalIsOpen && (
          <ConfirmationModal
            title={'Close Order Early?'}
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
        <TopNavBar title="View Order" rightComponent={<ShareAltOutlined style={{ fontSize: '20px' }} />} />
        {supperGroupIsOpen ? (
          <JoinOrderSGCard
            editOnClick={() => history.push(`${PATHS.EDIT_ORDER}/${params.supperGroupId}`)}
            restaurantLogo={supperGroup?.restaurantLogo}
            cardMargin="0 23px"
            isOwner={supperGroup?.ownerId === localStorage.userID}
            title={supperGroup?.supperGroupName ?? ''}
            orderId={readableSupperGroupId(supperGroup?.supperGroupId)}
            username={supperGroup?.ownerName ?? ''}
            currentAmount={supperGroup?.currentFoodCost ?? 0}
            priceLimit={supperGroup?.costLimit ?? 50}
            closingTime={unixTo12HourTime(supperGroup?.closingTime)}
            numberOfUsers={supperGroup?.userIdList.length ?? 0}
            splitACType={supperGroup?.splitAdditionalCost}
            deliveryFee={'$' + String((supperGroup?.additionalCost ?? 0).toFixed(2))}
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
        <SummaryContainer>
          <SubContainer>
            <SummaryText>Summary</SummaryText>
            <FileZipTwoTone onClick={() => setViewCollatedOrder(!viewCollatedOrder)} />
          </SubContainer>
          {supperGroupIsOpen && (
            <UnderlinedButton
              onClick={() =>
                history.push(
                  `${PATHS.USER_SUPPER_GROUP_PLACE_ORDER}/${params.supperGroupId}/${supperGroup?.restaurantId}/order`,
                )
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
          collatedOrder={viewCollatedOrder ? collatedOrder : undefined}
          isEditable={supperGroupIsOpen}
          orderList={supperGroup?.orderList}
          onCloseOrderClick={() => setCloseModalIsOpen(true)}
          onDeleteGroupClick={() => setDeleteModalIsOpen(true)}
        />
        {supperGroupIsOpen ? (
          <TotalPriceText>Total Price: ${(supperGroup?.totalPrice ?? 0).toFixed(2)}</TotalPriceText>
        ) : (
          <BottomContainer>
            <BottomMoneyContainer>
              <StyledText>Total Price</StyledText>
              <StyledText>${(supperGroup?.currentFoodCost ?? 0).toFixed(2)}</StyledText>
            </BottomMoneyContainer>
            <BottomMoneyContainer>
              <StyledText>Delivery Fee</StyledText>
              <StyledText>${(supperGroup?.additionalCost ?? 0).toFixed(2)}</StyledText>
            </BottomMoneyContainer>
            <BottomMoneyContainer>
              <StyledText>
                <b>Total</b>
              </StyledText>
              <StyledText>
                <b>${(supperGroup?.totalPrice ?? 0).toFixed(2)}</b>
              </StyledText>
            </BottomMoneyContainer>
          </BottomContainer>
        )}
      </MainContainer>
    )
  } else {
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
            onClick={() => history.push(`${PATHS.EDIT_ORDER}/${supperGroup?.supperGroupId}`)}
            supperGroupStatus={SupperGroupStatus.CANCELLED}
            username={supperGroup?.ownerName ?? '-'}
            title={supperGroup?.supperGroupName ?? '-'}
            orderId={readableSupperGroupId(supperGroup?.supperGroupId)}
            buttonTeleHandle={supperGroup?.ownerTele}
            cancelReason={supperGroup?.comments}
          />
        ) : (
          <SGCardWithStatus
            onClick={() => history.push(`${PATHS.EDIT_ORDER}/${supperGroup?.supperGroupId}`)}
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
            <SummaryContainer>
              <SummaryText>My Order</SummaryText>
              {supperGroupIsOpen && <UnderlinedButton fontWeight={200} text="Add Item" color="red" />}
            </SummaryContainer>
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
}

export default ViewOrder
