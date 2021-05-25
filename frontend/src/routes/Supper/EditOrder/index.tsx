import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import styled from 'styled-components'

import { Radio, Switch, TimePicker } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import Button from '../../../components/Mobile/Button'
import { RadioButton } from '../../../components/RadioButton'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { BubbleSection } from '../../../components/Supper/BubbleSection'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import {
  getSupperGroupById,
  setCounter,
  setEditOrderNumber,
  setSelectedPaymentMethod,
  unixTo12HourTime,
  unixToFormattedTime,
} from '../../../store/supper/action'
import { PaymentMethod, SplitACMethod } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { paymentMethods, restaurantList, supperGroupStub } from '../../../store/stubs'
import { useParams } from 'react-router-dom'
import LoadingSpin from '../../../components/LoadingSpin'

const Background = styled.form`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 3rem;
`

const StyledText = styled.text<{ topMargin?: boolean }>`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  ${(props) => props.topMargin && 'margin-top: 1rem;'}
  width: 100%;
`

const Input = styled.input<{ flex?: boolean }>`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.flex && 'display: flex;'}
`

const OISection = styled.div`
  display: flex;
  flex-direction: column;
`

const DISection = styled.div`
  display: flex;
  flex-direction: column;
`

const ButtonContainer = styled.div`
  margin: 1rem auto 0 auto;
  display: flex;
  justify-content: center;
`

const PICSection = styled.div`
  displau: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;
`

const StyledTimePicker = styled(TimePicker)`
  width: 70%;
  margin: 5px auto 0 auto;
`

const RedText = styled.text`
  color: red;
`

const ErrorText = styled.p`
  margin: 5px 0 -10px 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

const StyledSwitch = styled(Switch)`
  width: fit-content;
  &.ant-switch-checked {
    background-color: #002642;
  }
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
`

const Wrapper = styled.div<{ topMargin?: boolean; baseline?: boolean }>`
  display: grid;
  grid-template-columns: 50% 47%;
  grid-gap: 3%;
  ${(props) => props.baseline && 'align-items: baseline;'}
  ${(props) => props.topMargin && 'margin-top: 1rem'}
