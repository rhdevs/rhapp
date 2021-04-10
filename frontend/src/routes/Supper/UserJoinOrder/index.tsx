import { ShareAltOutlined } from '@ant-design/icons'
import React from 'react'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { SplitACMethod } from '../../../store/supper/types'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`
const ButtonContainer = styled.div`
  text_align: centre;
  margin: 70px 140px;
`

export default function UserJoinOrder() {
  const rightIcon = <ShareAltOutlined />

  return (
    <Background>
      <TopNavBar title="Join Order" rightComponent={rightIcon} />
      <JoinOrderSGCard
        title="f> SUPPER FRIENDS"
        restaurant="MacDonald"
        orderId="RHSO#1002"
        username="Zhou BaoBao"
        currentAmount={50}
        priceLimit={100}
        closingTime="11:59PM"
        numberOfUsers={7}
        splitACType={SplitACMethod.EQUAL}
        deliveryFee="10.70"
      />
      <ButtonContainer>
        <Button defaultButtonDescription="Join Order" stopPropagation={true} />
      </ButtonContainer>
      <BottomNavBar />
    </Background>
  )
}
