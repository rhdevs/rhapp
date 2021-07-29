import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import PullToRefresh from 'pull-to-refresh-react'
import { CollatedOrder, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { PATHS } from '../../Routes'
import { CloseGroupEarlyModal } from '../../../components/Supper/Modals/CloseGroupEarlyModal'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { EndSupperGroupModal } from '../../../components/Supper/Modals/EndSupperGroupModal'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { EmptyCartModal } from '../../../components/Supper/Modals/EmptyCartModal'
import { onRefresh } from '../../../common/reloadPage'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'
import { TwoStepCancelGroupModal } from '../../../components/Supper/Modals/TwoStepCancelGroupModal'

const SupperButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 20px;
  padding: 0 10px;
`

const UpperRowButtons = styled.div`
  display: flex;
  flex-direction: row;
`

const UpperRowButtonContainer = styled.div<{ left?: boolean | undefined }>`
  width: 50%;
  text-align: ${(props) => (props.left ? 'left' : 'right')};
`

const LowerRowButton = styled.div`
  margin: 25px 0 0;
`

type Props = {
  supperGroup: SupperGroup | null
  collatedOrder: CollatedOrder | null
  showTrackPayment: boolean
}

const OwnerView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const history = useHistory()
  const { isLoading, supperGroup } = useSelector((state: RootState) => state.supper)

  const [emptyCartModalIsOpen, setEmptyCartModalIsOpen] = useState<boolean>(false)
  const [closeModalIsOpen, setCloseModalIsOpen] = useState<boolean>(false)
  const [cancelGroupModalIsOpen, setCancelGroupModalIsOpen] = useState<boolean>(false)
  const [endGroupModalIsOpen, setEndGroupModalIsOpen] = useState<boolean>(false)
  const orderList = props.supperGroup?.orderList
  const ownerOrder = orderList?.find((order) => order.user.userID === localStorage.userID)
  const ownerOrderId = ownerOrder?.orderId

  const showBottomSection = () => {
    if (supperGroup?.status === SupperGroupStatus.OPEN || supperGroup?.status === SupperGroupStatus.PENDING) {
      return (
        <>
          <ButtonContainer>
            {orderList !== undefined &&
              (orderList.length > 0 || (orderList?.length === 1 && orderList[0].foodList.length > 1)) && (
                <UpperRowButtons>
                  <UpperRowButtonContainer left>
                    <SupperButton
                      ghost
                      buttonWidth="90%"
                      defaultButtonDescription="Empty Cart"
                      onButtonClick={() => setEmptyCartModalIsOpen(true)}
                    />
                  </UpperRowButtonContainer>
                  <UpperRowButtonContainer>
                    <SupperButton
                      buttonWidth="90%"
                      defaultButtonDescription="Close Group"
                      onButtonClick={() => setCloseModalIsOpen(true)}
                    />
                  </UpperRowButtonContainer>
                </UpperRowButtons>
              )}
            <LowerRowButton>
              <SupperButton
                center
                ghost
                buttonWidth="100%"
                defaultButtonDescription="Cancel Group"
                onButtonClick={() => setCancelGroupModalIsOpen(true)}
              />
            </LowerRowButton>
          </ButtonContainer>
          {orderList !== undefined && orderList.length > 0 && <InformationCard closeSupperGroup />}
        </>
      )
    }
  }

  return (
    <>
      {emptyCartModalIsOpen && ownerOrderId && (
        <EmptyCartModal
          supperGroupId={params.supperGroupId}
          orderId={ownerOrderId}
          onLeftButtonClick={() => {
            history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
          }}
          modalSetter={setEmptyCartModalIsOpen}
        />
      )}
      {closeModalIsOpen && (
        <CloseGroupEarlyModal
          modalSetter={setCloseModalIsOpen}
          onLeftButtonClick={() => {
            history.replace(PATHS.SUPPER_HOME)
            history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)
          }}
          supperGroupId={params.supperGroupId}
        />
      )}
      {cancelGroupModalIsOpen && (
        <TwoStepCancelGroupModal
          modalSetter={setCancelGroupModalIsOpen}
          supperGroupId={params.supperGroupId}
          onLeftButtonClick={() => {
            history.replace(PATHS.SUPPER_HOME)
            history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
          }}
        />
      )}
      {endGroupModalIsOpen && (
        <EndSupperGroupModal
          modalSetter={setEndGroupModalIsOpen}
          onLeftButtonClick={() => history.push(PATHS.SUPPER_HOME)}
          suppergroupId={props.supperGroup?.supperGroupId}
        />
      )}
      <PullToRefresh onRefresh={onRefresh}>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            <SupperGroupCard margin="0 23px" supperGroup={props.supperGroup} isHome={false} />
            <OrderCard
              supperGroup={props.supperGroup}
              ownerId={localStorage.userID}
              supperGroupStatus={props.supperGroup?.status}
              collatedOrder={props.collatedOrder}
              order={ownerOrder}
            />
            {showBottomSection()}
            {props.showTrackPayment && !isLoading && (
              <SupperButtonContainer>
                <SupperButton
                  onButtonClick={() => setEndGroupModalIsOpen(true)}
                  defaultButtonDescription="End Supper Group"
                />
              </SupperButtonContainer>
            )}
            {supperGroup?.status === SupperGroupStatus.CANCELLED && (
              <SupperButtonContainer>
                <SupperButton
                  onButtonClick={() => history.push(PATHS.SUPPER_HOME)}
                  defaultButtonDescription="Main Page"
                />
              </SupperButtonContainer>
            )}
          </>
        )}
      </PullToRefresh>
    </>
  )
}

export default OwnerView
