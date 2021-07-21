import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'

import LoadingSpin from '../../../components/LoadingSpin'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { CloseGroupEarlyModal } from '../../../components/Supper/Modals/CloseGroupEarlyModal'
import { DeleteGroupModal } from '../../../components/Supper/Modals/DeleteGroupModal'
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { EmptyCartModal } from '../../../components/Supper/Modals/EmptyCartModal'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { getCollatedOrder, getSupperGroupById, getUserOrder } from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  height: 100%;
  background: ${V1_BACKGROUND};
  position: relative;
`

const OrderContainer = styled.div`
  margin: 40px 0 0;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  justify-content: center;
  margin: 30px auto 40px auto;
  padding: 0 10px;
`

export const UpperRowButtons = styled.div`
  display: flex;
  flex-direction: row;
`

export const UpperRowButtonContainer = styled.div<{ left?: boolean | undefined }>`
  width: 50%;
  text-align: ${(props) => (props.left ? 'left' : 'right')};
`

export const LowerRowButton = styled.div`
  margin: 25px 0 0;
`

const ViewCart = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)
  const [closeGroupModalIsOpen, setCloseGroupModalIsOpen] = useState<boolean>(false)
  const [deleteGroupModalIsOpen, setDeleteGroupModalIsOpen] = useState<boolean>(false)
  const [emptyCartModalIsOpen, setEmptyCartModalIsOpen] = useState<boolean>(false)
  const { supperGroup, isLoading, collatedOrder, orderId, order } = useSelector((state: RootState) => state.supper)
  const isOwner = supperGroup?.ownerId ? localStorage.userID === supperGroup.ownerId : undefined
  const isEditable = supperGroup?.status === SupperGroupStatus.OPEN || supperGroup?.status === SupperGroupStatus.PENDING
  const ownerOrderId = supperGroup?.orderList?.find((order) => order.user.userID === supperGroup.ownerId)?.orderId

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    dispatch(getCollatedOrder(params.supperGroupId))
  }, [dispatch])

  const showButtons = () => {
    if (isOwner === undefined) {
      return <LoadingSpin />
    } else if (isOwner) {
      return (
        <ButtonContainer>
          {order && (
            <UpperRowButtons>
              <UpperRowButtonContainer left>
                <SupperButton
                  ghost
                  buttonWidth="90%"
                  defaultButtonDescription="Delete Order"
                  onButtonClick={() => setDeleteOrderModalIsOpen(true)}
                />
                {deleteOrderModalIsOpen && (
                  <DeleteOrderModal
                    isOwner
                    supperGroupId={params.supperGroupId}
                    orderId={ownerOrderId}
                    onLeftButtonClick={() => history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)}
                    modalSetter={setDeleteOrderModalIsOpen}
                  />
                )}
              </UpperRowButtonContainer>
              <UpperRowButtonContainer>
                <SupperButton
                  buttonWidth="90%"
                  defaultButtonDescription="Close Group"
                  onButtonClick={() => setCloseGroupModalIsOpen(true)}
                />
                {closeGroupModalIsOpen && (
                  <CloseGroupEarlyModal
                    supperGroupId={params.supperGroupId}
                    onLeftButtonClick={() => history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)}
                    modalSetter={setCloseGroupModalIsOpen}
                  />
                )}
              </UpperRowButtonContainer>
            </UpperRowButtons>
          )}
          <LowerRowButton>
            <SupperButton
              center
              ghost
              buttonWidth="100%"
              defaultButtonDescription="Delete Group"
              onButtonClick={() => setDeleteGroupModalIsOpen(true)}
            />
            {deleteGroupModalIsOpen && (
              <DeleteGroupModal
                suppergroupId={params.supperGroupId}
                onLeftButtonClick={() => history.push(`${PATHS.SUPPER_HOME}`)}
                modalSetter={setDeleteGroupModalIsOpen}
              />
            )}
          </LowerRowButton>
        </ButtonContainer>
      )
    } else {
      return (
        order?.foodList &&
        order.foodList.length > 0 && (
          <ButtonContainer>
            <UpperRowButtons>
              <UpperRowButtonContainer left>
                <SupperButton
                  ghost
                  buttonWidth="90%"
                  defaultButtonDescription="Empty Cart"
                  onButtonClick={() => setEmptyCartModalIsOpen(true)}
                />
                {emptyCartModalIsOpen && ownerOrderId && (
                  <EmptyCartModal
                    supperGroupId={params.supperGroupId}
                    orderId={ownerOrderId}
                    onLeftButtonClick={() => history.push(`${PATHS.VIEW_CART}/${params.supperGroupId}`)}
                    modalSetter={setEmptyCartModalIsOpen}
                  />
                )}
              </UpperRowButtonContainer>
              <UpperRowButtonContainer>
                <SupperButton
                  center
                  buttonWidth="90%"
                  defaultButtonDescription="Submit Order"
                  onButtonClick={() => {
                    if (order.userContact === 0) {
                      history.push(`${PATHS.CONFIRM_ORDER}/${params.supperGroupId}/confirm`)
                    } else {
                      history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
                    }
                  }}
                />
              </UpperRowButtonContainer>
            </UpperRowButtons>
          </ButtonContainer>
        )
      )
    }
  }

  return (
    <Background>
      <TopNavBar title="View Cart" />
      {isLoading || !(supperGroup && collatedOrder) ? (
        <LoadingSpin />
      ) : (
        <>
          <SupperGroupCard margin="0 23px" supperGroup={supperGroup} isHome={false} />
          <OrderContainer>
            <OrderCard
              supperGroup={supperGroup}
              supperGroupId={supperGroup.supperGroupId}
              collatedOrder={collatedOrder}
              ownerId={supperGroup.ownerId}
              supperGroupStatus={supperGroup.status}
              isEditable={isEditable}
              orderId={orderId}
              order={order}
            />
          </OrderContainer>
          {showButtons()}
        </>
      )}
      <BottomNavBar />
    </Background>
  )
}

export default ViewCart
