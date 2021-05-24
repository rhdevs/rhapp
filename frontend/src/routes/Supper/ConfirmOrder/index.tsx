import { Input } from 'antd'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { foodList } from '../../../store/stubs'
import { updateOrderDetails } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 2rem;
`

const NumberContainer = styled.div`
  margin: 5px 35px 15px 35px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`
const FieldHeader = styled.text`
  font-weight: 500;
  font-size: 15px;
  width: 75%;
  padding-right: 5px;
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
const ErrorText = styled.p`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 17px;
  font-family: 'Inter';
`

const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

type FormValues = {
  number: string
}

export default function ConfirmOrder() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const RedAsterisk = <RedText>*</RedText>
  const dispatch = useDispatch()
  const params = useParams<{ orderId: string }>()
  const { order, isLoading } = useSelector((state: RootState) => state.supper)

  const onClick = () => {
    handleSubmit((data) => {
      dispatch(updateOrderDetails(order?.userContact, params.orderId))
      console.log('success')
      console.log(data.number)
      console.log(errors)
    })
  }

  return (
    <MainContainer>
      <TopNavBar title="Confirm Order" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <NumberContainer>
            <FieldHeader>Phone Number {RedAsterisk}</FieldHeader>
            <InputBox
              placeholder="Phone Number"
              {...register('number', { required: true, minLength: 8, maxLength: 8, pattern: /[0-9]+/i })}
              style={{
                borderColor: errors.number && 'red',
                background: errors.number && '#ffd1d1',
              }}
            />
            {errors.number?.type === 'required' && <ErrorText>This is required!</ErrorText>}
            {(errors.number?.type === 'minLength' || errors.number?.type === 'maxlength') && (
              <ErrorText>Number should have 8 digits</ErrorText>
            )}
            {errors.number?.type === 'pattern' && <ErrorText>Numbers only!</ErrorText>}
          </NumberContainer>
          <OrderContainer>
            <Header>My Order</Header>
          </OrderContainer>
          <OrderSummaryCard margin="5px 23px" foodList={foodList} />
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
              buttonWidth="160px"
              onButtonClick={onClick}
              isFlipButton={false}
            />
          </ButtonContainer>
        </>
      )}
    </MainContainer>
  )
}
