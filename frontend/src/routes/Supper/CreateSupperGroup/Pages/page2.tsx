import { Radio } from 'antd'
import React, { useEffect } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ErrorText, InputText } from '..'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../../components/Supper/FormHeader'
import { LineProgress } from '../../../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../../../components/Supper/UnderlinedButton'
import { setCreateOrderPage, setOrder } from '../../../../store/supper/action'
import { SplitACMethod } from '../../../../store/supper/types'
import { RootState } from '../../../../store/types'
import { PATHS } from '../../../Routes'

const HortSectionContainer = styled.div`
  margin: 25px 35px 5px 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`

const HortInputContainer = styled.div`
  padding: 0px 0px 0px 15px;
  width: 45%;
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
  const history = useHistory()
  const { register, handleSubmit, setValue, control, errors, setError, clearErrors, reset } = useForm<FormValues>()
  const { supperGroup, createOrderPage } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (supperGroup) {
      reset({
        splitDeliveryFees: supperGroup.splitAdditionalCost,
      })
    }
  }, [supperGroup, reset])

  const onLeftClick = () => {
    dispatch(setCreateOrderPage(createOrderPage - 1))
    history.goBack()
  }

  let updatedSPInfo

  const onClick = () => {
    updatedSPInfo = { ...supperGroup }
    handleSubmit((data: FormValues) => {
      if (!data.estDeliveryFee) {
        setError('estDeliveryFee', { type: 'required' })
      }
      updatedSPInfo = {
        ...updatedSPInfo,
        additionalCost: data.estDeliveryFee,
        splitAdditionalCost: data.splitDeliveryFees,
      }
      dispatch(setCreateOrderPage(createOrderPage + 1))
      console.log('secondSubmit', updatedSPInfo)
      dispatch(setOrder(updatedSPInfo))
    })()
    history.push(`${PATHS.CREATE_SUPPER_GROUP}/${createOrderPage}`)
  }

  return (
    <>
      <TopNavBar
        title="Create Order"
        rightComponent={<UnderlinedButton onClick={onClick} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      <LineProgress currentStep={2} numberOfSteps={3} />
      <HortSectionContainer>
        <FormHeader headerName={'Est. Delivery Fees'} />
        <HortInputContainer>
          <InputText
            type="number"
            placeholder="$$$"
            name="estDeliveryFee"
            defaultValue={supperGroup?.additionalCost ?? ''}
            ref={register({
              required: true,
              valueAsNumber: true,
            })}
            error={errors.estDeliveryFee}
          />
        </HortInputContainer>
      </HortSectionContainer>
      {errors.estDeliveryFee?.type === 'required' && <ErrorText>Estimated delivery fees required.</ErrorText>}
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
                  setValue('splitDeliveryFees', input.target.value)
                  clearErrors('splitDeliveryFees')
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
      {errors.splitDeliveryFees?.type === 'required' && <ErrorText>Split Delivery Fee method is required.</ErrorText>}
    </>
  )
}
