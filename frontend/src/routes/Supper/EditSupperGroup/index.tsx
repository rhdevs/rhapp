import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import styled from 'styled-components'

import { Radio, Switch, TimePicker } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { RadioButton } from '../../../components/RadioButton'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { BubbleSection } from '../../../components/Supper/BubbleSection'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import { unixToFormattedTime } from '../../../common/unixToFormattedTime'
import { PaymentInfo, PaymentMethod, SplitACMethod } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { paymentMethods, restaurantList } from '../../../store/stubs'
import { useHistory, useParams } from 'react-router-dom'
import LoadingSpin from '../../../components/LoadingSpin'
import { V1_BACKGROUND, V1_BLUE } from '../../../common/colours'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'
import { setEditOrderNumber, setSelectedPaymentMethod } from '../../../store/supper/action/setter'
import { getSupperGroupById } from '../../../store/supper/action/level1/getReqests'
import { updateSupperGroup } from '../../../store/supper/action/level1/putRequests'

const Background = styled.form`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
  padding-bottom: 3rem;
`

export const Input = styled.input<{ flex?: boolean }>`
  width: 100%;
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

export const StyledTimePicker = styled(TimePicker)`
  width: 100%;
  margin: 5px auto 0 auto;
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
    background-color: ${V1_BLUE};
  }
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
`

export const Wrapper = styled.div<{ topMargin?: boolean; baseline?: boolean }>`
  display: grid;
  ${(props) => props.baseline && 'align-items: baseline;'}
  ${(props) => props.topMargin && 'margin-top: 1rem'}
