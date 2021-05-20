import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import Button from '../../../components/Mobile/Button'
import InputRow from '../../../components/Mobile/InputRow'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { getCollatedOrder, setFinalDeliveryFee } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  display: flex;
  flex-direction: column;
`

const OrderIdText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 17px;
  line-height: 22px;
  width: 80vw;
  margin: 0 auto;
`

const TotalPriceText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  width: 80vw;
  margin: 10px auto;
  display: flex;
  justify-content: center;
`

const DeliveryFeeContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 83vw;
  margin: 10px auto;
  align-items: baseline;
`

const FinalDeliveryFeeText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  width: 120%;
`

const ButtonContainer = styled.div`
  margin: 20px auto;
  width: 100vw;
  display: flex;
  justify-content: center;
`

const Input = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 0px 0px 0px 0px;
  height: 35px;
`

const OrderSummary = () => {
  const dispatch = useDispatch()
  const params = useParams<{ supperGroupId: string }>()
  const { collatedOrder, finalDeliveryFee } = useSelector((state: RootState) => state.supper)
  const {
    register,

    formState: { errors },
  } = useForm()
  const { handleSubmit, control } = useForm()

  const onSubmit = (data) => console.log(data)
  console.log(errors)
  useEffect(() => {
    dispatch(getCollatedOrder(params.supperGroupId))
  }, [])

  const setFinalDeliveryFeeMethod = (deliveryFee: string) => {
    dispatch(setFinalDeliveryFee(deliveryFee))
  }

  const onClick = () => {
    console.log(finalDeliveryFee.length)
    console.log('Order placed!')
    handleSubmit(onSubmit)()
  }
  return (
    <MainContainer>
      <TopNavBar title="Order Summary" />
      <OrderIdText>{collatedOrder?.supperGroupId}</OrderIdText>
      {/* TODO: UPDATE ORDER SUMMARY CARD */}
      <OrderSummaryCard foodList={collatedOrder?.collatedOrderList ?? []} />
      <TotalPriceText>
        Total Price
        <span style={{ width: '1.5rem' }} /> ${collatedOrder?.price?.toFixed(2) ?? '0.00'}
      </TotalPriceText>
      <DeliveryFeeContainer>
        <FinalDeliveryFeeText>Final Delivery Fee</FinalDeliveryFeeText>
        <Controller
          control={control}
          name="DeliveryFee"
          render={({ onChange, value }) => <InputRow placeholder="Enter Price" value={value} setValue={onChange} />}
        />
        {/* <Controller
  control={control}
  name="test"
  render={(
    { onChange, onBlur, value, name, ref },
    { invalid, isTouched, isDirty }
  ) => (
    <Checkbox
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.checked)}
      checked={value}
      inputRef={ref}
    />
  )}
/> */}
      </DeliveryFeeContainer>
      <ButtonContainer>
        <Button
          stopPropagation
          defaultButtonDescription="Order Placed"
          buttonWidth="fit-content"
          buttonHeight="fit-content"
          onButtonClick={onClick}
          isFlipButton={false}
          descriptionStyle={{ fontSize: '17px', fontFamily: 'Inter' }}
        />
      </ButtonContainer>
    </MainContainer>
  )
}

export default OrderSummary
