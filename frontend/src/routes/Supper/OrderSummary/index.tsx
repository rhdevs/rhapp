import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { getCollatedOrder, readableSupperGroupId } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND } from '../../../common/colours'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
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
  width: 130%;
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

const ErrorText = styled.p`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 14px;
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
  deliveryFee: number
}

const OrderSummary = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { collatedOrder, isLoading } = useSelector((state: RootState) => state.supper)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const RedAsterisk = <RedText>*</RedText>
  const errorStyling = {
    borderColor: 'red',
    background: '#ffd1d1',
  }

  useEffect(() => {
    dispatch(getCollatedOrder(params.supperGroupId))
  }, [dispatch])

  const onClick = () => {
    handleSubmit((data) => {
      console.log('Order Placed!')
      //TODO: Update status and final delivery fee
      console.log(data)
      console.log(errors)
      history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
    })()
  }

  return (
    <MainContainer>
      <TopNavBar title="Order Summary" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <OrderIdText>{readableSupperGroupId(collatedOrder?.supperGroupId)}</OrderIdText>
          <OrderSummaryCard collatedOrder={collatedOrder} />
          <TotalPriceText>
            Total Price
            <span style={{ width: '1.5rem' }} /> ${collatedOrder?.price?.toFixed(2) ?? '0.00'}
          </TotalPriceText>
          <DeliveryFeeContainer>
            <FinalDeliveryFeeText>Final Delivery Fee{RedAsterisk}</FinalDeliveryFeeText>
            <Input
              type="number"
              placeholder="Enter Price"
              name="deliveryFee"
              ref={register({
                valueAsNumber: true,
                required: true,
                min: 0,
                validate: (input) => input.trim().length !== 0,
              })}
              style={errors.deliveryFee ? errorStyling : {}}
            />
          </DeliveryFeeContainer>
          {errors.deliveryFee?.type === ('required' || 'validate') && <ErrorText>Delivery Fee required!</ErrorText>}
          {errors.deliveryFee?.type === 'min' && <ErrorText>Invalid value!</ErrorText>}

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
        </>
      )}
    </MainContainer>
  )
}

export default OrderSummary
