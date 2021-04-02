import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'
import notFound from '../../assets/notFound.svg'
import { SGStatusBubble } from './SGStatusBubble'
import { SupperGroupStatus } from '../../store/supper/types'
import Button from '../Mobile/Button'
import { OpenUserTelegram } from '../TelegramShareButton'

const Logo = styled.img`
  border-radius: 50%;
  overflow: hidden;
  min-width: 100%;
  min-height: 100%;
  height: 64px;
  width: 64px;
`

const BottomContainer = styled.div`
  margin: 8px 20px 0 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`

const ImgContainer = styled.div`
  height: 64px;
  width: 64px;
  margin: auto 0;
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

type Props = {
  title: string
  orderId: string
  username: string
  supperGroupStatus?: SupperGroupStatus
  buttonTeleHandle?: string
}

export const SGCardWithStatus = (props: Props) => {
  const onClick = () => {
    {
      props.buttonTeleHandle && OpenUserTelegram(props.buttonTeleHandle)
    }
    return undefined
  }
  return (
    <MainCard flexDirection="column">
      <TopSection>
        <ImgContainer>
          <Logo src={notFound} alt="Restaurant Logo" />
        </ImgContainer>
        <TextSubContainer>
          <TitleContainer>{props.title}</TitleContainer>
          <OrderIdContainer>
            {props.orderId} ({props.username})
          </OrderIdContainer>
        </TextSubContainer>
      </TopSection>
      <BottomContainer>
        <SGStatusBubble text={SupperGroupStatus.CLOSED} />
        <Button
          stopPropagation={true}
          defaultButtonDescription="Message Owner"
          onButtonClick={props.buttonTeleHandle ? onClick : undefined}
          isFlipButton={false}
        />
      </BottomContainer>
    </MainCard>
  )
}
