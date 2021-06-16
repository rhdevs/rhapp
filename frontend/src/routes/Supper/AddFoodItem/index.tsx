import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { RootState } from '../../../store/types'
import { CancelAction, Custom, Food, Option } from '../../../store/supper/types'
import { addFoodToOrder, getMenuFood, getSupperGroupById } from '../../../store/supper/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import SelectField from '../../../components/Supper/SelectField'
import useSnackbar from '../../../hooks/useSnackbar'
import CancelActionField from '../../../components/Supper/CancelActionField'

const Background = styled.form`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
`

const MainContainer = styled.div`
  width: 80vw;
  margin: 0 auto;
`

const FoodItemHeader = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
`

type CustomData = Record<string, string | string[] | CancelAction>

const AddFoodItem = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string; orderId: string; foodId: string }>()
  const { register, setValue, handleSubmit, watch, clearErrors, errors, control } = useForm<CustomData>({
    mode: 'all',
    reValidateMode: 'onChange',
  })
  const { supperGroup, foodMenu, isLoading, count } = useSelector((state: RootState) => state.supper)
  const compulsoryFields: Custom[] =
    foodMenu?.custom?.filter((custom) => {
      return custom.min !== 0
    }) ?? []

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getMenuFood(params.foodId))
  }, [dispatch])

  const isOverSupperGroupLimit = () => {
    const maximumLimit = supperGroup?.costLimit ?? 0
    const currentSupperGroupCost = supperGroup?.currentFoodCost ?? 0
    const currentFoodItemPrice = ((foodMenu?.price ?? 0) + calculateAdditionalCost()) * count ?? 0

    const newSupperGroupCost = currentSupperGroupCost + currentFoodItemPrice

    return (newSupperGroupCost > maximumLimit) as boolean
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (isOverSupperGroupLimit()) {
      const [error] = useSnackbar('error')
      error('Supper group price limit exceeded, unable to add item.')
      return
    }

    handleSubmit((data) => {
      const custom: Custom[] = (foodMenu?.custom ?? []).map((customFood) => {
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
        restaurantId: foodMenu?.restaurantId ?? '',
        foodMenuId: foodMenu?.foodMenuId ?? '',
        foodName: foodMenu?.foodMenuName ?? '',
        comments: data.comments as string,
        quantity: count,
        price: foodMenu?.price ?? 0,
        foodPrice: ((foodMenu?.price ?? 0) + calculateAdditionalCost()) * count,
        cancelAction: data.cancelAction as CancelAction,
        custom: custom,
      }
      console.log(newFood)
      //TODO: TEST Send new food to backend
      dispatch(addFoodToOrder(newFood, params.orderId))
      history.push(`${PATHS.PLACE_ORDER}/${params.supperGroupId}/${foodMenu?.restaurantId}/order`)
      console.log(data, count)
    })()
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

  const calculateAdditionalCost = () => {
    let addOns = 0
    Object.entries(watch()).map((entry) => {
      const fieldName = entry[0]
      const fieldDetails = [entry[1]].flat()
      const originalCustom = foodMenu?.custom?.find((custom) => custom.title === fieldName)
      originalCustom?.options.map((option) => {
        fieldDetails?.map((fieldDetail) => {
          if (option.name === fieldDetail) addOns += option.price
        })
      })
    })
    return addOns
  }

  return (
    <Background onSubmit={onSubmit}>
      <TopNavBar title="Add Item" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <MainContainer>
          <FoodItemHeader>{foodMenu?.foodMenuName}</FoodItemHeader>
          {foodMenu?.custom?.map((custom, index) => (
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
          <CancelActionField
            cancelActionError={errors.cancelAction}
            register={register}
            clearErrors={clearErrors}
            setValue={setValue}
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
            defaultValue={null}
          />
          <QuantityTracker margin="0.7rem 0" center min={1} default={1} />
          <AddUpdateCartButton
            isGrey={!isFormFieldsValid()}
            htmlType="submit"
            add
            currentTotal={String((((foodMenu?.price ?? 0) + calculateAdditionalCost()) * count).toFixed(2))}
          />
        </MainContainer>
      )}
    </Background>
  )
}

export default AddFoodItem
