import React from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import notFound from '../../../assets/notFound.svg'
import { StatusSymbol } from '../StatusSymbol'

const Logo = styled.img`
  max-height: 64px;
  max-width: 64px;
  width: 100%;
  height: auto;
  border: 1px #002642 solid;
  border-radius: 50%;
  overflow: hidden;
`

const ImgContainer = styled.div`
  height: 100%;
  width: 25%;
  margin: auto;
  display: flex;
  justify-content: center;
`

const SubContainer = styled.div`
  margin: 5px 0 0 10px;
  display: flex;
  flex-direction: column;
  width: 75%;
`

const TitleContainer = styled.text`
  font-size: 17px;
  font-weight: 600;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`

const OrderIdContainer = styled.text`
  font-size: 11px;
  font-weight: 200;
  text-align: right;
`

const StatusSymbolContainer = styled.div`
  display: flex;
  flex-direction: row;
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
      <ImgContainer>
        <Logo src={notFound} alt="Restaurant Logo" />
      </ImgContainer>
      <SubContainer>
        <TitleContainer>{props.title}</TitleContainer>
        <BottomContainer>
          <StatusSymbolContainer>
            <StatusSymbol hasNoLeftMargin text={props.time} />
            <StatusSymbol hasNoLeftMargin type="numberOfUsers" text={String(props.users)} />
          </StatusSymbolContainer>
          <OrderIdContainer>{props.orderId}</OrderIdContainer>
        </BottomContainer>
      </SubContainer>
    </MainCard>
  )
}
