import { Radio } from 'antd'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { RadioButton } from '../../../components/RadioButton'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { MainCard } from '../../../components/Supper/MainCard'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { getEditFoodItem, updateEditFoodItem } from '../../../store/supper/action'
import { CancelAction, Food } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import SelectField from '../../../components/Supper/SelectField'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  display: flex;
  flex-direction: column;
`
const FoodItemHeader = styled.p`
  font-weight: bold;
  font-size: 24px;
  line-height: 14px;
`

const SectionHeader = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const Spacer = styled.div`
  height: 24px;
`

const TextInput = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const RadioButtonContainer = styled.div<{ isHidden?: boolean }>`
  display: ${(props) => (props.isHidden ? 'none !important' : 'inherit')};
  display: flex;
  flex-direction: row;
  height: 25px;
`

type HardCodedFormValues = {
  Sides: string
  Drinks: string
  others: string
  comments: string
  quantity: number
  cancelAction: string
}

type FormValues = Record<string, string | string[] | HardCodedFormValues>
export type CustomData = Record<string, string | string[] | CancelAction>

const EditFoodItem = () => {
  const dispatch = useDispatch()

  const { isLoading, editFoodItem, count, supperGroup } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string; itemId: string }>()
  const { register, handleSubmit, setValue, watch, clearErrors, errors } = useForm<FormValues>()
  const onSubmit = () => {
    console.log(count)
    handleSubmit((data: Food) => {
      console.log('Save changes!')
      console.log(data)
      dispatch(updateEditFoodItem(data, params.itemId))
    })()
  }

  const isOverSupperGroupLimit = () => {
    const maximumLimit = supperGroup?.costLimit
    const currentSupperGroupCost = supperGroup?.currentFoodCost as number
    const currentFoodItemPrice = editFoodItem?.foodPrice as number
    const originalFoodItemPrice = editFoodItem?.price as number

    if (!maximumLimit) return false

    // TODO: verify conditions
    const isOverLimit = maximumLimit - (currentSupperGroupCost - originalFoodItemPrice + currentFoodItemPrice)
    return isOverLimit > 0
  }

  useEffect(() => {
    dispatch(getEditFoodItem(params.supperGroupId, params.itemId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar title="Edit Item" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <MainCard flexDirection="column" isEditable={false} editIconSize="0rem" padding="25px">
          <FoodItemHeader>{editFoodItem?.foodName}</FoodItemHeader>
          <>
            {editFoodItem?.custom?.map((custom, index) => (
              <SelectField
                custom={custom}
                index={index}
                key={index}
                register={register}
                clearErrors={clearErrors}
                setValue={setValue}
                errors={errors}
                watch={watch}
              />
            ))}
          </>
          <br />
          <SectionHeader>If this product is not available</SectionHeader>
          <StyledRadioGroup
            {...register(`cancelAction`, { required: true })}
            onChange={(e) => {
              clearErrors(`cancelAction`)
              setValue(`cancelAction`, e.target.value)
            }}
            defaultValue={'Contact'}
          >
            <RadioButtonContainer key={'Contact'}>
              <RadioButton margin="0 0 0 2px" value={CancelAction.CONTACT} label={'Contact me '} />
            </RadioButtonContainer>
            <RadioButtonContainer key={'Cancel'}>
              <RadioButton margin="0 0 0 2px" value={CancelAction.REMOVE} label={'Remove it from my order'} />
            </RadioButtonContainer>
          </StyledRadioGroup>

          <Spacer />

          <TextInput
            defaultValue={editFoodItem?.comments || ''}
            {...register('comments')}
            placeholder="Additional comments e.g. BBQ Sauce"
          />
          <Spacer />
          <QuantityTracker default={editFoodItem?.quantity || count} center={true} />
          <Spacer />
          <AddUpdateCartButton
            onClick={onSubmit}
            update
            currentTotal={editFoodItem?.foodPrice?.toString() || '0.00'}
            isDisabled={isOverSupperGroupLimit()}
          />
        </MainCard>
      )}
    </MainContainer>
  )
}

export default EditFoodItem
