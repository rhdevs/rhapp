import React from 'react'
import styled from 'styled-components'
import { FoodMenu, Order } from '../../store/supper/types'

const MainContainer = styled.div`
  background-color: white;
  margin: 20px 0;
`

const SectionHeaderContainer = styled.div`
  padding: 10px 20px;
`

const SectionHeader = styled.text`
  font-size: 24px;
  font-weight: 700;
`

const SectionBodyContainer = styled.div`
  padding: 16px;
`

const FoodMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const FoodAndQuantityContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
`
const FoodContainer = styled.text`
  margin: 5px 2px 5px 5px;
  font-size: 17px;
  font-weight: 700;
`

const QuantityContainer = styled.text`
  margin: 5px;
  color: #de5f4c;
  font-size: 17px;
  font-weight: 600;
`
const PriceContainer = styled.text`
  margin: 0 0 3px 5px;
  font-size: 14px;
  font-weight: 200;
`
type Props = {
  menu: FoodMenu[]
  order?: Order
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export const MenuSection = (props: Props) => {
  let QUANTITY
  return (
    <MainContainer>
      <SectionHeaderContainer>
        <SectionHeader>Value Meals</SectionHeader>
      </SectionHeaderContainer>
      <SectionBodyContainer>
        <FoodMenuContainer>
          {props.menu.map((foodMenu) => (
            <>
              <FoodAndQuantityContainer
                onClick={() => {
                  // TODO: Add route
                  //history.push(/foodMenu.foodMenuId)
                  console.log('Go to food page!')
                }}
              >
                <FoodContainer>{foodMenu.foodMenuName}</FoodContainer>
                {
                  (QUANTITY = props.order?.foodList?.find((food) => {
                    if (food.foodMenu === foodMenu) {
                      return String(food.quantity)
                    }
                  }))
                }
                <QuantityContainer>{QUANTITY}</QuantityContainer>
              </FoodAndQuantityContainer>
              <PriceContainer>${foodMenu.price.toFixed(2)}</PriceContainer>
            </>
          ))}
        </FoodMenuContainer>
      </SectionBodyContainer>
    </MainContainer>
  )
}
