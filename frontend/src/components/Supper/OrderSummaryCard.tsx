import React from 'react'

import styled from 'styled-components'
import { orderList } from '../../store/stubs'
import { Food, Order } from '../../store/supper/types'
import Button from '../Mobile/Button'
import { FoodLineInCard } from './FoodLineInCard'
import { MainCard } from './MainCard'

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 17px;
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

type Props = {
  isEditable?: boolean
  foodList: Food[]
  onCancelOrderClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCloseOrderClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  orderByUser?: boolean
  isOwner?: boolean
  orderList?: Order[]
}

export const OrderSummaryCard = (props: Props) => {
  const bottomButtons = () => {
    return (
      props.isEditable && (
        <ButtonContainer>
          <Button
            stopPropagation={true}
            defaultButtonDescription="Cancel Order"
            defaultButtonColor="transparent"
            defaultTextColor="#de5f4c"
            buttonWidth="fit-content"
            buttonHeight="fit-content"
            onButtonClick={() => {
              props.onCancelOrderClick
            }}
            isFlipButton={false}
            border="2px solid #de5f4c"
          />
          {props.isOwner && (
            <Button
              stopPropagation={true}
              defaultButtonDescription="Close Order"
              buttonWidth="fit-content"
              buttonHeight="34px"
              onButtonClick={() => {
                props.onCloseOrderClick
              }}
              isFlipButton={false}
            />
          )}
        </ButtonContainer>
      )
    )
  }

  const cardContent = () => {
    if (props.orderByUser) {
      if (orderList.length <= 0) {
        return <EmptyCartContainer>Empty Cart</EmptyCartContainer>
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
                  <NameText>
                    {order.user.userID === localStorage.getItem('userID')
                      ? 'You'
                      : `${order.user.displayName} (@${order.user.telegramHandle})`}
                  </NameText>
                  {order.foodList.map((food, index) => {
                    const customisations: string[] = []
                    food.foodMenu.custom?.map((custom) =>
                      custom.options.map((option) => {
                        if (option.isSelected) customisations.push(option.name)
                      }),
                    )
                    return (
                      <FoodLineInCard
                        key={index}
                        foodName={food.foodMenu.foodMenuName}
                        qty={food.quantity}
                        price={food.foodPrice}
                        customisations={customisations}
                        isEditable={props.isEditable}
                        comments={food.comments}
                      />
                    )
                  })}
                  {index + 1 !== props.orderList?.length && <HorizontalLine />}
                </>
              )
            })}
            <br />
            <br />
            {bottomButtons()}
          </MainContainer>
        )
      }
    } else {
      if (props.foodList.length <= 0) {
        return <EmptyCartContainer>Empty Cart</EmptyCartContainer>
      } else {
        return (
          <MainContainer>
            {props.foodList.map((food, index) => {
              const customisations: string[] = []
              food.foodMenu.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              return (
                <FoodLineInCard
                  key={index}
                  foodName={food.foodMenu.foodMenuName}
                  qty={food.quantity}
                  price={food.foodPrice}
                  customisations={customisations}
                  isEditable={props.isEditable}
                  comments={food.comments}
                />
              )
            })}
            <br />
            <br />
            {bottomButtons()}
          </MainContainer>
        )
      }
    }
  }
  return <MainCard minHeight="10rem">{cardContent()}</MainCard>
}
