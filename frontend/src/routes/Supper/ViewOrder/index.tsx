import { FileZipTwoTone, ShareAltOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import TopNavBar from '../../../components/Mobile/TopNavBar'
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
} from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

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

const ViewOrder = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { supperGroup, collatedOrder, selectedSupperGroupStatus } = useSelector((state: RootState) => state.supper)
  const [viewCollatedOrder, setViewCollatedOrder] = useState(false)
  const [closeModalIsOpen, setCloseModalIsOpen] = useState<boolean>(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false)
  let supperGroupIsOpen = selectedSupperGroupStatus !== SupperGroupStatus.OPEN

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getCollatedOrder(params.supperGroupId))
  }, [dispatch])

  useEffect(() => {
    console.log(supperGroup?.status)
    dispatch(setSelectedSupperGroupStatus(supperGroup?.status ?? null))
    supperGroupIsOpen = selectedSupperGroupStatus !== SupperGroupStatus.OPEN
  }, [supperGroup?.status])

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
}

export default ViewOrder
