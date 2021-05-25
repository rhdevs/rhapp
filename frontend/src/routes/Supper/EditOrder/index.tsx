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
  // updateOrderDetails,
} from '../../../store/supper/action'
import { PaymentInfo, PaymentMethod, SplitACMethod } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { paymentMethods, restaurantList } from '../../../store/stubs'
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
  display: flex;
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
  closingTime: number
  maxPrice: number
  estDeliveryFee: number
  splitDeliveryFee: SplitACMethod
  paymentMethod: number
  phoneNumber: number
}

type PaymentInfoData = Record<string, string>

const EditOrder = () => {
  const dispatch = useDispatch()
  const { supperGroup, editOrderNumber, selectedPaymentMethod, isLoading, counter } = useSelector(
    (state: RootState) => state.supper,
  )
  const params = useParams<{ supperGroupId: string }>()
  const [hasMaxPrice, setHasMaxPrice] = useState<boolean>(supperGroup?.costLimit ? true : false)
  const { register, handleSubmit, setValue, clearErrors, setError, reset, control, errors } = useForm<
    FormData,
    PaymentInfoData
  >({
    mode: 'all',
    defaultValues: {
      closingTime: supperGroup?.closingTime,
      maxPrice: supperGroup?.costLimit,
    },
    shouldUnregister: false,
  })

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  useEffect(() => {
    const selectedPM = supperGroup?.paymentInfo.map((pi) => {
      return pi.paymentMethod
    })
    dispatch(setSelectedPaymentMethod(selectedPM))
    if (supperGroup) {
      reset({
        closingTime: supperGroup.closingTime,
        maxPrice: supperGroup.costLimit,
        splitDeliveryFee: supperGroup.splitAdditionalCost,
      })
      setHasMaxPrice(supperGroup.costLimit ? true : false)
    }
  }, [supperGroup, reset])

  const RedAsterisk = <RedText>*</RedText>

  const orderInformationSection = () => {
    return (
      <OISection>
        <StyledText>Order Name{RedAsterisk}</StyledText>
        <Input
          type="text"
          defaultValue={supperGroup?.supperGroupName ?? ''}
          placeholder="Order name"
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
            placeholder="e.g: 3"
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
                        })?.link ?? undefined
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
        <StyledText topMargin>Phone Number{RedAsterisk}</StyledText>
        <Input
          type="number"
          defaultValue={supperGroup?.phoneNumber}
          placeholder="Phone Number"
          name="phoneNumber"
          ref={register({
            required: true,
            valueAsNumber: true,
          })}
          style={{
            borderColor: errors.phoneNumber && 'red',
            background: errors.phoneNumber && '#ffd1d1',
          }}
        />
        {errors.phoneNumber?.type === 'required' && <ErrorText>Phone Number required!</ErrorText>}
      </PICSection>
    )
  }

  useEffect(() => {
    dispatch(setCounter(counter + 1))
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

    setValue('paymentMethod', selectedPaymentMethod.length)
    if (errors.supperGroupName || errors.closingTime) {
      dispatch(setEditOrderNumber(1))
      return
    }
    if (errors.estDeliveryFee || errors.splitDeliveryFee) {
      dispatch(setEditOrderNumber(2))
      return
    }
    if (errors.paymentMethod || errors.phoneNumber) {
      dispatch(setEditOrderNumber(3))
      return
    }

    handleSubmit((data: FormData) => {
      let updatedOrderInfo
      if (data.supperGroupName !== supperGroup?.supperGroupName) {
        updatedOrderInfo = { supperGroupName: data.supperGroupName }
      }
      if (data.closingTime !== supperGroup?.closingTime) {
        updatedOrderInfo = { ...updatedOrderInfo, closingTime: data.closingTime }
      }
      if (hasMaxPrice) {
        if (data.maxPrice !== supperGroup?.costLimit) {
          updatedOrderInfo = { ...updatedOrderInfo, costLimit: data.maxPrice }
        }
      }
      if (!hasMaxPrice && supperGroup?.costLimit) {
        updatedOrderInfo = { ...updatedOrderInfo, costLimit: undefined }
      }
      if (data.estDeliveryFee !== supperGroup?.additionalCost) {
        updatedOrderInfo = { ...updatedOrderInfo, estDeliveryFee: data.estDeliveryFee }
      }
      if (data.splitDeliveryFee !== supperGroup?.splitAdditionalCost) {
        updatedOrderInfo = { ...updatedOrderInfo, splitAdditionalCost: data.splitDeliveryFee }
      }
      const initialPI = supperGroup?.paymentInfo
      const initialPM = supperGroup?.paymentInfo.map((pi) => {
        return pi.paymentMethod
      })
      let newPI: PaymentInfo[] = []
      const allPaymentMethods = Object.values(PaymentMethod)

      allPaymentMethods
        ?.filter((pm) => pm !== PaymentMethod.CASH)
        .map((pm) => {
          const initialLink = initialPI?.find((pi) => pi.paymentMethod === pm)?.link
          if (
            data[`${pm}`] !== initialLink ||
            !data[`${pm}`] ||
            (initialPM?.includes(pm) && !selectedPaymentMethod?.includes(pm))
          ) {
            if (initialPM?.includes(pm) && !selectedPaymentMethod?.includes(pm)) {
              newPI = newPI.concat({ paymentMethod: pm, link: null })
              return
            }
            if (!data[`${pm}`] && !initialPM?.includes(pm)) {
              return
            }
            newPI = newPI.concat({ paymentMethod: pm, link: data[`${pm}`] ?? null })
          }
        })
      if (
        (initialPM?.includes(PaymentMethod.CASH) && !selectedPaymentMethod.includes(PaymentMethod.CASH)) ||
        (!initialPM?.includes(PaymentMethod.CASH) && selectedPaymentMethod.includes(PaymentMethod.CASH))
      ) {
        newPI = newPI.concat({ paymentMethod: PaymentMethod.CASH })
      }
      if (newPI.length) {
        updatedOrderInfo = { ...updatedOrderInfo, paymentInfo: newPI }
      }
      if (data.phoneNumber !== supperGroup?.phoneNumber) {
        updatedOrderInfo = { ...updatedOrderInfo, phoneNumber: data.phoneNumber }
      }
      console.log('Form was submitted!')
      console.log(data)
      console.log('updatedOrderInfo', updatedOrderInfo)
      //TODO: uncomment to send updated order details to backend
      // dispatch(updateOrderDetails(params.supperGroupId, updatedOrderInfo))
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
