import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { LeaveGroupModal } from '../../../components/Supper/Modals/LeaveGroupModal'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { updateOrderDetails } from '../../../store/supper/action'
import { Order, SupperGroup } from '../../../store/supper/types'
import { PATHS } from '../../Routes'
import { OrderContainer } from './OwnerView'

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

const UserView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const [hasPaid, setHasPaid] = useState<boolean>(props.order?.hasPaid ?? false)
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)
  const [leaveGroupModalIsOpen, setLeaveGroupModalIsOpen] = useState<boolean>(false)

  const showBottomSection = () => {
    if (props.supperGroupIsOpen) {
      return (
        <>
          {props.order?.foodList && props.order.foodList.length > 0 && (
            <>
              <SupperButton
                ghost
                descriptionStyle={{ width: '100%' }}
                buttonWidth="200px"
                defaultButtonDescription="Delete Order"
                onButtonClick={() => setDeleteOrderModalIsOpen(true)}
              />
            </>
          )}
          <>
            <SupperButton
              descriptionStyle={{ width: '100%' }}
              buttonWidth="200px"
              defaultButtonDescription="Leave Group"
              onButtonClick={() => setLeaveGroupModalIsOpen(true)}
            />
          </>
        </>
      )
    } else if (props.supperGroupIsCancelled) {
      return (
        <>
          <InformationCard />
          <SupperButton
            descriptionStyle={{ width: '100%' }}
            defaultButtonDescription="Main Page"
            buttonWidth="200px"
            onButtonClick={() => history.push(`${PATHS.SUPPER_HOME}`)}
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
            props.order?.orderId && dispatch(updateOrderDetails(props.order?.orderId, { hasPaid: hasPaid }))
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
          // order={props.order}
          onLeftButtonClick={() => history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)}
          modalSetter={setDeleteOrderModalIsOpen}
        />
      )}
      {leaveGroupModalIsOpen && (
        <LeaveGroupModal
          suppergroupId={params.supperGroupId}
          onLeftButtonClick={() => `${PATHS.JOIN_ORDER}/${params.supperGroupId}`}
          modalSetter={setLeaveGroupModalIsOpen}
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
    </>
  )
}

export default UserView
