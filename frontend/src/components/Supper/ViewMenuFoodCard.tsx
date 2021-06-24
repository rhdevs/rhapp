import { LeftOutlined } from '@ant-design/icons'
import React from 'react'

import styled from 'styled-components'
import Button from '../Mobile/Button'
import { FoodVariationInCard } from './FoodVariationInCard'

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
  bottom: 35.57%;
  z-index: 1000;
  border-radius: 20px;
  max-width: 300px;
  min-height: 250px;
  box-shadow: 0px 4px 4px 4px rgba(0.1, 0.1, 0.1, 0.1);
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 15px;
`

const HeaderText = styled.text`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 14px;
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
  padding: 5px 8px;
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
`

//type Props = {}

export const ViewMenuFoodCard = () => {
  const custom = ['Fries', 'Apple pie']
  return (
    <MainCard>
      <Header>
        <LeftOutlined style={{ color: 'black', padding: '0px 25px 0 6px' }} />
        <HeaderText>McSpicy Meal</HeaderText>
      </Header>
      <SubHeaderContainer>
        <SubHeaderText>In Your Cart</SubHeaderText>
      </SubHeaderContainer>
      <CustomCard>
        <FoodVariationInCard
          isEditable
          foodName={'Hello'}
          customisations={custom}
          qty={2}
          quantitySize={16}
          fontPercentage={0.9}
          quantityWeight={600}
          moneyWeight={500}
          price={6.6}
        />
      </CustomCard>
      <ButtonContainer>
        <Button defaultButtonDescription={'Add Another'} stopPropagation={true} isFlipButton={false} />
      </ButtonContainer>
    </MainCard>
  )
}
