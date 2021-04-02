import { CarOutlined } from '@ant-design/icons'
import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'
import { RoundProgress } from './RoundProgress'
import { StatusSymbol } from './StatusSymbol'
import notFound from '../../assets/notFound.svg'
import Friends from '../../assets/Friends.svg'

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
  font-size: 17px;
  font-weight: 600;
`

const OrderIdContainer = styled.text`
  font-size: 12px;
  font-weight: 200;
`

const BottomSection = styled.div`
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: fit-content;
`

const BubblesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

type Props = {
  title: string
  orderId: string
  username: string
  amountLeft: number
  percent: number
  closingTime: string
  numberOfUsers: number
  deliveryFee: string
}

export const ViewOrderSGCard = (props: Props) => {
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
          <StatusSymbol text={props.closingTime} />
          <StatusSymbol
            hasNoLeftMargin
            text={String(props.numberOfUsers)}
            leftIcon={<img src={Friends} alt="Friends Icon" />}
          />
          <StatusSymbol hasNoLeftMargin leftIcon={<CarOutlined />} text={`${props.deliveryFee}*`} />
        </BubblesContainer>
        <RoundProgress
          width={50}
          moneyFontSize="15px"
          textFontSize="12px"
          amountLeft={props.amountLeft}
          percent={props.percent}
        />
      </BottomSection>
    </MainCard>
  )
}
