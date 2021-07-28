import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import PullToRefresh from 'pull-to-refresh-react'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { LeaveGroupModal } from '../../../components/Supper/Modals/LeaveGroupModal'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { Order, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { onRefresh } from '../../../common/reloadPage'
import { EmptyCartModal } from '../../../components/Supper/Modals/EmptyCartModal'

const ButtonContainer = styled.div`
  display: flex;
  margin: 2rem auto 1rem auto;
  justify-content: space-around;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const InformationContainer = styled.div`
  margin: 0 0 25px 0;
`

type Props = {
  supperGroupIsOpen: boolean
  supperGroup: SupperGroup | null
  supperGroupIsCancelled: boolean
  order: Order | null
}

const UserView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const history = useHistory()
  const { isLoading } = useSelector((state: RootState) => state.supper)
  const [emptyCartModalIsOpen, setEmptyCartModalIsOpen] = useState<boolean>(false)
  const [leaveGroupModalIsOpen, setLeaveGroupModalIsOpen] = useState<boolean>(false)

  const showBottomSection = () => {
    if (isLoading) return
    if (props.supperGroupIsOpen) {
      return (
        <>
          {props.order?.foodList && props.order.foodList.length > 0 && (
            <SupperButton
              ghost
              buttonWidth="140px"
              defaultButtonDescription="Empty Cart"
              onButtonClick={() => setEmptyCartModalIsOpen(true)}
            />
          )}
          <SupperButton
            buttonWidth="140px"
            defaultButtonDescription="Leave Group"
            onButtonClick={() => setLeaveGroupModalIsOpen(true)}
          />
        </>
      )
    } else if (props.supperGroupIsCancelled) {
      return (
        <BottomContainer>
          <InformationContainer>
            <InformationCard margin="0 15px 10px" cancelledSupperGroup />
          </InformationContainer>
          <SupperButton
            center
            defaultButtonDescription="Main Page"
            buttonWidth="200px"
            onButtonClick={() => history.push(`${PATHS.SUPPER_HOME}`)}
          />
        </BottomContainer>
      )
    } else if (
      props.supperGroup?.status === SupperGroupStatus.ARRIVED ||
      props.supperGroup?.status === SupperGroupStatus.AWAITING_PAYMENT
    ) {
      if (props.order?.hasPaid) {
        return <SupperButton ghost defaultButtonDescription="Payment Completed" />
      } else {
        return (
          <SupperButton
            defaultButtonDescription="Mark Payment Complete"
            onButtonClick={() => history.push(`${PATHS.USER_PAYMENT}/${props.order?.orderId}`)}
          />
        )
      }
    }
  }

  return (
    <>
      <PullToRefresh onRefresh={onRefresh}>
        {emptyCartModalIsOpen && (
          <EmptyCartModal
            modalSetter={setEmptyCartModalIsOpen}
            onLeftButtonClick={() => history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)}
            supperGroupId={params.supperGroupId}
            orderId={props.order?.orderId}
          />
        )}
        {leaveGroupModalIsOpen && (
          <LeaveGroupModal
            suppergroupId={params.supperGroupId}
            onLeftButtonClick={() => {
              if ((props.supperGroup?.userIdList ?? []).includes(localStorage.userID)) {
                history.push(`${PATHS.SUPPER_HOME}`)
              } else {
                history.push(`${PATHS.JOIN_GROUP}/${params.supperGroupId}`)
              }
            }}
            modalSetter={setLeaveGroupModalIsOpen}
          />
        )}
        <SupperGroupCard margin="0 23px 23px" supperGroup={props.supperGroup} isHome={false} />
        <OrderCard
          order={props.order}
          supperGroup={props.supperGroup}
          ownerId={props.supperGroup?.ownerId}
          supperGroupStatus={props.supperGroup?.status}
          isEditable={props.supperGroupIsOpen}
          foodList={props.order?.foodList}
        />
        <ButtonContainer>{showBottomSection()}</ButtonContainer>
      </PullToRefresh>
    </>
  )
}

export default UserView
