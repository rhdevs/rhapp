import { LeftOutlined } from '@ant-design/icons'
import React from 'react'

import styled from 'styled-components'
import { foodList } from '../../store/stubs'
import { Food } from '../../store/supper/types'
import Button from '../Mobile/Button'
import { FoodLineInCard } from './FoodLineInCard'

const MainCard = styled.div`
  display: flex;
  background: #fafaf4;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  padding: 5px 10px;
  position: absolute;
  left: 4.27%;
  right: 3.47%;
  top: 18.18%;
  z-index: 1000;
  border-radius: 20px;
  max-width: 300px;
  min-height: 250px;
  box-shadow: 0px 4px 4px 4px rgba(0.1, 0.1, 0.1, 0.1);
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 15px;
`

const HeaderText = styled.text`
  font-weight: 700;
  font-size: 24px;
  line-height: 20px;
  color: #000000;
`

const SubHeaderContainer = styled.div`
  padding: 2px 0px 0px 22px;
`

const SubHeaderText = styled.text`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  color: #000000;
`

const CustomCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 5px;
  margin: 5px 8px 15px 8px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 94%;
  height: 50%;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0px 15px 0px;
`

type Props = {
  foodList: Food[]
  foodId: string | undefined
}

export const ViewMenuFoodCard = (props: Props) => {
  const foodName = foodList.find((food) => food.foodId === props.foodId)?.foodName

  return (
    <MainCard>
      <Header>
        <LeftOutlined style={{ color: 'black', padding: '5px 20px 0 0px' }} />
        <HeaderText>{foodName}</HeaderText>
      </Header>
      <SubHeaderContainer>
        <SubHeaderText>In Your Cart</SubHeaderText>
      </SubHeaderContainer>
      <CustomCard>
        {props.foodList
          .filter((food) => food.foodId === props.foodId)
          .map((food, index) => {
            const customisations: string[] = []
            food.custom?.map((custom) =>
              custom.options.map((option) => {
                if (option.isSelected) customisations.push(option.name)
              }),
            )
            return (
              <FoodLineInCard
                isEditable
                key={index}
                foodName={food.foodName}
                fontPercentage={0.85}
                qty={food.quantity}
                price={food.foodPrice}
                customisations={customisations}
                comments={food?.comments}
                cancelAction={food.cancelAction}
              />
            )
          })}
      </CustomCard>
      <ButtonContainer>
        <Button defaultButtonDescription={'Add Another'} stopPropagation={true} isFlipButton={false} />
      </ButtonContainer>
    </MainCard>
  )
}
