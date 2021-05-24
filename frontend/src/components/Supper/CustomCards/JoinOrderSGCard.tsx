import React from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import notFound from '../../../assets/notFound.svg'
import { RoundProgress } from '../RoundProgress'
import { StatusSymbol } from '../StatusSymbol'
import { SplitACMethod } from '../../../store/supper/types'
import { RoundImage } from '../RoundImage'
import MacDonald from '../../../assets/MacDonald.svg'
import Alamaan from '../../../assets/Alamaan.svg'
import Kimly from '../../../assets/Kimly.svg'

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`

const TextSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 20px 0 15px;
  width: 60%;
`

const TitleContainer = styled.text`
  font-size: 20px;
  font-weight: 600;
  width: 95%;
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
  restaurantLogo?: string
  title: string
  restaurant?: string
  orderId: string
  username: string
  priceLimit: number
  currentAmount: number
  closingTime: string
  numberOfUsers: number
  deliveryFee: string
  splitACType?: SplitACMethod
  isOwner?: boolean
  cardMargin?: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const JoinOrderSGCard = (props: Props) => {
  const getImage = (restaurant) => {
    if (restaurant === 'MacDonald') {
      return MacDonald
    } else if (restaurant === 'Alamaan') {
      return Alamaan
    } else if (restaurant === 'Kimly') {
      return Kimly
    } else {
      return notFound
    }
  }

  return (
    <MainCard margin={props.cardMargin} flexDirection="column" isEditable={props.isOwner} editIconSize="1rem">
      <TopSection>
        <RoundImage image={props.restaurantLogo ?? notFound} alt="Restaurant Logo" />
        <TextSubContainer>
          <TitleContainer>{props.title}</TitleContainer>
          <OrderIdContainer>
            {props.orderId} ({props.isOwner ? 'You' : props.username})
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
