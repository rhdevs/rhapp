import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { MainCard } from '../../../components/Supper/MainCard'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { getFoodInOrder, resetFoodState, updateFoodInOrder } from '../../../store/supper/action'
import { CancelAction, Custom, Food, Option } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import SelectField from '../../../components/Supper/SelectField'
import useSnackbar from '../../../hooks/useSnackbar'
import CancelActionField from '../../../components/Supper/CancelActionField'
import InputRow from '../../../components/Mobile/InputRow'
import { PATHS } from '../../Routes'

const MainContainer = styled.form`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  display: flex;
  flex-direction: column;
`

const FoodItemHeader = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
`

type CustomData = Record<string, string | string[] | CancelAction>

const EditFoodItem = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { isLoading, food, count, supperGroup } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string; orderId: string; foodId: string }>()
  const { register, handleSubmit, setValue, watch, clearErrors, reset, control, errors } = useForm<CustomData>({
    shouldUnregister: false,
  })
  const compulsoryFields: Custom[] =
    food?.custom?.filter((custom) => {
      return custom.min !== 0
    }) ?? []

  const isOverSupperGroupLimit = () => {
    const maximumLimit = supperGroup?.costLimit
    if (!maximumLimit) return false
    const currentSupperGroupCost = supperGroup?.currentFoodCost ?? 0
    const currentFoodItemPrice = ((food?.price ?? 0) + calculateAdditionalCost()) * count
    const originalFoodItemPrice = food?.price ?? 0

    const newSupperGroupCost = currentSupperGroupCost - originalFoodItemPrice + currentFoodItemPrice

    return (newSupperGroupCost > maximumLimit) as boolean
  }

  const calculateAdditionalCost = () => {
    let addOns = 0
    Object.entries(watch()).map((entry) => {
      const fieldName = entry[0]
      const fieldDetails = [entry[1]].flat()
      const originalCustom = food?.custom?.find((custom) => custom.title === fieldName)
      originalCustom?.options.map((option) => {
        fieldDetails?.map((fieldDetail) => {
          if (option.name === fieldDetail) addOns += option.price
        })
      })
    })
    return addOns
  }

  const isFormFieldsValid = () => {
    if (watch('cancelAction')) {
      const satisfiedFields = compulsoryFields.filter(
        (customField) => watch(`${customField.title}`) && watch(`${customField.title}`).length >= customField.min,
      )
      if (satisfiedFields.length === compulsoryFields.length) return true
    }

    return false
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (isOverSupperGroupLimit()) {
      const [error] = useSnackbar('error')
      error('Supper group price limit exceeded, unable to add item.')
      return
    }

    handleSubmit((data: Food) => {
      const initialFoodInfo = food
      let updatedFoodInfo
      if (initialFoodInfo?.comments !== data.comments) {
        updatedFoodInfo = { ...updatedFoodInfo, comments: data.comments as string }
      }
      if (initialFoodInfo?.quantity !== count) {
        updatedFoodInfo = { ...updatedFoodInfo, quantity: count }
      }
      const newFoodPrice = ((food?.price ?? 0) + calculateAdditionalCost()) * count
      if (initialFoodInfo?.foodPrice !== newFoodPrice) {
        updatedFoodInfo = { ...updatedFoodInfo, foodPrice: newFoodPrice }
      }
      if (initialFoodInfo?.cancelAction !== (data.cancelAction as CancelAction)) {
        updatedFoodInfo = { ...updatedFoodInfo, cancelAction: data.cancelAction as CancelAction }
      }

      const updatedCustom: Custom[] = []
      //convert data from watch to [ [[option title], [option's details]] , ...]
      let formData = Object.entries(watch())
      formData = formData.filter((entry) => entry[0] !== 'cancelAction' && entry[0] !== 'comments') //remove cancelAction and comments details
      formData.forEach((custom) => {
        const optionTitle = custom[0]
        /* Convert data array with indiv option names
         * eg: "Contact" => ["Contact"]
         * eg: ["Remove Shredded Lettuce", "Remove McSpicy Patty"] => ["Remove Shredded Lettuce", "Remove McSpicy Patty"]
         */
        const optionDetails = [custom[1]].flat()
        const initialOptionDetail = initialFoodInfo?.custom?.find((initCustom) => initCustom.title === optionTitle)
        // Convert initial options to array of selected names => ["selectedOptionName1", "selectedOptionName2", ...]
        const selectedInitialOptions = initialOptionDetail?.options
          ?.map((option) => {
            if (option.isSelected) return option.name
          })
          ?.filter(Boolean) as string[] // to remove falsy values
        if (!selectedInitialOptions) return

        // Get names of fields that are were updated (ie difference between both arrays)
        const fieldDifference1 = optionDetails.filter((x) => !selectedInitialOptions.includes(x))
        const fieldDifference2 = selectedInitialOptions.filter((x) => !optionDetails.includes(x))
        if (!(fieldDifference1.length || fieldDifference2.length)) return
        const fieldDifference = fieldDifference1.concat(fieldDifference2)

        let options: Option[] = []
        let chosenCustom
        // Collate updated options
        fieldDifference.forEach((name, index) => {
          const chosenOption = initialOptionDetail?.options.find((initOption) => initOption.name === name)
          if (!chosenOption) return
          if (chosenOption?.isSelected && !optionDetails.includes(chosenOption.name)) {
            //if option was selected previously and not in the chosen options
            const updatedOption = { ...chosenOption, isSelected: false }
            options.push(updatedOption)
          } else if (!chosenOption?.isSelected && optionDetails.includes(chosenOption.name)) {
            //if option was not selected previously and is in the chosen options
            const updatedOption = { ...chosenOption, isSelected: true }
            options.push(updatedOption)
          }
          //keep all unchanged options
          if (index + 1 === fieldDifference.length) {
            const unchangedOptions = initialOptionDetail?.options.filter(
              (option) => !fieldDifference.includes(option.name),
            )
            options = options.concat(unchangedOptions ?? [])
          }
          // Original custom that has been updated by user
          chosenCustom = initialFoodInfo?.custom?.find((custom) =>
            custom.options.find((option) => option.name === name),
          )
          if (!chosenCustom) return
        })
        // Push collated options into custom
        const optionCustom = { ...chosenCustom, options: options }
        updatedCustom.push(optionCustom)
      })
      if (updatedCustom.length) {
        updatedFoodInfo = { ...updatedFoodInfo, custom: updatedCustom }
      }

      console.log(updatedFoodInfo)
      //TODO: Test update food, currently it deletes the options?!
      dispatch(updateFoodInOrder(updatedFoodInfo, params.orderId, params.foodId))
      history.push(`${PATHS.PLACE_ORDER}/${params.supperGroupId}/${food?.restaurantId}/order`)
    })()
  }

  useEffect(() => {
    dispatch(resetFoodState())
    dispatch(getFoodInOrder(params.orderId, params.foodId))
  }, [dispatch])

  useEffect(() => {
    if (food) {
      const initialFormData = {
        comments: food?.comments,
        cancelAction: food?.cancelAction,
      }
      food.custom?.forEach((custom) => {
        const selectedOptions = custom.options.filter((option) => option.isSelected)
        if (selectedOptions) {
          //add `'title': ['value1', 'value2',...]` to object (dynamically)
          initialFormData[custom.title] = selectedOptions.map((option) => option.name)
        }
      })
      reset(initialFormData)
    }
  }, [food, reset])

  return (
    <MainContainer onSubmit={onSubmit}>
      <TopNavBar title="Edit Item" />
      {isLoading || !food ? (
        <LoadingSpin />
      ) : (
        <MainCard flexDirection="column" padding="21px" margin="0 23px 23px">
          <FoodItemHeader>{food?.foodName}</FoodItemHeader>
          <>
            {food?.custom?.map((custom, index) => (
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

          <CancelActionField
            cancelActionError={errors.cancelAction}
            register={register}
            clearErrors={clearErrors}
            setValue={setValue}
            defaultValue={food?.cancelAction as CancelAction}
          />
          <Controller
            name="comments"
            render={({ onChange, value }) => (
              <InputRow
                placeholder="Additional comments / Alternative orders e.g. BBQ Sauce"
                textarea
                value={value}
                onChange={onChange}
                {...register('comments')}
              />
            )}
            control={control}
            defaultValue={food?.comments ?? null}
          />
          <QuantityTracker margin="0.7rem 0" default={food?.quantity ?? 1} center min={1} />
          <AddUpdateCartButton
            isGrey={!isFormFieldsValid()}
            htmlType="submit"
            update
            currentTotal={String((((food?.price ?? 0) + calculateAdditionalCost()) * count).toFixed(2))}
          />
        </MainCard>
      )}
    </MainContainer>
  )
}

export default EditFoodItem
