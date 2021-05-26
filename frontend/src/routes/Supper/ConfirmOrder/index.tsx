import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'
import InputRow from '../../../components/Mobile/InputRow'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { foodList } from '../../../store/stubs'
import { getSupperGroupById, getUserOrder, updateOrderDetails } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 2rem;
`

const NumberContainer = styled.div`
  margin: 5px 35px 10px 35px;
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

const InputText = styled.input`
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 15px;
  width: 75%;
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
  font-size: 15px;
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
  const { register, handleSubmit, watch, errors } = useForm<FormValues>()
  const RedAsterisk = <RedText>*</RedText>
  const dispatch = useDispatch()
  const params = useParams<{ supperGroupId: string; userId: string }>()
  const { order, isLoading } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(getUserOrder(params.supperGroupId, params.userId))
  }, [dispatch])

  const onClick = () => {
    console.log(watch())
    console.log(errors)
    handleSubmit((data) => {
      console.log(data.number)
      const updatedOrder = { ...order, userContact: data.number }
      console.log(updatedOrder)
      //dispatch(updateOrderDetails(updatedOrder, params.orderId))
    })()
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
            <InputText
              type="text"
              placeholder="Phone Number"
              name="number"
              ref={register({
                required: true,
                validate: (input) => input.trim().length !== 0,
                pattern: /[0-9]+/i,
              })}
              style={{
                borderColor: errors.number && 'red',
                background: errors.number && '#ffd1d1',
              }}
            />
          </NumberContainer>
          {errors.number?.type === 'required' && <ErrorText>This is required!</ErrorText>}
          {errors.number?.type === 'pattern' && <ErrorText>Numbers only!</ErrorText>}

          <OrderContainer>
            <Header>My Order</Header>
          </OrderContainer>
          <OrderSummaryCard margin="5px 23px" foodList={order?.foodList} />
          <BottomContainer>
            <BottomMoneyContainer>
              <StyledText>
                <b>Subtotal</b>
              </StyledText>
              <StyledText>${(order?.totalCost ?? 0).toFixed(2)}</StyledText>
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
