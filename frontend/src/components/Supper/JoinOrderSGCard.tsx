import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'
import notFound from '../../assets/notFound.svg'
import { RoundProgress } from './RoundProgress'
import { StatusSymbol } from './StatusSymbol'
import { SplitACMethod } from '../../store/supper/types'

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`

const ImgContainer = styled.div`
  height: 64px;
  width: 64px;
  margin: auto 0;
`

const RestaurantLogo = styled.img`
  min-width: 100%;
  min-height: 100%;
  height: 64px;
  width: 64px;
  border: 1px #002642 solid;
  border-radius: 50%;
  overflow: hidden;
`

const TextSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 20px 0 15px;
`

const TitleContainer = styled.text`
  font-size: 20px;
  font-weight: 600;
`

const OrderIdContainer = styled.text`
  font-size: 14px;
  font-weight: 200;
`

const BottomSection = styled.div`
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const BubblesContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const FirstLineContainer = styled.div`
  display: flex;
  flex-direction: row;
`

type Props = {
  title: string
  orderId: string
  username: string
  priceLimit: number
  currentAmount: number
  closingTime: string
  numberOfUsers: number
  deliveryFee: string
  splitACType: SplitACMethod
}

export const JoinOrderSGCard = (props: Props) => {
  return (
    <MainCard flexDirection="column">
      <TopSection>
        <ImgContainer>
          <RestaurantLogo src={notFound} alt="Restaurant Logo" />
        </ImgContainer>
        <TextSubContainer>
          <TitleContainer>{props.title}</TitleContainer>
          <OrderIdContainer>
            {props.orderId} ({props.username})
          </OrderIdContainer>
        </TextSubContainer>
      </TopSection>
      <BottomSection>
        <BubblesContainer>
          <FirstLineContainer>
            <StatusSymbol text={props.closingTime} />
            <StatusSymbol text={String(props.numberOfUsers)} type="numberOfUsers" />
          </FirstLineContainer>
          <StatusSymbol type="estDeliveryFee" text={`${props.deliveryFee} (${props.splitACType})`} />
        </BubblesContainer>
        <RoundProgress priceLimit={props.priceLimit} currentAmount={props.currentAmount} />
      </BottomSection>
    </MainCard>
  )
}
