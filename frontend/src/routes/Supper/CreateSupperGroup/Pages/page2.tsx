import React, { useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Radio } from 'antd'
import { ErrorText, initSupperGroup } from '..'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../../components/Supper/FormHeader'
import { LineProgress } from '../../../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../../../components/Supper/UnderlinedButton'
import { setCreateOrderPage, setSupperGroup } from '../../../../store/supper/action'
import { SplitACMethod, SupperGroup } from '../../../../store/supper/types'
import { RootState } from '../../../../store/types'
import { PATHS } from '../../../Routes'
import { V1_BLUE } from '../../../../common/colours'
import { DeliveryFeeInput, errorStyling, StyledRadioGroup, Wrapper } from '../../EditSupperGroup'
import { RadioButton } from '../../../../components/RadioButton'

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
    border-color: ${V1_BLUE};
  }

  .ant-radio-inner::after {
    background-color: ${V1_BLUE};
  }
  ${(props) => props.error && 'borderColor: red; background: #ffd1d1;'}
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 85vw;
  margin: 10px auto;
`

type FormValues = {
  estDeliveryFee: number
  splitDeliveryFee: SplitACMethod
}
//delivery fees
//split delivery fees

export const CreateOrderPageTwo = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, control, errors, setError, clearErrors, reset } = useForm<FormValues>()
  const { supperGroup, createOrderPage } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (supperGroup?.splitAdditionalCost) {
      reset({
        splitDeliveryFee: supperGroup.splitAdditionalCost,
      })
    }
  }, [supperGroup?.splitAdditionalCost, reset])

  const onLeftClick = () => {
    dispatch(setCreateOrderPage(createOrderPage - 1))
    history.goBack()
  }

  const onSubmit = () => {
    let updatedSPInfo: SupperGroup = { ...(supperGroup ?? initSupperGroup) }

    handleSubmit((data: FormValues) => {
      if (!data.estDeliveryFee) {
        setError('estDeliveryFee', { type: 'required' })
      }
      updatedSPInfo = {
        ...updatedSPInfo,
        additionalCost: data.estDeliveryFee,
        splitAdditionalCost: data.splitDeliveryFee,
      }
      dispatch(setCreateOrderPage(createOrderPage + 1))
      console.log('secondSubmit', updatedSPInfo)
      dispatch(setSupperGroup(updatedSPInfo))
    })()
    history.push(`${PATHS.CREATE_SUPPER_GROUP}/3`)
  }

  return (
    <>
      <TopNavBar
        title="Create Group"
        rightComponent={<UnderlinedButton onClick={onSubmit} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      <LineProgress margin="0 0 2rem 0" currentStep={2} numberOfSteps={3} />
      <FormSection>
        <Wrapper baseline>
          <FormHeader isCompulsory headerName="Est. Delivery Fees" />
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
          <FormHeader isCompulsory headerName="Split Delivery Fees" />
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
      </FormSection>

      {/* <HortSectionContainer>
        <FormHeader isCompulsory headerName={'Est. Delivery Fees'} />
        <HortInputContainer>
          <InputText
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
            error={errors.estDeliveryFee}
          />
        </HortInputContainer>
      </HortSectionContainer>
      {errors.estDeliveryFee?.type === 'required' && <ErrorText>Delivery fee required!</ErrorText>}
      {(errors.estDeliveryFee?.type === 'min' || errors.estDeliveryFee?.type === 'validate') && (
        <ErrorText>Invalid delivery fee!</ErrorText>
      )}
      <HortSectionContainer>
        <FormHeader isCompulsory headerName='Split Delivery Fees' />
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
      </HortSectionContainer> */}
      {/* {errors.splitDeliveryFees?.type === 'required' && <ErrorText>Split Delivery Fee method is required.</ErrorText>} */}
    </>
  )
}
