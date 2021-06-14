import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { MainCard } from '../../../components/Supper/MainCard'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { getEditFoodItem, getMenuFood } from '../../../store/supper/action'
import { CancelAction, Custom, Food, Option } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import SelectField from '../../../components/Supper/SelectField'
import useSnackbar from '../../../hooks/useSnackbar'
import CancelActionField from '../../../components/Supper/CancelActionField'
import InputRow from '../../../components/Mobile/InputRow'

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

  const { isLoading, editFoodItem, menuFood, count, supperGroup } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string; foodId: string }>()
  const { register, handleSubmit, setValue, watch, clearErrors, control, errors } = useForm<CustomData>()
  const compulsoryFields: Custom[] =
    menuFood?.custom?.filter((custom) => {
      return custom.min !== 0
    }) ?? []

  const isOverSupperGroupLimit = () => {
    const maximumLimit = supperGroup?.costLimit ?? 0
    const currentSupperGroupCost = supperGroup?.currentFoodCost ?? 0
    const currentFoodItemPrice = ((menuFood?.price ?? 0) + calculateAdditionalCost()) * count
    const originalFoodItemPrice = editFoodItem?.price ?? 0

    const newSupperGroupCost = currentSupperGroupCost - originalFoodItemPrice + currentFoodItemPrice

    return (newSupperGroupCost > maximumLimit) as boolean
  }

  const calculateAdditionalCost = () => {
    let addOns = 0
    Object.entries(watch()).map((entry) => {
      const fieldName = entry[0]
      const fieldDetails = [entry[1]].flat()
      const originalCustom = menuFood?.custom?.find((custom) => custom.title === fieldName)
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
    console.log(isOverSupperGroupLimit(), count)
    if (isOverSupperGroupLimit()) {
      const [error] = useSnackbar('error')
      error('Supper group price limit exceeded, unable to add item.')
      return
    }

    handleSubmit((data: Food) => {
      const custom: Custom[] = (menuFood?.custom ?? []).map((customFood) => {
        const options: Option[] = Object.entries(watch())
          .filter((e) => e[0] !== 'cancelAction' && e[0] !== 'comments') //to not add to custom
          .flatMap((entry) => {
            const fieldName = entry[0]
            const fieldDetails = [entry[1]].flat()
            if (customFood.title === fieldName) {
              return customFood.options.map(
                (option) =>
                  fieldDetails.map((fieldDetail) => {
                    const isSelected = (option.name === fieldDetail) as boolean
                    return { ...option, isSelected: isSelected }
                  })[0],
              )
            } else {
              return {} as Option
            }
          })
          .filter((k) => k.name !== undefined) //to remove empty Option objects

        return {
          title: customFood.title,
          options: options,
          max: customFood.max,
          min: customFood.min,
        }
      })

      const newFood: Food = {
        restaurantId: menuFood?.restaurantId ?? '',
        foodMenuId: menuFood?.foodMenuId ?? '',
        foodName: menuFood?.foodMenuName ?? '',
        comments: data.comments as string,
        quantity: count,
        price: menuFood?.price ?? 0,
        foodPrice: ((menuFood?.price ?? 0) + calculateAdditionalCost()) * count,
        cancelAction: data.cancelAction as CancelAction,
        custom: custom,
      }
      console.log(newFood)
      //TODO: Send info to backend and test
      //dispatch(updateEditFoodItem(data, params.foodId))
      // history.push(`${PATHS.PLACE_ORDER}/${params.supperGroupId}/${menuFood?.restaurantId}/order`)
      console.log(data, count)
    })()
  }

  useEffect(() => {
    dispatch(getEditFoodItem(params.supperGroupId, params.foodId))
    dispatch(getMenuFood(params.foodId))
  }, [dispatch])

  console.log(watch())
  return (
    <MainContainer onSubmit={onSubmit}>
      <TopNavBar title="Edit Item" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <MainCard flexDirection="column" padding="21px" margin="0 23px 23px">
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
          <CancelActionField
            cancelActionError={errors.cancelAction}
            register={register}
            clearErrors={clearErrors}
            setValue={setValue}
            defaultValue={editFoodItem?.cancelAction}
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
            defaultValue={editFoodItem?.comments ?? null}
          />
          <QuantityTracker margin="0.7rem 0" default={editFoodItem?.quantity ?? 1} center min={1} />
          <AddUpdateCartButton
            isGrey={!isFormFieldsValid()}
            htmlType="submit"
            update
            currentTotal={String((((menuFood?.price ?? 0) + calculateAdditionalCost()) * count).toFixed(2))}
          />
        </MainCard>
      )}
    </MainContainer>
  )
}

export default EditFoodItem