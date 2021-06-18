import React from 'react'

import styled from 'styled-components'
import { CollatedOrder, Food, Order } from '../../../store/supper/types'
import Button from '../../Mobile/Button'
import { FoodLineInCard } from '../FoodLineInCard'
import { MainCard } from '../MainCard'
import EmptyCart_src from '../../../assets/EmptyCart.svg'
import { OpenUserTelegram } from '../../TelegramShareButton'
import { useDispatch } from 'react-redux'
import { setFoodId } from '../../../store/supper/action'

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 17px;
  font-family: 'Inter';
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ButtonContainer = styled.div`
  position: absolute;
  margin: auto;
  padding-top: 10px;
  display: flex;
  justify-content: space-evenly;
  bottom: 1rem;
  width: 90%;
`

const NameText = styled.text`
  font-weight: 500;
  font-size: 17px;
  color: rgba(0, 0, 0, 0.47);
  padding: 0 10px;
`

const HorizontalLine = styled.hr`
  width: 100%;
  height: 1px;
  background: black;
  border: none;
`

const EmptyCartImg = styled.img`
  height: 61px;
  width: 55px;
`

type Props = {
  isEditable?: boolean
  foodList?: Food[] | undefined
  onDeleteGroupClick?: (arg0: boolean) => void
  onCloseOrderClick?: (arg0: boolean) => void
  onDeleteClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>, food?: Food) => void
  orderByUser?: boolean
  orderList?: Order[] | undefined
  margin?: string
  collatedOrder?: CollatedOrder | null
  ownerId?: string | undefined
}

export const OrderSummaryCard = (props: Props) => {
  const dispatch = useDispatch()

  const EmptyCart = () => {
    return (
      <EmptyCartContainer>
        <EmptyCartImg alt="Empty Cart" src={EmptyCart_src} />
      </EmptyCartContainer>
    )
  }

  const onEditClick = (e, food: Food) => {
    if (props.onEditClick) {
      console.log(food)
      dispatch(setFoodId(food.foodId))
      return props.onEditClick(e, food)
    }
  }

  const onDeleteClick = (e, foodId) => {
    if (props.onDeleteClick) {
      dispatch(setFoodId(foodId))
      return props.onDeleteClick(e)
    }
  }

  const bottomButtons = () => {
    return (
      props.isEditable && (
        <>
          <br />
          <br />
          <ButtonContainer>
            <Button
              descriptionStyle={{ width: '100%', whiteSpace: 'normal' }}
              stopPropagation={true}
              defaultButtonDescription={
                props.orderByUser || props.collatedOrder !== undefined || props.ownerId === localStorage.userID
                  ? 'Delete Group'
                  : 'Cancel Order'
              }
              defaultButtonColor="transparent"
              defaultTextColor="#de5f4c"
              buttonWidth="120px"
              onButtonClick={props.onDeleteGroupClick}
              isFlipButton={false}
              border="2px solid #de5f4c"
            />
            {(props.orderByUser || props.collatedOrder !== undefined || props.ownerId === localStorage.userID) && (
              <Button
                descriptionStyle={{ width: '100%', whiteSpace: 'normal' }}
                stopPropagation={true}
                defaultButtonDescription="Close Order"
                buttonWidth="120px"
                onButtonClick={props.onCloseOrderClick}
                isFlipButton={false}
              />
            )}
          </ButtonContainer>
        </>
      )
    )
  }

  const cardContent = () => {
    if (props.collatedOrder || props.collatedOrder === null) {
      const collatedOrderList = props.collatedOrder?.collatedOrderList ?? []
      return (
        <>
          {collatedOrderList.length <= 0 || collatedOrderList === null ? (
            <EmptyCart /> //<EmptyCartContainer>No Orders</EmptyCartContainer>
          ) : (
            collatedOrderList.map((food, index) => {
              const customisations: string[] = []
              food.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              return (
                <FoodLineInCard
                  key={index}
                  foodName={food.foodName}
                  qty={food.quantity}
                  price={food.foodPrice}
                  customisations={customisations}
                  comments={food?.comments}
                  cancelAction={food.cancelAction}
                />
              )
            })
          )}
        </>
      )
    } else if (props.orderByUser) {
      if (
        (props.orderList?.length ?? 0) <= 0 ||
        props.orderList?.filter((order) => order.foodList.length).length === 0
      ) {
        return <EmptyCart />
      } else {
        let orderList = props.orderList
        if (orderList) {
          const ownerOrder = orderList.find((order) => order.user.userID === localStorage.userID)
          if (ownerOrder) {
            orderList = orderList.filter((order) => order.user.userID !== localStorage.userID)
            orderList.unshift(ownerOrder)
          }
        }
        return (
          <>
            {orderList?.map((order, index) => {
              return (
                <>
                  <NameText key={index}>
                    {order.user.userID === localStorage.getItem('userID') ? (
                      order.foodList.length ? (
                        'You'
                      ) : (
                        <></>
                      )
                    ) : (
                      <>
                        {order.user.displayName} (@
                        <text onClick={() => OpenUserTelegram(order.user.telegramHandle)}>
                          {order.user.telegramHandle}
                        </text>
                        )
                      </>
                    )}
                  </NameText>
                  {order.foodList.map((food, index) => {
                    const customisations: string[] = []
                    food.custom?.map((custom) =>
                      custom.options.map((option) => {
                        if (option.isSelected) customisations.push(option.name)
                      }),
                    )
                    return (
                      <FoodLineInCard
                        key={index}
                        foodName={food.foodName}
                        qty={food.quantity}
                        price={food.foodPrice}
                        customisations={customisations}
                        isEditable={props.isEditable}
                        comments={food.comments}
                        foodUserId={order.user.userID}
                        onEditClick={(e) => onEditClick(e, food)}
                        onDeleteClick={(e) => onDeleteClick(e, food.foodId)}
                        cancelAction={food.cancelAction}
                      />
                    )
                  })}
                  {index + 1 !== props.orderList?.length && <HorizontalLine />}
                </>
              )
            })}
          </>
        )
      }
    } else {
      if ((props.foodList?.length ?? 0) <= 0) {
        return <EmptyCart />
      } else {
        return (
          <>
            {props.foodList?.map((food, index) => {
              const customisations: string[] = []
              food.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              return (
                <FoodLineInCard
                  key={index}
                  foodName={food.foodName}
                  qty={food.quantity}
                  price={food.foodPrice}
                  customisations={customisations}
                  isEditable={props.isEditable}
                  comments={food.comments}
                  onEditClick={(e) => onEditClick(e, food)}
                  onDeleteClick={(e) => onDeleteClick(e, food.foodId)}
                  cancelAction={food.cancelAction}
                />
              )
            })}
          </>
        )
      }
    }
  }
  return (
    <MainCard margin={props.margin}>
      <MainContainer>
        {cardContent()}
        {bottomButtons()}
      </MainContainer>
    </MainCard>
  )
}
