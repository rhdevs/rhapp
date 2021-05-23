import { Flex } from 'antd-mobile'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { SGCardWithStatus } from '../../../components/Supper/CustomCards/SGCardWithStatus'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { foodList, orderList } from '../../../store/stubs'
import { getSupperGroupById } from '../../../store/supper/action'
import { PaymentMethod, SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'

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

const ButtonContainer = styled.div`
  display: flex;
  margin: 23px 15px;
  justify-content: space-around;
`

export default function UserViewOrder() {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const { supperGroup, selectedSupperGroupStatus } = useSelector((state: RootState) => state.supper)
  const supperGroupIsOpen = true
  //selectedSupperGroupStatus === SupperGroupStatus.OPEN

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar title="View Order" />
      {supperGroupIsOpen ? (
        <ExpandableSGCard
          isOwner
          supperGroupName="SUPPER FRIENDS"
          supperGroupId="RHSO#1002"
          ownerName="Zhou BaoBao"
          priceLimit={30}
          currentAmount={10}
          closingTime="10.30PM"
          numberOfUsers={10}
          deliveryFee="10.70"
        />
      ) : (
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
      )}
      <OrderContainer>
        <Header>My Order</Header>
        {supperGroupIsOpen && <UnderlinedButton fontWeight={200} text="Add Item" color="red" />}
      </OrderContainer>
      <OrderSummaryCard margin="5px 23px" isEditable={supperGroupIsOpen} foodList={foodList} orderList={orderList} />

      {supperGroupIsOpen ? (
        <BottomContainer>
          <BottomMoneyContainer>
            <StyledText>
              <b>Subtotal</b>
            </StyledText>
            <StyledText>
              <b>$18.80</b>
            </StyledText>
          </BottomMoneyContainer>
        </BottomContainer>
      ) : (
        <>
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
          <ButtonContainer>
            <Button
              descriptionStyle={{ width: '100%' }}
              stopPropagation={true}
              defaultButtonDescription="Mark Payment Complete"
              updatedButtonDescription="Payment Completed"
              buttonWidth="200px"
              onButtonClick={() => {
                console.log('success')
              }}
              isFlipButton
            />
          </ButtonContainer>
        </>
      )}
      <BottomNavBar />
    </MainContainer>
  )
}
