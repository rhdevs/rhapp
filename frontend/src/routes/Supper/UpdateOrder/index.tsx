import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import LoadingSpin from '../../../components/LoadingSpin'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { CloseGroupEarlyModal } from '../../../components/Supper/Modals/CloseGroupEarlyModal'
import { DeleteGroupModal } from '../../../components/Supper/Modals/DeleteGroupModal'
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { getCollatedOrder, getSupperGroupById, getUserOrder } from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { ButtonContainer, UpperRowButtons, UpperRowButtonContainer, LowerRowButton } from '../ViewCart'

const Background = styled.div`
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
  min-height: 100vh;
  height: 100%;
  padding-bottom: 1rem;
`

export default function UpdateOrder() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)
  const [closeGroupModalIsOpen, setCloseGroupModalIsOpen] = useState<boolean>(false)
  const [deleteGroupModalIsOpen, setDeleteGroupModalIsOpen] = useState<boolean>(false)
  const { supperGroup, collatedOrder, order } = useSelector((state: RootState) => state.supper)
  const isOwner = supperGroup?.ownerId ? localStorage.userID === supperGroup.ownerId : undefined
  const isEditable = supperGroup?.status === SupperGroupStatus.OPEN || supperGroup?.status === SupperGroupStatus.PENDING
  const ownerOrderId = supperGroup?.orderList?.find((order) => order.user.userID === localStorage.userID)?.orderId

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
          <UpperRowButtons>
            <UpperRowButtonContainer left>
              <SupperButton
                ghost
                buttonWidth="90%"
                defaultButtonDescription="Delete Order"
                onButtonClick={() => setDeleteOrderModalIsOpen(true)}
              />
              {deleteOrderModalIsOpen && supperGroup?.supperGroupId && (
                <DeleteOrderModal
                  isOwner
                  supperGroupId={supperGroup.supperGroupId}
                  orderId={supperGroup.ownerId}
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
              {closeGroupModalIsOpen && supperGroup?.supperGroupId && (
                <CloseGroupEarlyModal
                  supperGroupId={supperGroup.supperGroupId}
                  modalSetter={setCloseGroupModalIsOpen}
                />
              )}
            </UpperRowButtonContainer>
          </UpperRowButtons>
          <LowerRowButton>
            <SupperButton
              center
              ghost
              buttonWidth="100%"
              defaultButtonDescription="Delete Group"
              onButtonClick={() => setDeleteGroupModalIsOpen(true)}
            />
            {deleteGroupModalIsOpen && supperGroup?.supperGroupId && (
              <DeleteGroupModal suppergroupId={supperGroup.supperGroupId} modalSetter={setDeleteGroupModalIsOpen} />
            )}
          </LowerRowButton>
        </ButtonContainer>
      )
    } else {
      return (
        <ButtonContainer>
          <SupperButton
            center
            defaultButtonDescription="Submit Order"
            onButtonClick={() => {
              if (supperGroup?.phoneNumber) {
                history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
              } else {
                history.push(`${PATHS.CONFIRM_ORDER}/${params.supperGroupId}/confirm`)
              }
            }}
          />
        </ButtonContainer>
      )
    }
  }
  return (
    <Background>
      <TopNavBar title="Update Order" />
      <SupperGroupCard supperGroup={supperGroup} isHome={false} />
      {supperGroup && order && (
        <OrderCard
          supperGroup={supperGroup}
          collatedOrder={collatedOrder}
          ownerId={ownerOrderId}
          supperGroupStatus={supperGroup.status}
          isEditable={isEditable}
          orderId={order.orderId}
          order={order}
        />
      )}
      {showButtons()}
      <InformationCard content="Close supper group if you are ready to order" />
      <BottomNavBar />
    </Background>
  )
}
