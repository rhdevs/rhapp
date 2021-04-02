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

type Props = {
  isEditable: boolean
  foodList: Food[]
}

export const OrderSummaryCard = (props: Props) => {
  const cardContent = () => {
    if (props.foodList.length > 0) {
      return <EmptyCartContainer>Empty Cart</EmptyCartContainer>
    } else {
      return (
        <>
          <FoodLineInCard />
          {props.isEditable && (
            <Button
              stopPropagation={true}
              defaultButtonDescription="Cancel Order"
              defaultButtonColor="transparent"
              defaultTextColor="#de5f4c"
              //   buttonWidth?: string
              //   buttonHeight?: string
              //   onButtonClick?: (arg0: boolean) => void
              isFlipButton={false}
            />
          )}
        </>
      )
    }
  }
  return <MainCard minHeight="10rem">{cardContent()}</MainCard>
}
