import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'
import notFound from '../../assets/notFound.svg'
import { StatusSymbol } from './StatusSymbol'
import Friends from '../../assets/Friends.svg'

const ImageContainer = styled.img`
  border-radius: 50%;
  width: 64px;
  height: 64px;
  margin: auto 0;
`

const SubContainer = styled.div`
  margin: 8px 20px 0 15px;
  display: flex;
  flex-direction: column;
`

const TitleContainer = styled.text`
  font-size: 17px;
  font-weight: 600;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const OrderIdContainer = styled.text`
  font-size: 11px;
  font-weight: 200;
  text-align: right;
  position: absolute;
  right: 0;
  margin-right: 20px;
`

type Props = {
  title: string
  time: string
  users: number
  orderId: string
}

export const MainSGCard = (props: Props) => {
  return (
    <MainCard>
      <ImageContainer src={notFound} alt="Restaurant Logo" />
      <SubContainer>
        <TitleContainer>{props.title}</TitleContainer>
        <BottomContainer>
          <StatusSymbol hasNoLeftMargin text={props.time} />
          <StatusSymbol
            hasNoLeftMargin
            leftIcon={<img src={Friends} alt="Friends Icon" />}
            text={String(props.users)}
          />
          <OrderIdContainer>
            Order ID:
            <br />
            {props.orderId}
          </OrderIdContainer>
        </BottomContainer>
      </SubContainer>
    </MainCard>
  )
}
