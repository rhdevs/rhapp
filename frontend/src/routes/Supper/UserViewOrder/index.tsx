import React from 'react'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { foodList, orderList } from '../../../store/stubs'
import { PaymentMethod, SupperGroupStatus } from '../../../store/supper/types'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 2rem;
`

const OrderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const Header = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  padding-right: 5px;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: 1rem auto;
  align-items: flex-end;
`

const BottomMoneyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
  margin: 10px 0;
`

const StyledText = styled.text`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

export default function UserViewOrder() {
  return (
    <MainContainer>
      <TopNavBar title="ViewOrder" />
      <SGCardWithStatus
        supperGroupStatus={SupperGroupStatus.CLOSED}
        location="Basketball Court"
        collectionTime="12:30AM"
        username="Zhou BaoBao"
        title="f> SUPPER FRIENDS"
        orderId="RHSO#1002"
        buttonTeleHandle="someOwnerTele"
        paymentMethod={[
          { paymentMethod: PaymentMethod.CASH },
          { paymentMethod: PaymentMethod.PAYLAH, link: 'https://www.google.com' },
          { paymentMethod: PaymentMethod.GOOGLEPAY, link: 'https://www.google.com' },
          { paymentMethod: PaymentMethod.PAYNOW, link: 'https://www.google.com' },
        ]}
      />
      <OrderContainer>
        <Header>My Order</Header>
        <OrderSummaryCard margin="5px 23px" orderByUser foodList={foodList} orderList={orderList} />
      </OrderContainer>
      <BottomContainer>
        <BottomMoneyContainer>
          <StyledText>Subtotal</StyledText>
          <StyledText>$19.80</StyledText>
        </BottomMoneyContainer>
        <BottomMoneyContainer>
          <StyledText>Delivery Fee</StyledText>
          <StyledText>$0.50</StyledText>
        </BottomMoneyContainer>
        <BottomMoneyContainer>
          <StyledText>
            <b>Total</b>
          </StyledText>
          <StyledText>
            <b>$20.30</b>
          </StyledText>
        </BottomMoneyContainer>
      </BottomContainer>
      <BottomNavBar />
    </MainContainer>
  )
}
