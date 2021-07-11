import React, { useState } from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import { UnderlinedButton } from '../UnderlinedButton'
import EmptyCart_src from '../../../assets/EmptyCart.svg'
import { CollatedOrder, Food, Order, SplitACMethod, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { PlusCircleFilled } from '@ant-design/icons'
import { V1_RED } from '../../../common/colours'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../../routes/Routes'
import useSnackbar from '../../../hooks/useSnackbar'
import { FoodLine } from '../FoodLine'
import { Tabs } from '../../Tabs'
import { TelegramShareButton } from '../../TelegramShareButton'
import { openUserTelegram } from '../../../common/telegramMethods'
import { ContactModal } from '../ContactModal'

const CardHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 17px;
  font-family: 'Inter';
  padding: 1rem 0;
`

const EmptyCartImg = styled.img`
  height: 61px;
  width: 55px;
`

const EmptyTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  font-size: 12px;
`

const MyOrderText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
`

const NameText = styled.text<{ isOwner?: boolean }>`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => (props.isOwner ? 'black' : 'rgba(0, 0, 0, 0.65)')};
`

const NameContainer = styled.div`
  display: flex;
  align-items: center;
`

const HorizontalLine = styled.hr`
  width: 100%;
  height: 1px;
  background: black;
  border: none;
`

const PriceMainContainer = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: auto;
  grid-row-gap: 5px;
  align-items: center;
  padding-top: 7px;
`

const TotalTitleText = styled.text`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  padding-top: 5px;
`

const TotalPriceText = styled.text`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  justify-self: end;
  padding-top: 5px;
`

const PriceTitleText = styled.text`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
`

const PriceText = styled.text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  justify-self: end;
`

const SubtotalContainer = styled.div`
  padding: 10px 0 8px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const SubtotalText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`

const SubtotalPrice = styled.text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
`

const UpdateTextButton = styled.text`
  padding: 0 7px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 12px;
  text-decoration-line: underline;
  color: ${V1_RED};
`

type Props = {
  supperGroup?: SupperGroup | null
  ownerId: string | undefined
  supperGroupStatus: SupperGroupStatus | undefined
  isEditable?: boolean
  wasEdited?: boolean
  collatedOrder?: CollatedOrder
  order?: Order | null
  foodList?: Food[]
  deliveryCost?: number
  numberOfUsers?: number
  splitCostMethod?: SplitACMethod
  supperTotalCost?: number
  supperGroupId?: number | undefined
  orderId?: string | undefined
  restaurantId?: string | undefined
}

