import React from 'react'

import styled from 'styled-components'
import { CollatedOrder, Food, Order } from '../../../store/supper/types'
import Button from '../../Mobile/Button'
import { FoodLineInCard } from '../FoodLineInCard'
import { MainCard } from '../MainCard'
import EmptyCart from '../../../assets/EmptyCart.svg'
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
  foodList?: Food[]
  onDeleteGroupClick?: (arg0: boolean) => void
  onCloseOrderClick?: (arg0: boolean) => void
  onDeleteClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  orderByUser?: boolean
  orderList?: Order[]
  margin?: string
  collatedOrder?: CollatedOrder | null
}

export const OrderSummaryCard = (props: Props) => {
  const dispatch = useDispatch()

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
                props.orderByUser || props.collatedOrder !== undefined ? 'Delete Group' : 'Cancel Order'
              }
              defaultButtonColor="transparent"
              defaultTextColor="#de5f4c"
              buttonWidth="120px"
              onButtonClick={props.onDeleteGroupClick}
              isFlipButton={false}
              border="2px solid #de5f4c"
            />
            {(props.orderByUser || props.collatedOrder !== undefined) && (
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
        <MainContainer>
          {collatedOrderList.length <= 0 || collatedOrderList === null ? (
            <EmptyCartContainer>No Orders</EmptyCartContainer>
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
                  isEditable={props.isEditable}
                  comments={food.comments}
                  cancelAction={food.cancelAction}
                />
              )
            })
          )}
          {bottomButtons()}
        </MainContainer>
      )
    } else if (props.orderByUser) {
      if ((props.orderList?.length ?? 0) <= 0) {
        return (
          <MainContainer>
            <EmptyCartContainer>
              <EmptyCartImg alt="Empty Cart" src={EmptyCart} />
            </EmptyCartContainer>
            {bottomButtons()}
          </MainContainer>
        )
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
          <MainContainer>
            {orderList?.map((order, index) => {
              return (
                <>
                  <NameText key={index}>
                    {order.user.userID === localStorage.getItem('userID') ? (
                      'You'
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
                        onDeleteClick={(e) => {
                          dispatch(setFoodId(food.foodId))
                          props.onDeleteClick && props.onDeleteClick(e)
                        }}
                        cancelAction={food.cancelAction}
                      />
                    )
                  })}
                  {index + 1 !== props.orderList?.length && <HorizontalLine />}
                </>
              )
            })}
            {bottomButtons()}
          </MainContainer>
        )
      }
    } else {
      if ((props.foodList?.length ?? 0) <= 0) {
        return (
          <MainContainer>
            <EmptyCartContainer>
              <EmptyCartImg alt="Empty Cart" src={EmptyCart} />
            </EmptyCartContainer>
            {bottomButtons()}
          </MainContainer>
        )
      } else {
        return (
          <MainContainer>
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
                  onDeleteClick={(e) => {
                    dispatch(setFoodId(food.foodId))
                    props.onDeleteClick && props.onDeleteClick(e)
                  }}
                  cancelAction={food.cancelAction}
                />
              )
            })}
            {bottomButtons()}
          </MainContainer>
        )
      }
    }
  }
  return <MainCard margin={props.margin}>{cardContent()}</MainCard>
}