`

export const DeliveryFeeInput = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

export const errorStyling = {
  borderColor: 'red',
  background: '#ffd1d1',
}

type FormData = {
  supperGroupName: string
  closingTime: number | undefined
  maxPrice: number | undefined
  estDeliveryFee: number
  splitDeliveryFee: SplitACMethod | undefined
  paymentMethod: number
  phoneNumber: number
}

type PaymentInfoData = Record<string, string>

const EditSupperGroup = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { supperGroup, editOrderNumber, selectedPaymentMethod, isLoading, priceLimit } = useSelector(
    (state: RootState) => state.supper,
  )
  const params = useParams<{ supperGroupId: string }>()
  const [hasMaxPrice, setHasMaxPrice] = useState<boolean>(supperGroup?.costLimit ? true : false)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [errorSectionArr, setErrorSectionArr] = useState<number[]>([])
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    reset,
    control,
    errors,
    formState: { touched },
  } = useForm<FormData, PaymentInfoData>({
    mode: 'all',
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

  const orderInformationSection = () => {
    return (
      <OISection>
        <FormHeader headerName="Group Name" isCompulsory />
        <Input
          type="text"
          defaultValue={supperGroup?.supperGroupName ?? ''}
          placeholder="Group name"
          name="supperGroupName"
          ref={register({
            required: true,
            validate: (input) => input.trim().length !== 0,
            maxLength: 50,
          })}
          style={errors.supperGroupName ? errorStyling : {}}
        />
        {errors.supperGroupName?.type === 'required' && <ErrorText>Order Name required!</ErrorText>}
        {errors.supperGroupName?.type === 'validate' && <ErrorText>Invalid Order Name!</ErrorText>}
        {errors.supperGroupName?.type === 'maxLength' && <ErrorText>Group name exceeded 50 characters!</ErrorText>}
        <FormHeader topMargin headerName="Restaurant" />
        <RestaurantBubbles isDisabled defaultRestaurant={supperGroup?.restaurantName} restaurantList={restaurantList} />
        <FormHeader topMargin headerName="Closing Time" isCompulsory />
        <Controller
          name="closingTime"
          control={control}
          rules={{ required: true }}
          render={() => (
            <StyledTimePicker
              use12Hours
              format="h:mm a"
              onChange={onChange}
              style={errors.closingTime ? errorStyling : {}}
              defaultValue={moment(`${unixToFormattedTime(supperGroup?.closingTime)}`, 'HH:mm:ss')}
            />
          )}
        />
        {errors.closingTime?.type === 'required' && <ErrorText>Closing Time required!</ErrorText>}
        <FormHeader topMargin headerName="Max Price" />
        <PriceContainer>
          Set maximum total price
          <StyledSwitch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onClick={() => setHasMaxPrice(!hasMaxPrice)}
            defaultChecked={hasMaxPrice}
          />
        </PriceContainer>
        {hasMaxPrice && (
          <MaxPriceFixer
            min={Math.ceil(supperGroup?.currentFoodCost ?? 5)}
            defaultValue={supperGroup?.costLimit}
            center
          />
        )}
      </OISection>
    )
  }

  const deliveryInformationSection = () => {
    return (
      <DISection>
        <Wrapper baseline>
          <FormHeader headerName="Est. Delivery Fees" isCompulsory />
          <DeliveryFeeInput
            type="number"
            placeholder="$$$"
            name="estDeliveryFee"
            defaultValue={supperGroup?.additionalCost ?? ''}
            ref={register({
              required: true,
              validate: (input) => input.trim().length !== 0,
              valueAsNumber: true,
              min: 0,
            })}
            style={errors.estDeliveryFee ? errorStyling : {}}
          />
        </Wrapper>
        {errors.estDeliveryFee?.type === 'required' && <ErrorText>Delivery fee required!</ErrorText>}
        {(errors.estDeliveryFee?.type === 'min' || errors.estDeliveryFee?.type === 'validate') && (
          <ErrorText>Invalid delivery fee!</ErrorText>
        )}
        <Wrapper topMargin>
          <FormHeader headerName="Split Delivery Fees" isCompulsory />
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
        <InformationCard margin="4px 0 0 0" splitACMethod />
      </DISection>
    )
  }

  let pmError = 0

  const paymentInformationSection = () => {
    return (
      <PICSection>
        <FormHeader topMargin headerName="Payment Method" isCompulsory />
        <PaymentMethodBubbles
          margin="0 auto 10px auto"
          {...register('paymentMethod', { required: true })}
          paymentMethods={paymentMethods}
        />
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
                    supperGroup?.paymentInfo.find((pi) => {
                      return pi.paymentMethod === pm
                    })?.link ?? ''
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
        <FormHeader topMargin headerName="Phone Number" isCompulsory />
        <Input
          type="number"
          defaultValue={supperGroup?.phoneNumber ?? ''}
          placeholder="Phone Number"
          name="phoneNumber"
          ref={register({
            required: true,
            valueAsNumber: true,
          })}
          style={errors.phoneNumber ? errorStyling : {}}
        />
        {errors.phoneNumber?.type === 'required' && <ErrorText>Phone Number required!</ErrorText>}
      </PICSection>
    )
  }

  useEffect(() => {
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
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }

    setValue('closingTime', epochClosingTime)
    clearErrors('closingTime')
  }

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setErrorSectionArr(errorSectionArr.splice(0, errorSectionArr.length))
    setValue('paymentMethod', selectedPaymentMethod.length)
    if (selectedPaymentMethod.length === 0 || pmError !== 0 || errors.phoneNumber) {
      dispatch(setEditOrderNumber(3))
      errorSectionArr.push(3)
    }
    if (errors.estDeliveryFee || errors.splitDeliveryFee) {
      dispatch(setEditOrderNumber(2))
      errorSectionArr.push(2)
    }
    if (errors.supperGroupName || errors.closingTime) {
      dispatch(setEditOrderNumber(1))
      errorSectionArr.push(1)
    }

    if (errorSectionArr.length) {
      setErrorSectionArr(errorSectionArr)
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
        if (priceLimit !== supperGroup?.costLimit) {
          updatedOrderInfo = { ...updatedOrderInfo, costLimit: priceLimit }
        }
      }
      if (!hasMaxPrice && supperGroup?.costLimit) {
        updatedOrderInfo = { ...updatedOrderInfo, costLimit: null }
      }
      if (data.estDeliveryFee !== supperGroup?.additionalCost) {
        updatedOrderInfo = { ...updatedOrderInfo, additionalCost: data.estDeliveryFee }
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
      if (initialPM?.includes(PaymentMethod.CASH) && !selectedPaymentMethod.includes(PaymentMethod.CASH)) {
        newPI = newPI.concat({ paymentMethod: PaymentMethod.CASH, link: null })
      }
      if (!initialPM?.includes(PaymentMethod.CASH) && selectedPaymentMethod.includes(PaymentMethod.CASH)) {
        newPI = newPI.concat({ paymentMethod: PaymentMethod.CASH })
      }
      if (newPI.length) {
        // Changes were made to supper group
        const updatedPI = selectedPaymentMethod.map((pm) => {
          return { paymentMethod: pm, link: data[`${pm}`] }
        })
        updatedOrderInfo = { ...updatedOrderInfo, paymentInfo: updatedPI }
      }
      if (data.phoneNumber !== supperGroup?.phoneNumber) {
        updatedOrderInfo = { ...updatedOrderInfo, phoneNumber: data.phoneNumber }
      }
      if (updatedOrderInfo) {
        dispatch(updateSupperGroup(params.supperGroupId, updatedOrderInfo))
      }
      history.goBack()
    })()
  }

  const onCancelClick = () => {
    setModalIsOpen(false)
  }

  const onConfirmDiscardClick = () => {
    history.goBack()
  }

  return (
    <Background onSubmit={onSubmit}>
      <TopNavBar
        title="Edit Group"
        onLeftClick={() => {
          Object.values(touched).length ? setModalIsOpen(true) : history.goBack()
        }}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {modalIsOpen && (
            <ConfirmationModal
              title="Discard Changes?"
              hasLeftButton
              leftButtonText="Delete"
              onLeftButtonClick={onConfirmDiscardClick}
              rightButtonText="Cancel"
              onRightButtonClick={onCancelClick}
            />
          )}
          <BubbleSection
            error={errorSectionArr.includes(1)}
            canHide
            isOpen={editOrderNumber === 1}
            title="Order Information"
            number={1}
          >
            {orderInformationSection()}
          </BubbleSection>
          <BubbleSection
            error={errorSectionArr.includes(2)}
            canHide
            isOpen={editOrderNumber === 2}
            title="Delivery Information"
            number={2}
          >
            {deliveryInformationSection()}
          </BubbleSection>
          <BubbleSection
            error={errorSectionArr.includes(3)}
            canHide
            isOpen={editOrderNumber === 3}
            title="Payment Information"
            number={3}
          >
            {paymentInformationSection()}
          </BubbleSection>
          <ButtonContainer>
            <SupperButton htmlType="submit" defaultButtonDescription="Save Changes" />
          </ButtonContainer>
        </>
      )}
    </Background>
  )
}

export default EditSupperGroup
