import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { ErrorText } from '..'
import LoadingSpin from '../../../../components/LoadingSpin'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../../components/Supper/FormHeader'
import { LineProgress } from '../../../../components/Supper/LineProgess'
import { PaymentMethodBubbles } from '../../../../components/Supper/PaymentMethodBubbles'
import { UnderlinedButton } from '../../../../components/Supper/UnderlinedButton'
import { initSupperGroup, paymentMethods } from '../../../../store/stubs'
import { createSupperGroup } from '../../../../store/supper/action/level1/postRequests'
import { setCounter, setIsLoading, setSupperGroup } from '../../../../store/supper/action/setter'
import { PaymentInfo, PaymentMethod, SupperGroup } from '../../../../store/supper/types'
import { RootState } from '../../../../store/types'
import { PATHS } from '../../../Routes'
import { errorStyling, Input } from '../../EditSupperGroup'

const FormContainer = styled.div`
  width: 80vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

type FormValues = {
  paymentMethod: PaymentInfo[]
  phoneNumber: number
}

export const CreateOrderPageThree = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, errors, setError, clearErrors } = useForm<FormValues>()
  const { newSupperGroupId, supperGroup, selectedPaymentMethod, counter, isLoading } = useSelector(
    (state: RootState) => state.supper,
  )
  const [invalidInfoPageNum, setInvalidInfoPageNum] = useState<number>(1)

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

  useEffect(() => {
    console.log(newSupperGroupId, supperGroup?.restaurantId)
    if (newSupperGroupId !== undefined && supperGroup?.restaurantId !== undefined) {
      history.replace(PATHS.SUPPER_HOME)
      history.push(`${PATHS.ORDER}/${newSupperGroupId}/${supperGroup?.restaurantId}/order`)
    }
  }, [newSupperGroupId, supperGroup?.restaurantId])

  const onLeftClick = () => {
    history.goBack()
  }

  let pmError = 0

  const isSupperGroupValid = (supperGroup: SupperGroup) => {
    if (
      supperGroup.supperGroupName === '' ||
      supperGroup.restaurantName === '' ||
      supperGroup.closingTime === undefined
    ) {
      setInvalidInfoPageNum(1)
      return false
    }
    if (supperGroup.additionalCost === undefined || supperGroup.splitAdditionalCost === undefined) {
      setInvalidInfoPageNum(2)
      return false
    }
    return true
  }

  const onSubmit = () => {
    dispatch(setCounter(counter + 1)) //To start throwing error for payment method

    let updatedSPInfo: SupperGroup = { ...(supperGroup ?? initSupperGroup) }
    handleSubmit((data: FormValues) => {
      updatedSPInfo = {
        ...updatedSPInfo,
        paymentInfo: data.paymentMethod,
        phoneNumber: data.phoneNumber,
        ownerId: localStorage.userID,
      }
      let newPI: PaymentInfo[] = []
      const allPaymentMethods = Object.values(PaymentMethod)

      allPaymentMethods
        ?.filter((pm) => pm !== PaymentMethod.CASH)
        .map((pm) => (newPI = newPI.concat({ paymentMethod: pm, link: data[`${pm}`] ?? null })))

      if (newPI.length) {
        console.log(newPI)
        const updatedPI = selectedPaymentMethod.map((pm) => {
          return { paymentMethod: pm, link: data[`${pm}`] }
        })
        updatedSPInfo = { ...updatedSPInfo, paymentInfo: updatedPI }
        console.log('paymentInfo', updatedPI)
      }

      console.log('thirdSubmit', updatedSPInfo)
      dispatch(setSupperGroup(updatedSPInfo))

      // Check validity of all information
      if (isSupperGroupValid(updatedSPInfo)) {
        dispatch(setIsLoading(true))
        dispatch(createSupperGroup(updatedSPInfo))
        if (supperGroup?.restaurantId !== undefined && newSupperGroupId !== undefined) {
          history.push(`${PATHS.ORDER}/${supperGroup?.supperGroupId}/${supperGroup?.restaurantId}/order`)
        }
      } else {
        history.push(`${PATHS.CREATE_SUPPER_GROUP}/${invalidInfoPageNum}`)
      }
    })()
  }

  return (
    <>
      <TopNavBar
        title="Create Group"
        rightComponent={isLoading ? undefined : <UnderlinedButton onClick={onSubmit} text="Finish" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <LineProgress currentStep={3} numberOfSteps={3} />
          <FormContainer>
            <FormHeader topMargin headerName="Payment Method" isCompulsory />
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
            {errors.paymentMethod && pmError === 0 && counter > 0 && <ErrorText>Payment method required!</ErrorText>}
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
          </FormContainer>
        </>
      )}
    </>
  )
}
