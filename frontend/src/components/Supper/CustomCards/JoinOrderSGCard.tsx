import React from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import notFound from '../../../assets/notFound.svg'
import { RoundProgress } from '../RoundProgress'
import { StatusSymbol } from '../StatusSymbol'
import { SplitACMethod } from '../../../store/supper/types'
import { RoundImage } from '../RoundImage'
import { UnderlinedButton } from '../UnderlinedButton'

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
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

const OwnerButtonContainer = styled.div`
  margin: auto;
  padding-top: 3px;
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
  isOwner?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const JoinOrderSGCard = (props: Props) => {
  return (
    <MainCard flexDirection="column">
      <TopSection>
        <RoundImage image={notFound} alt="Restaurant Logo" />
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
      {props.isOwner ? (
        <OwnerButtonContainer>
          <UnderlinedButton onClick={props.onClick} text="Update Order Details" color="red" fontSize="14px" />
        </OwnerButtonContainer>
      ) : (
        <></>
      )}
    </MainCard>
  )
}
