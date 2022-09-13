import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { ErrorText } from '..'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../../components/Supper/FormHeader'
import { LineProgress } from '../../../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../../../components/Supper/UnderlinedButton'
import { SplitACMethod, SupperGroup } from '../../../../store/supper/types'
import { RootState } from '../../../../store/types'
import { PATHS } from '../../../Routes'
import { DeliveryFeeInput, errorStyling, StyledRadioGroup, Wrapper } from '../../EditSupperGroup'
import { RadioButton } from '../../../../components/RadioButton'
import LoadingSpin from '../../../../components/LoadingSpin'
import { InformationCard } from '../../../../components/Supper/InformationCard'
import { setSupperGroup } from '../../../../store/supper/action/setter'
import { initSupperGroup } from '../../../../store/stubs'

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: 10px auto;
`

type FormValues = {
  estDeliveryFee: number
  splitDeliveryFee: SplitACMethod
}

export const CreateOrderPageTwo = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, setError, clearErrors, reset, errors } = useForm<FormValues>()
  const { supperGroup, isLoading } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (supperGroup?.splitAdditionalCost) {
      reset({
        splitDeliveryFee: supperGroup.splitAdditionalCost,
      })
    }
  }, [supperGroup?.splitAdditionalCost, reset])

  const onLeftClick = () => {
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
      dispatch(setSupperGroup(updatedSPInfo))
      history.push(`${PATHS.CREATE_SUPPER_GROUP}/3`)
    })()
  }

  return (
    <>
      <TopNavBar
        title="Create Group"
        rightComponent={<UnderlinedButton onClick={onSubmit} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <LineProgress margin="0 0 1.5rem 0" currentStep={2} numberOfSteps={3} />
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
                {...(register('splitDeliveryFee', { required: true }) as any)}
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
          </FormSection>
        </>
      )}
    </>
  )
}
