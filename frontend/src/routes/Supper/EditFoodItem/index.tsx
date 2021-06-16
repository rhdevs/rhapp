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
import { getFoodInOrder, updateFoodInOrder } from '../../../store/supper/action'
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
    const maximumLimit = supperGroup?.costLimit ?? 0
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
    console.log(isOverSupperGroupLimit(), count)
    if (isOverSupperGroupLimit()) {
      const [error] = useSnackbar('error')
      error('Supper group price limit exceeded, unable to add item.')
      return
    }

    handleSubmit((data: Food) => {
      const custom: Custom[] = (food?.custom ?? []).map((customFood) => {
        const options: Option[] = Object.entries(watch())
          .filter((e) => e[0] !== 'cancelAction' && e[0] !== 'comments') //to not add to custom
          .flatMap((entry) => {
            const fieldName = entry[0]
            const fieldDetails = [entry[1]].flat()
            if (customFood.title === fieldName) {
              return customFood.options.map((option) => {
                const isSelected = fieldDetails.find((fieldDetail) => fieldDetail === option.name) !== undefined
                return { ...option, isSelected: isSelected }
              })
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
        restaurantId: food?.restaurantId ?? '',
        foodMenuId: food?.foodMenuId ?? '',
        foodName: food?.foodName ?? '',
        comments: data.comments as string,
        quantity: count,
        price: food?.price ?? 0,
        foodPrice: ((food?.price ?? 0) + calculateAdditionalCost()) * count,
        cancelAction: data.cancelAction as CancelAction,
        custom: custom,
      }
      console.log(newFood)
      //TODO: Send info to backend and test
      dispatch(updateFoodInOrder(newFood, params.orderId, params.foodId))
      history.push(`${PATHS.PLACE_ORDER}/${params.supperGroupId}/${food?.restaurantId}/order`)
    })()
  }

  useEffect(() => {
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
      {isLoading ? (
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
          <>
            {food?.cancelAction && (
              <CancelActionField
                cancelActionError={errors.cancelAction}
                register={register}
                clearErrors={clearErrors}
                setValue={setValue}
                defaultValue={food?.cancelAction as CancelAction}
              />
            )}
          </>
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