export const OrderCard = (props: Props) => {
  const history = useHistory()
  const [isCancelActionModalOpen, setIsCancelActionModalOpen] = useState<boolean>(false)
  const [isEditedModalOpen, setIsEditedModalOpen] = useState<boolean>(false)
  const [isUpdateDeliveryModalOpen, setIsUpdateDeliveryModalOpen] = useState<boolean>(false)

  const orderList = props.supperGroup?.orderList
  const foodList = props.order?.foodList ?? props.foodList
  const collatedFoodList = props.collatedOrder?.collatedOrderList
  const isFoodListEmpty = ((foodList?.length ?? 0) <= 0) as boolean
  const isCollatedFoodListEmpty = ((collatedFoodList?.length ?? 0) <= 0) as boolean
  const wasEdited = props.wasEdited ?? false
  const supperGroupId = props.supperGroup?.supperGroupId ?? props.order?.supperGroupId ?? props.supperGroupId
  const orderId = props.order?.orderId ?? props.orderId
  const isOwner = localStorage.userID === (props.supperGroup?.ownerId ?? props.ownerId)
  const supperGroupStatus = props.supperGroup?.status ?? props.supperGroupStatus
  const supperGroupIsOpenOrPending =
    supperGroupStatus === SupperGroupStatus.OPEN || supperGroupStatus === SupperGroupStatus.PENDING
  const canEditUserFood = isOwner && !supperGroupIsOpenOrPending
  const isEditable = props.isEditable ?? (!isOwner && supperGroupIsOpenOrPending)
  const restaurantId = props.supperGroup?.restaurantId ?? props.restaurantId
  let subTotal
  let deliveryFee
  let total
  if (props.supperGroup && isOwner) {
    subTotal = props.supperGroup?.currentFoodCost ?? 0
    console.log('suppergroup in card', props.supperGroup.additionalCost)
    deliveryFee = props.supperGroup?.additionalCost ?? 0
    total = props.supperGroup?.totalPrice ?? 0
  } else {
    const numberOfUsers = props.numberOfUsers ?? 1
    const isEqualMethod = props.splitCostMethod === SplitACMethod.EQUAL
    subTotal = props.order?.totalCost ?? 0
    const totalSupper = props.supperTotalCost ?? 0
    deliveryFee =
      (isEqualMethod
        ? (props.supperGroup?.additionalCost ?? 0) / numberOfUsers
        : totalSupper === 0 //to prevent infinity
        ? (subTotal / totalSupper) * (props.supperGroup?.additionalCost ?? 0)
        : 0) ?? 0
    total = subTotal + deliveryFee
  }

  subTotal = `$${subTotal.toFixed(2)}`
  deliveryFee = `$${deliveryFee.toFixed(2)}`
  total = `$${total.toFixed(2)}`

  //TODO: Add update delivery modal
  const updateDeliveryModal = <></>
  const PriceSection = ({ update }: { update?: boolean }) => {
    return (
      <PriceMainContainer>
        <PriceTitleText>Subtotal</PriceTitleText>
        <PriceText>{subTotal}</PriceText>

        <PriceTitleText>
          Delivery Fee{' '}
          {update && <UpdateTextButton onClick={() => setIsUpdateDeliveryModalOpen(true)}>update</UpdateTextButton>}
        </PriceTitleText>
        <PriceText>{deliveryFee}</PriceText>

        <TotalTitleText>Total</TotalTitleText>
        <TotalPriceText>{total}</TotalPriceText>
      </PriceMainContainer>
    )
  }

  const EmptyCart = () => {
    return (
      <EmptyCartContainer>
        <EmptyCartImg alt="Empty Cart" src={EmptyCart_src} />
      </EmptyCartContainer>
    )
  }

  const OwnerEmptyCartSection = () => {
    return (
      <>
        <EmptyCart />
        <EmptyTextContainer>
          Cart is empty.{' '}
          <UnderlinedButton
            onClick={() => history.push(`${PATHS.PLACE_ORDER}/${supperGroupId}/${restaurantId}/order`)}
            text="Add item"
            fontSize="12px"
            color="red"
          />
        </EmptyTextContainer>
      </>
    )
  }

  //TODO: Add was edited modal
  const wasEditedModal = <></>
  //TODO: Add cancel action modal
  const cancelActionModal = <></>

  const RedPlusButton = () => {
    return (
      <PlusCircleFilled
        onClick={() => history.push(`${PATHS.PLACE_ORDER}/${supperGroupId}/${restaurantId}/order`)}
        style={{ fontSize: '20px', color: V1_RED }}
      />
    )
  }

  const onEditClick = (foodId: string | undefined) => {
    if (!foodId) {
      const [error] = useSnackbar('error')
      error('meowmeow is in a bad mood.. try again later!')
      return
    }
    if (canEditUserFood) {
      //TODO: Add owner edit user's order modal
    } else {
      console.log(supperGroupId, orderId, foodId)
      history.push(`${PATHS.EDIT_FOOD_ITEM}/${supperGroupId}/order/${orderId}/food/${foodId}`)
    }
  }

  const userViewFoodContent = () => (
    <>
      {isFoodListEmpty ? (
        <OwnerEmptyCartSection />
      ) : (
        <>
          {foodList?.map((food, index) => {
            const customisations: string[] = []
            food.custom?.map((custom) =>
              custom.options.map((option) => {
                if (option.isSelected) customisations.push(option.name)
              }),
            )
            return (
              <FoodLine
                key={index}
                margin="5px 0"
                isEditable={isEditable}
                onEditClick={() => onEditClick(food.foodId)}
                wasEdited={wasEdited}
                wasEditedModalSetter={setIsEditedModalOpen}
                isCancelActionClickable={isOwner}
                cancelActionModalSetter={setIsCancelActionModalOpen}
                food={food}
                supperGroupId={supperGroupId}
                orderId={orderId}
              />
            )
          })}
          <PriceSection />
        </>
      )}
    </>
  )

  const collatedFoodContent = () => (
    <>
      {isCollatedFoodListEmpty ? (
        <>
          <EmptyCart />
        </>
      ) : (
        <>
          {collatedFoodList?.map((food, index) => {
            const customisations: string[] = []
            food.custom?.map((custom) =>
              custom.options.map((option) => {
                if (option.isSelected) customisations.push(option.name)
              }),
            )
            return (
              <>
                <FoodLine
                  key={index}
                  margin="5px 0"
                  isEditable={isEditable}
                  onEditClick={() => onEditClick(food.foodId)}
                  wasEdited={wasEdited}
                  wasEditedModalSetter={setIsEditedModalOpen}
                  isCancelActionClickable={isOwner}
                  cancelActionModalSetter={setIsCancelActionModalOpen}
                  cancelActionOnClick={() => {
                    setIsCancelActionModalOpen(true)
                  }}
                  food={food}
                  supperGroupId={supperGroupId}
                  orderId={orderId}
                />
                {isCancelActionModalOpen && (
                  <ContactModal orderList={orderList} food={food} contactModalSetter={setIsCancelActionModalOpen} />
                )}
              </>
            )
          })}
          <PriceSection update={isEditable} />
        </>
      )}
    </>
  )

  const ownerViewFoodContent = () => {
    const ownerFoodIsEditable =
      isOwner && (supperGroupStatus === SupperGroupStatus.OPEN || supperGroupStatus === SupperGroupStatus.PENDING)
    let formattedFoodList = orderList
    console.log(formattedFoodList)

    if (orderList) {
      const ownerOrder = orderList.find((order) => order.user.userID === localStorage.userID)
      if (ownerOrder) {
        formattedFoodList = orderList.filter((order) => {
          console.log(order.user.userID !== localStorage.userID)
          return order.user.userID !== localStorage.userID
        })
        formattedFoodList.unshift(ownerOrder)
        console.log(formattedFoodList)
      }
    }

    return (
      <>
        {formattedFoodList?.map((order) => {
          const isOwnerFood = order.user.userID === localStorage.userID
          const telegramHandle = order.user.telegramHandle
          const isOrderEmpty = ((order.foodList?.length ?? 0) <= 0) as boolean
          const topSection = (
            <CardHeaderContainer>
              <NameContainer>
                {!isOwnerFood && <TelegramShareButton margin="0 5px 0 0" telegramHandle={telegramHandle} />}
                <NameText isOwner={isOwnerFood}>{isOwnerFood ? 'You' : order.user.displayName}</NameText>
              </NameContainer>
              {ownerFoodIsEditable && isOwnerFood && <RedPlusButton />}
            </CardHeaderContainer>
          )
          const isOrderEditable = supperGroupIsOpenOrPending && isOwnerFood
          const orderSubtotal = `$${order.totalCost.toFixed(2)}`
          const EmptyCartContainer = () => {
            if (isOwnerFood) {
              return <OwnerEmptyCartSection />
            } else {
              return <EmptyCart />
            }
          }

          const cancelActionOnClick = () => {
            if (!isOwnerFood) {
              console.log('jdahshfs')
              return openUserTelegram(telegramHandle)
            }
          }
          return (
            <>
              {topSection}
              {isOrderEmpty ? (
                <EmptyCartContainer />
              ) : (
                order.foodList?.map((food, foodIndex) => {
                  const customisations: string[] = []
                  food.custom?.map((custom) =>
                    custom.options.map((option) => {
                      if (option.isSelected) customisations.push(option.name)
                    }),
                  )
                  return (
                    <FoodLine
                      key={foodIndex}
                      margin="5px 0"
                      isEditable={isOrderEditable}
                      onEditClick={() => onEditClick(food.foodId)}
                      wasEdited={wasEdited}
                      wasEditedModalSetter={setIsEditedModalOpen}
                      isCancelActionClickable={isOwner}
                      cancelActionOnClick={cancelActionOnClick}
                      food={food}
                      supperGroupId={supperGroupId}
                      orderId={orderId}
                    />
                  )
                })
              )}
              <SubtotalContainer>
                <SubtotalText>Subtotal</SubtotalText>
                <SubtotalPrice>{orderSubtotal}</SubtotalPrice>
              </SubtotalContainer>
              <HorizontalLine />
            </>
          )
        })}
        <PriceSection update={isEditable} />
      </>
    )
  }

  return (
    <MainCard padding="20px" flexDirection="column">
      <>
        {isEditedModalOpen && wasEditedModal}
        {isCancelActionModalOpen && cancelActionModal}
        {isUpdateDeliveryModalOpen && updateDeliveryModal}
      </>
      {isOwner ? (
        <Tabs valueNamesArr={['User', 'Food']} childrenArr={[ownerViewFoodContent(), collatedFoodContent()]} />
      ) : (
        <>
          <CardHeaderContainer>
            <MyOrderText>My Order</MyOrderText>
            {isEditable && <RedPlusButton />}
          </CardHeaderContainer>
          {userViewFoodContent()}
        </>
      )}
    </MainCard>
  )
}