`

const DeliveryFeeInput = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

type FormData = {
  supperGroupName: string
  restuarant: string
  closingTime: number
  maxPrice: number
  estDeliveryFee: number
  splitDeliveryFee: SplitACMethod
  paymentMethod: number
}

type PaymentInfoData = Record<string, string>

const EditOrder = () => {
  const dispatch = useDispatch()
  const { supperGroup, editOrderNumber, selectedPaymentMethod, isLoading, counter } = useSelector(
    (state: RootState) => state.supper,
  )
  const params = useParams<{ supperGroupId: string }>()
  const [hasMaxPrice, setHasMaxPrice] = useState<boolean>(supperGroupStub?.costLimit ? true : false)
  const { register, handleSubmit, watch, setValue, clearErrors, setError, control, errors } = useForm<
    FormData,
    PaymentInfoData
  >({
    mode: 'all',
    defaultValues: {
      closingTime: supperGroupStub?.estArrivalTime,
      maxPrice: supperGroupStub?.costLimit,
    },
  })
  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    const selectedPM = supperGroup?.paymentInfo.map((pi) => {
      return pi.paymentMethod
    })
    dispatch(setSelectedPaymentMethod(selectedPM))
  }, [dispatch])

  useEffect(() => {
    const selectedPM = supperGroup?.paymentInfo.map((pi) => {
      return pi.paymentMethod
    })
    dispatch(setSelectedPaymentMethod(selectedPM))
  }, [supperGroup])
  const RedAsterisk = <RedText>*</RedText>

  const orderInformationSection = () => {
    return (
      <OISection>
        <StyledText>Order Name{RedAsterisk}</StyledText>
        <Input
          type="text"
          defaultValue={supperGroup?.supperGroupName ?? ''}
          placeholder="Supper group name"
          name="supperGroupName"
          ref={register({
            required: true,
            validate: (input) => input.trim().length !== 0,
          })}
          style={{
            borderColor: errors.supperGroupName && 'red',
            background: errors.supperGroupName && '#ffd1d1',
          }}
        />
        {errors.supperGroupName?.type === 'required' && <ErrorText>Order Name required!</ErrorText>}
        {errors.supperGroupName?.type === 'validate' && <ErrorText>Invalid Order Name!</ErrorText>}
        <StyledText topMargin>Restaurant</StyledText>
        <RestaurantBubbles isDisabled defaultRestaurant={supperGroup?.restaurantName} restaurantList={restaurantList} />
        <StyledText topMargin>Closing Time{RedAsterisk}</StyledText>
        <Controller
          name="closingTime"
          control={control}
          rules={{ required: true }}
          render={() => (
            <StyledTimePicker
              use12Hours
              format="h:mm a"
              onChange={onChange}
              ref={register({ required: true })}
              style={{
                borderColor: errors.closingTime && 'red',
                background: errors.closingTime && '#ffd1d1',
              }}
              defaultValue={moment(`${unixToFormattedTime(supperGroup?.closingTime)}`, 'HH:mm:ss')}
            />
          )}
        />
        {errors.closingTime?.type === 'required' && <ErrorText>Closing Time required!</ErrorText>}
        <StyledText topMargin>Max Price</StyledText>
        <PriceContainer>
          Set maximum total price
          <StyledSwitch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onClick={() => setHasMaxPrice(!hasMaxPrice)}
            defaultChecked={hasMaxPrice}
          />
        </PriceContainer>
        {hasMaxPrice && <MaxPriceFixer defaultValue={supperGroup?.costLimit} center />}
      </OISection>
    )
  }

  const deliveryInformationSection = () => {
    return (
      <DISection>
        <Wrapper baseline>
          <StyledText>Est. Delivery Fees{RedAsterisk}</StyledText>
          <DeliveryFeeInput
            type="number"
            placeholder="Delivery fee"
            name="estDeliveryFee"
            defaultValue={supperGroup?.additionalCost}
            ref={register({
              required: true,
              validate: (input) => input.trim().length !== 0,
              valueAsNumber: true,
              min: 0,
            })}
            style={{
              borderColor: errors.estDeliveryFee && 'red',
              background: errors.estDeliveryFee && '#ffd1d1',
            }}
          />
        </Wrapper>
        {errors.estDeliveryFee?.type === 'required' && <ErrorText>Delivery fee required!</ErrorText>}
        {(errors.estDeliveryFee?.type === 'min' || errors.estDeliveryFee?.type === 'validate') && (
          <ErrorText>Invalid delivery fee!</ErrorText>
        )}
        <Wrapper topMargin>
          <StyledText>Split Delivery Fees{RedAsterisk}</StyledText>
          <StyledRadioGroup
            {...register('splitDeliveryFee', { required: true })}
            onChange={(e) => {
              clearErrors('splitDeliveryFee')
              setValue('splitDeliveryFee', e.target.value)
            }}
            defaultValue={supperGroup?.splitAdditionalCost}
          >
            <RadioButton value={SplitACMethod.EQUAL} label={SplitACMethod.EQUAL} />
            <RadioButton value={SplitACMethod.PROPORTIONAL} label={SplitACMethod.PROPORTIONAL} />
          </StyledRadioGroup>
        </Wrapper>
        {errors.splitDeliveryFee?.type === 'required' && <ErrorText>Split delivery fee method required!</ErrorText>}
      </DISection>
    )
  }

  let pmError = 0

  const paymentInformationSection = () => {
    return (
      <PICSection>
        <StyledText>Payment Method{RedAsterisk}</StyledText>
        <PaymentMethodBubbles {...register('paymentMethod', { required: true })} paymentMethods={paymentMethods} />
        {paymentMethods
          .filter((pm) => pm !== PaymentMethod.CASH)
          .map((pm) => {
            return (
              selectedPaymentMethod.includes(pm) && (
                <Input
                  flex
                  type="text"
                  name={pm}
                  ref={register({
                    required: true,
                    validate: (input) => input.trim().length !== 0,
                  })}
                  style={{
                    borderColor: errors[`${pm}`] && 'red',
                    background: errors[`${pm}`] && '#ffd1d1',
                  }}
                  placeholder={pm + ' Link'}
                  defaultValue={
                    counter <= 1
                      ? supperGroup?.paymentInfo.find((pi) => {
                          return pi.paymentMethod === pm
                        })?.link
                      : undefined
                  }
                />
              )
            )
          })}
        {selectedPaymentMethod.filter((pm) => {
          if (errors[`${pm}`]) {
            return pmError++
          }
        })}
        {errors.paymentMethod && pmError === 0 && <ErrorText>Payment method required!</ErrorText>}
        {pmError !== 0 && <ErrorText>Payment link{pmError > 1 && 's'} required!</ErrorText>}
      </PICSection>
    )
  }

  useEffect(() => {
    dispatch(setCounter(counter + 1))
    console.log(counter)
    if (selectedPaymentMethod.length === 0 || pmError !== 0) {
      setValue('paymentMethod', undefined)
      setError('paymentMethod', { type: 'required' })
    } else {
      pmError = 0
      clearErrors('paymentMethod')
      setValue('paymentMethod', selectedPaymentMethod.length)
    }
  }, [selectedPaymentMethod])

  const onChange = (time, timeString) => {
    if (!time || !timeString) {
      setValue('closingTime', undefined)
      setError('closingTime', { type: 'required' })
      return
    }
    console.log(time._d)
    console.log(timeString)
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }
    console.log(epochClosingTime)
    console.log(unixTo12HourTime(epochClosingTime))
    setValue('closingTime', epochClosingTime)
    clearErrors('closingTime')
  }

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!watch('splitDeliveryFee')) setValue('splitDeliveryFee', supperGroup?.splitAdditionalCost as SplitACMethod)
    setValue('paymentMethod', selectedPaymentMethod.length)
    if (errors.supperGroupName || errors.closingTime) {
      dispatch(setEditOrderNumber(1))
      return
    }
    if (errors.estDeliveryFee || errors.splitDeliveryFee) {
      dispatch(setEditOrderNumber(2))
      return
    }
    if (errors.paymentMethod) {
      dispatch(setEditOrderNumber(3))
      return
    }

    handleSubmit((data: FormData) => {
      console.log('Form was submitted!')
      console.log(data)
    })()
  }

  return (
    <Background onSubmit={onSubmit}>
      <TopNavBar title="Edit Order" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <BubbleSection canHide isOpen={editOrderNumber === 1} title="Order Information" number={1}>
            {orderInformationSection()}
          </BubbleSection>
          <BubbleSection canHide isOpen={editOrderNumber === 2} title="Delivery Information" number={2}>
            {deliveryInformationSection()}
          </BubbleSection>
          <BubbleSection canHide isOpen={editOrderNumber === 3} title="Payment Information" number={3}>
            {paymentInformationSection()}
          </BubbleSection>
          <ButtonContainer>
            <Button
              htmlType="submit"
              stopPropagation
              defaultButtonDescription="Save Changes"
              buttonHeight="2.5rem"
              descriptionStyle={{
                fontFamily: 'Inter',
                fontWeight: 200,
                fontSize: '17px',
              }}
              isFlipButton={false}
            />
          </ButtonContainer>
        </>
      )}
    </Background>
  )
}

export default EditOrder
