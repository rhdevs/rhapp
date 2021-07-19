import React, { useState } from 'react'
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
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { InformationCard } from '../../../components/Supper/InformationCard'

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
  margin: 0 auto 40px auto;
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
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)
  const [closeModalIsOpen, setCloseModalIsOpen] = useState<boolean>(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false)
  const [endGroupModalIsOpen, setEndGroupModalIsOpen] = useState<boolean>(false)
  const orderList = props.supperGroup?.orderList
  const ownerOrder = orderList?.find((order) => order.user.userID === props.supperGroup?.ownerId)
  const ownerOrderId = ownerOrder?.orderId

  console.log(props.supperGroup)
  console.log(props.collatedOrder)

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
                      defaultButtonDescription="Delete Order"
                      onButtonClick={() => setDeleteOrderModalIsOpen(true)}
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
      {deleteOrderModalIsOpen && ownerOrder && (
        <DeleteOrderModal
          isOwner
          supperGroupId={params.supperGroupId}
          orderId={ownerOrderId}
          order={ownerOrder}
          onLeftButtonClick={() => history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)}
          modalSetter={setDeleteOrderModalIsOpen}
        />
      )}
      {closeModalIsOpen && (
        <CloseGroupEarlyModal
          modalSetter={setCloseModalIsOpen}
          onLeftButtonClick={() => history.push(`${PATHS.ORDER_SUMMARY}/${params.supperGroupId}`)}
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
      {/* {props.supperGroupIsOrdered && <SupperGroupCard margin="0 23px" supperGroup={props.supperGroup} isHome={false} />} */}
      {/* {props.supperGroupIsOpen ? (
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
      )} */}
      {/* {props.supperGroupIsCompleted ? (
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
        <> */}
      <OrderContainer>
        <OrderCard
          //margin="0px 23px"
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
    //)}
    //</>
  )
}

export default OwnerView
