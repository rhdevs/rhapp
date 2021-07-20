import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { CollatedOrder, SupperGroup } from '../../../store/supper/types'
import { PATHS } from '../../Routes'
import { CloseGroupEarlyModal } from '../../../components/Supper/Modals/CloseGroupEarlyModal'
import { DeleteGroupModal } from '../../../components/Supper/Modals/DeleteGroupModal'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { EndSupperGroupModal } from '../../../components/Supper/Modals/EndSupperGroupModal'
import { LowerRowButton, UpperRowButtonContainer, UpperRowButtons } from '../ViewCart'
// import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { EmptyCartModal } from '../../../components/Supper/Modals/EmptyCartModal'
import { onRefresh } from '../../../common/reloadPage'
import { useDispatch, useSelector } from 'react-redux'
import { getSupperGroupById } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'

export const OrderContainer = styled.div`
  margin: 40px 0px 0px 0;
`

export const SupperButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  // width: 80vw;
  justify-content: center;
  margin: 40px 20px;
  padding: 0 10px;
`

type Props = {
  supperGroupIsOpen: boolean
  supperGroup: SupperGroup | null
  collatedOrder: CollatedOrder | null
  supperGroupIsOrdered: boolean
  supperGroupIsCancelled: boolean
  showTrackPayment: boolean
}

const OwnerView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const history = useHistory()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: RootState) => state.supper)

  const [emptyCartModalIsOpen, setEmptyCartModalIsOpen] = useState<boolean>(false)
  const [closeModalIsOpen, setCloseModalIsOpen] = useState<boolean>(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false)
  const [endGroupModalIsOpen, setEndGroupModalIsOpen] = useState<boolean>(false)
  const orderList = props.supperGroup?.orderList
  const ownerOrder = orderList?.find((order) => order.user.userID === localStorage.userID)
  const ownerOrderId = ownerOrder?.orderId

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  const showBottomSection = () => {
    if (props.supperGroupIsOpen) {
      return (
        <>
          <ButtonContainer>
            {console.log(orderList)}
            {orderList != undefined &&
              (orderList.length > 0 || (orderList?.length == 1 && orderList[0].foodList.length > 1)) && (
                <UpperRowButtons>
                  <UpperRowButtonContainer left>
                    <SupperButton
                      ghost
                      buttonWidth="90%"
                      defaultButtonDescription="Empty cart"
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
                defaultButtonDescription="Delete Group"
                onButtonClick={() => setDeleteModalIsOpen(true)}
              />
            </LowerRowButton>
          </ButtonContainer>
          {orderList != undefined && orderList.length > 0 && <InformationCard closeSupperGroup />}
        </>
      )
    }
  }

  return (
    <>
      {emptyCartModalIsOpen && ownerOrderId && (
        <EmptyCartModal
          orderId={ownerOrderId}
          onLeftButtonClick={() => {
            dispatch(getSupperGroupById(params.supperGroupId))
            onRefresh
            isLoading && <LoadingSpin />
            history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
          }}
          modalSetter={setEmptyCartModalIsOpen}
        />
      )}
      {closeModalIsOpen && (
        <CloseGroupEarlyModal
          modalSetter={setCloseModalIsOpen}
          onLeftButtonClick={() => {
            history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)
          }}
          supperGroupId={params.supperGroupId}
        />
      )}
      {deleteModalIsOpen && (
        <DeleteGroupModal
          modalSetter={setDeleteModalIsOpen}
          onLeftButtonClick={() => history.push(`${PATHS.SUPPER_HOME}`)}
          suppergroupId={params.supperGroupId}
        />
      )}
      {endGroupModalIsOpen && (
        <EndSupperGroupModal
          modalSetter={setEndGroupModalIsOpen}
          onLeftButtonClick={() => history.push(`${PATHS.SUPPER_HOME}`)}
          suppergroupId={props.supperGroup?.supperGroupId}
        />
      )}
      <SupperGroupCard margin="0 23px" supperGroup={props.supperGroup} isHome={false} />
      <OrderContainer>
        <OrderCard
          supperGroup={props.supperGroup}
          ownerId={localStorage.userID}
          supperGroupStatus={props.supperGroup?.status}
          collatedOrder={props.collatedOrder}
          // wasEdited?: boolean
          // collatedOrder?: CollatedOrder
          // order?: Order | null
          // foodList?: Food[]
          // deliveryCost?: number
          // numberOfUsers?: number
          // splitCostMethod?: SplitACMethod
          // supperTotalCost?: number
          // supperGroupId?: number | undefined
          // orderId?: string | undefined
          // restaurantId?:
        />
      </OrderContainer>
      {showBottomSection()}
      {props.showTrackPayment && (
        <SupperButtonContainer>
          <SupperButton
            onButtonClick={() => setEndGroupModalIsOpen(true)}
            defaultButtonDescription="End Supper Group"
          />
        </SupperButtonContainer>
      )}
    </>
  )
}

export default OwnerView
