import { Radio } from 'antd'
import React, { useEffect } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { InputForm } from '../../../components/Supper/InputForm'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { SetCreateOrderPage, setOrder } from '../../../store/supper/action'
import { SplitACMethod } from '../../../store/supper/types'
import { RootState } from '../../../store/types'

const HortSectionContainer = styled.div`
  margin: 25px 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`

const HortInputContainer = styled.div`
  padding: 0px 0px 0px 15px;
  width: 45%;
`

const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

const StyledRadioButtons = styled(Radio.Group)<{ error?: FieldError | undefined }>`
  .ant-radio-checked .ant-radio-inner {
    border-color: #002642;
  }

  .ant-radio-inner::after {
    background-color: #002642;
  }

  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

type FormValues = {
  estDeliveryFee: number
  splitDeliveryFees: SplitACMethod
}

export const CreateOrderPageTwo = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, setValue, control, errors, clearErrors, reset } = useForm<FormValues>()
  const { supperGroup, createOrderPage } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (supperGroup) {
      reset({
        splitDeliveryFees: supperGroup.splitAdditionalCost,
      })
    }
  }, [supperGroup, reset])

  const onLeftClick = () => {
    dispatch(SetCreateOrderPage(createOrderPage - 1))
  }

  let updatedSPInfo

  const onClick = () => {
    updatedSPInfo = { ...supperGroup }
    handleSubmit((data: FormValues) => {
      console.log('updatedSPInfo', updatedSPInfo)
      updatedSPInfo = {
        ...updatedSPInfo,
        additionalCost: data.estDeliveryFee,
        splitAdditionalCost: data.splitDeliveryFees,
      }
      dispatch(SetCreateOrderPage(createOrderPage + 1))
      console.log('secondSubmit', updatedSPInfo)
      dispatch(setOrder(updatedSPInfo))
    })()
  }

  return (
    <>
      <TopNavBar
        title="Create Order"
        rightComponent={<UnderlinedButton onClick={onClick} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      <LineProgress currentStep={2} numberOfSteps={3} />
      <InputForm
        horizontal
        headerName={'Est. Delivery Fees'}
        inputType={'number'}
        inputName={'estDeliveryFee'}
        inputPlaceHolder={'$$$'}
        inputDefaulValue={supperGroup?.additionalCost ?? 0}
      />
      <HortSectionContainer>
        <FormHeader headerName={'Split Delivery Fees'} />
        <HortInputContainer>
          <Controller
            name="splitDeliveryFees"
            control={control}
            defaultValue={supperGroup?.splitAdditionalCost}
            render={() => (
              <StyledRadioButtons
                error={errors.splitDeliveryFees}
                onChange={(input) => {
                  console.log(input.target.value)
                  clearErrors('splitDeliveryFees')
                  setValue('splitDeliveryFees', input.target.value)
                }}
                {...register('splitDeliveryFees', {
                  required: true,
                })}
                defaultValue={supperGroup?.splitAdditionalCost}
              >
                <Radio value={SplitACMethod.EQUAL}>Equal</Radio>
                <Radio value={SplitACMethod.PROPORTIONAL}>Proportional</Radio>
              </StyledRadioButtons>
            )}
          />
        </HortInputContainer>
      </HortSectionContainer>
      {errors.splitDeliveryFees?.type === 'required' && <ErrorText>Please select one option.</ErrorText>}
    </>
  )
}
