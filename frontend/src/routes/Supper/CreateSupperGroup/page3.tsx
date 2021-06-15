import React, { useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { paymentMethods } from '../../../store/stubs'
import { createSupperGroup, SetCreateOrderPage, setOrder } from '../../../store/supper/action'
import { PaymentInfo, PaymentMethod } from '../../../store/supper/types'
import { PATHS } from '../../Routes'

const VertSectionContainer = styled.div`
  margin: 25px 35px;
`

const VertInputContainer = styled.div`
  padding 5px 0 0 0;
`

const InputText = styled.input<{ flex?: boolean; error?: FieldError | undefined }>`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.flex && 'display: flex;'}
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

type FormValues = {
  paymentMethod: PaymentInfo[]
  phoneNumber: number
}

export const CreateOrderPageThree = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, errors, setError, clearErrors, reset } = useForm<FormValues>()
  const { supperGroup, selectedPaymentMethod, createOrderPage } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (selectedPaymentMethod.length === 0 || pmError !== 0) {
      setValue('paymentMethod', undefined)
      setError('paymentMethod', { type: 'required' })
    } else {
      pmError = 0
      clearErrors('paymentMethod')
      setValue('paymentMethod', selectedPaymentMethod)
      console.log('selectedPaymentMethod', selectedPaymentMethod)
    }
  }, [selectedPaymentMethod])

  const onLeftClick = () => {
    dispatch(SetCreateOrderPage(createOrderPage - 1))
  }

  let updatedSPInfo
  let pmError = 0

  const onClick = () => {
    updatedSPInfo = { ...supperGroup }
    handleSubmit((data: FormValues) => {
      updatedSPInfo = {
        ...updatedSPInfo,
        paymentInfo: data.paymentMethod,
        phoneNumber: data.phoneNumber,
        ownerId: localStorage.userID,
      }
      const initialPI = supperGroup?.paymentInfo
      const initialPM = supperGroup?.paymentInfo?.map((pi) => {
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
        const updatedPI = selectedPaymentMethod.map((pm) => {
          return { paymentMethod: pm, link: data[`${pm}`] }
        })
        updatedSPInfo = { ...updatedSPInfo, paymentInfo: updatedPI }
        console.log('paymentInfo', updatedPI)
      }
      console.log('thirdSubmit', updatedSPInfo)
      dispatch(setOrder(updatedSPInfo))
      dispatch(createSupperGroup(updatedSPInfo))
    })()
    history.push(`${PATHS.JOIN_ORDER}/${supperGroup?.supperGroupId}`)
  }

  return (
    <>
      <TopNavBar
        title="Create Order"
        rightComponent={<UnderlinedButton onClick={onClick} text="Finish" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      <LineProgress currentStep={3} numberOfSteps={3} />
      <VertSectionContainer>
        <FormHeader headerName={'Payment Method'} />
        <PaymentMethodBubbles {...register('paymentMethod', { required: true })} paymentMethods={paymentMethods} />
        {paymentMethods
          .filter((pm) => pm !== PaymentMethod.CASH)
          .map((pm) => {
            return (
              selectedPaymentMethod.includes(pm) && (
                <InputText
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
      </VertSectionContainer>
      <VertSectionContainer>
        <FormHeader headerName={'Phone Number'} />
        <VertInputContainer>
          <InputText
            flex
            type="number"
            placeholder="Phone Number"
            name="phoneNumber"
            ref={register({
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors.phoneNumber?.type === 'required' && <ErrorText>Phone Number is required.</ErrorText>}
        </VertInputContainer>
      </VertSectionContainer>
    </>
  )
}
