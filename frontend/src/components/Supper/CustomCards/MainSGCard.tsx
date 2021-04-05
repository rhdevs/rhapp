import React from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import notFound from '../../../assets/notFound.svg'
import { StatusSymbol } from '../StatusSymbol'
import { RoundImage } from '../RoundImage'
import { UnderlinedButton } from '../UnderlinedButton'

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
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

const OwnerButtonContainer = styled.div`
  margin: auto;
  padding-top: 3px;
`

type Props = {
  title: string
  time: string
  users: number
  orderId: string
  isOwner?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const MainSGCard = (props: Props) => {
  return (
    <MainCard flexDirection="column">
      <MainContainer>
        <RoundImage image={notFound} alt="Restaurant Logo" />
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
      </MainContainer>
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
