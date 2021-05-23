import { Input } from 'antd'
import React from 'react'
import styled from 'styled-components'
import Button from '../../../components/Mobile/Button'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { foodList, orderList } from '../../../store/stubs'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 2rem;
`

const NumberContainer = styled.div`
  margin: 25px 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const FieldHeader = styled.text`
  font-weight: 700;
  font-size: 16px;
`

const InputBox = styled(Input)`
  &.ant-input {
    border-radius: 25px;
  }
`

const OrderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const Header = styled.text`
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

export default function ConfirmOrder() {
  return (
    <MainContainer>
      <NumberContainer>
        <FieldHeader>Phone Number</FieldHeader>
        <InputBox placeholder="Phone Number" />
      </NumberContainer>
      <OrderContainer>
        <Header>My Order</Header>
      </OrderContainer>
      <OrderSummaryCard margin="5px 23px" isEditable foodList={foodList} />
      <BottomContainer>
        <BottomMoneyContainer>
          <StyledText>
            <b>Subtotal</b>
          </StyledText>
          <StyledText>$17.20</StyledText>
        </BottomMoneyContainer>
      </BottomContainer>
      <ButtonContainer>
        <Button
          descriptionStyle={{ width: '100%' }}
          stopPropagation={true}
          defaultButtonDescription="Confirm Order"
          buttonWidth="180px"
          onButtonClick={() => {
            console.log('success')
          }}
        />
      </ButtonContainer>
    </MainContainer>
  )
}
