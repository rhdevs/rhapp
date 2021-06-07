import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { RadioButton } from '../../../components/RadioButton'
import InputRow from '../../../components/Mobile/InputRow'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { RootState } from '../../../store/types'
import { CancelAction, Custom, Food, Option } from '../../../store/supper/types'
import { addFoodToOrder, getMenuFood } from '../../../store/supper/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import SelectField from './Components/SelectField'
import {
  CustomHeaders,
  CustomHeadersContainer,
  OptionText,
  OptionTitleContainer,
  RadioButtonContainer,
  RedText,
  SelectText,
  StyledRadioGroup,
} from './Components/StyledComponents'

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

const ItemText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
`

const CancelActionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Spacer = styled.div`
  height: 0.7rem;
`

export type CustomData = Record<string, string | string[] | CancelAction>

const AddItem = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string; orderId: string; foodId: string }>()
  const { register, setValue, handleSubmit, watch, clearErrors, errors, control } = useForm<CustomData>({
    mode: 'all',
    reValidateMode: 'onChange',
  })
  const { menuFood, isLoading, count } = useSelector((state: RootState) => state.supper)
  const compulsoryFields: Custom[] =
    menuFood?.custom?.filter((custom) => {
      return custom.min !== 0
    }) ?? []

  useEffect(() => {
    dispatch(getMenuFood(params.foodId))
  }, [dispatch])

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit((data) => {
      const custom: Custom[] = (menuFood?.custom ?? []).map((customFood) => {
        const options: Option[] = Object.entries(watch())
          .filter((e) => e[0] !== 'cancelAction' && e[0] !== 'comments')
          .flatMap((entry) => {
            const fieldName = entry[0]
            const fieldDetails = [entry[1]].flat()
            if (customFood.title === fieldName) {
              const k = customFood.options.map(
                (option) =>
                  fieldDetails.map((fieldDetail) => {
                    const isSelected = option.name === fieldDetail ? true : false
                    return { ...option, isSelected: isSelected }
                  })[0],
              )
              return k
            } else {
              console.log(customFood.title, fieldName)
              return {} as Option
            }
          })
          .filter(Boolean)
          .filter((k) => k.name !== undefined) //to remove empty Option objects

        console.log(options)
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
      //TODO: TEST Send new food to backend
      dispatch(addFoodToOrder(newFood, params.orderId))
      history.push(`${PATHS.USER_SUPPER_GROUP_PLACE_ORDER}/${params.supperGroupId}/${menuFood?.restaurantId}/order`)
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
      const originalCustom = menuFood?.custom?.find((custom) => custom.title === fieldName)
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
          <ItemText>{menuFood?.foodMenuName}</ItemText>
          {menuFood?.custom?.map((custom, index) => (
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
          <CancelActionContainer>
            <CustomHeadersContainer>
              <OptionTitleContainer>
                <CustomHeaders>If this product is not available</CustomHeaders>
                {errors.cancelAction && <RedText> • 1 Required</RedText>}
              </OptionTitleContainer>
              <SelectText>Select 1</SelectText>
            </CustomHeadersContainer>
            <StyledRadioGroup
              {...register('cancelAction', { required: true })}
              onChange={(e) => {
                clearErrors('cancelAction')
                setValue('cancelAction', e.target.value as CancelAction)
              }}
              defaultValue={null}
            >
              <RadioButtonContainer>
                <RadioButton
                  margin="0 0 3px 2px"
                  value={CancelAction.REMOVE}
                  label={<OptionText>Remove it from my order</OptionText>}
                />
              </RadioButtonContainer>
              <RadioButtonContainer>
                <RadioButton
                  margin="0 0 3px 2px"
                  value={CancelAction.CONTACT}
                  label={<OptionText>Contact me </OptionText>}
                />
              </RadioButtonContainer>
            </StyledRadioGroup>
          </CancelActionContainer>
          <Controller
            name="comments"
            render={({ onChange, value }) => (
              <InputRow
                placeholder="Additional comments e.g. BBQ Sauce"
                textarea
                value={value}
                onChange={onChange}
                {...register('comments')}
              />
            )}
            control={control}
            defaultValue={null}
          />
          <Spacer />
          <QuantityTracker center min={1} default={1} />
          <Spacer />
          <AddUpdateCartButton
            isGrey={!isFormFieldsValid()}
            htmlType="submit"
            add
            currentTotal={String((((menuFood?.price ?? 0) + calculateAdditionalCost()) * count).toFixed(2))}
          />
        </MainContainer>
      )}
    </Background>
  )
}

export default AddItem
