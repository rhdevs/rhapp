import React from 'react'

import styled from 'styled-components'
import { Food } from '../../store/supper/types'
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
  margin: auto;
  padding-top: 10px;
`

type Props = {
  isEditable: boolean
  foodList: Food[]
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const OrderSummaryCard = (props: Props) => {
  const cardContent = () => {
    if (props.foodList.length > 0) {
      return <EmptyCartContainer>Empty Cart</EmptyCartContainer>
    } else {
      return (
        <MainContainer>
          <FoodLineInCard
            foodName="McGriddles with Egg Meal"
            qty={2}
            price={6.7}
            customisations={['Small Fries', 'Small Coke', 'Small Fries', 'Small Coke']}
          />
          {props.isEditable && (
            <ButtonContainer>
              <Button
                stopPropagation={true}
                defaultButtonDescription="Cancel Order"
                defaultButtonColor="transparent"
                defaultTextColor="#de5f4c"
                buttonWidth="fit-content"
                onButtonClick={() => {
                  props.onClick
                }}
                isFlipButton={false}
                border="1px solid #de5f4c"
              />
            </ButtonContainer>
          )}
        </MainContainer>
      )
    }
  }
  return <MainCard minHeight="10rem">{cardContent()}</MainCard>
}
