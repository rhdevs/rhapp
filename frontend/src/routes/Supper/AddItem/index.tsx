import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Controller, DeepMap, FieldError, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { DownOutlined, UpOutlined } from '@ant-design/icons/lib/icons'
import { Radio } from 'antd'
import { RadioButton } from '../../../components/RadioButton'
import { Checkbox } from '../../../components/Checkbox'
import InputRow from '../../../components/Mobile/InputRow'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { RootState } from '../../../store/types'
import { CancelAction, Custom, Food, Option } from '../../../store/supper/types'
import { addFoodToOrder, getMenuFood } from '../../../store/supper/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'

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

const CustomContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CheckboxContainer = styled.div<{ isHidden?: boolean }>`
  display: flex;
  flex-direction: row;
  width: fit-content;
  cursor: pointer;
  height: 30px;
  align-items: center;
  ${(props) => props.isHidden && 'display: none;'};
`

const ViewMoreLessButton = styled.div`
  cursor: default;
  width: fit-content;
  margin: 3px 5px;
`

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const RadioButtonContainer = styled.div<{ isHidden?: boolean }>`
  ${(props) => props.isHidden && 'display: none;'}
  display: flex;
  flex-direction: row;
  height: 25px;
`

const ItemText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
`

const CustomHeaders = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
`

const CustomHeadersContainer = styled.div<{ marginTop?: string }>`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '1.5rem')};
`

const OptionTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const OptionText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
`

const CancelActionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const RedText = styled.text`
  color: #ff4d4f;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  white-space: nowrap;
`

const Spacer = styled.div`
  height: 0.7rem;
`

const SelectText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  padding-bottom: 5px;
`

const SingleOptions = ({
  custom,
  index,
  register,
  clearErrors,
  setValue,
  errors,
  watch,
}: {
  custom: Custom
  index: number
  register
  clearErrors: (name?: string | string[]) => void
  setValue
  errors: DeepMap<CustomData, FieldError>
  watch
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const VIEW_TEXT = isExpanded ? 'View Less' : 'View More'
  const ICON = isExpanded ? (
    <UpOutlined style={{ fontSize: '10px', padding: '3px 5px 3px 3px' }} />
  ) : (
    <DownOutlined style={{ fontSize: '10px', padding: '3px 5px 3px 3px' }} />
  )
  const isCompulsory = custom.min !== 0
  let text: string | undefined = 'Select '
  if (isCompulsory) {
    if ((custom.max ?? 0 > 1) && custom.min !== custom.max) {
      text += `at least ${custom.min} and up to ${custom.max}`
    } else {
      text += `${custom.min}`
    }
  } else {
    if (custom.max) {
      text += `up to ${custom.max}`
    } else {
      text = undefined
    }
  }

  return (
    <CustomContainer key={index}>
      <CustomHeadersContainer marginTop={index === 0 ? '10px' : undefined}>
        <OptionTitleContainer>
          <CustomHeaders>{custom.title}</CustomHeaders>
          {errors[`${custom.title}`] && <RedText> • {custom.min} Required</RedText>}
        </OptionTitleContainer>
        <SelectText>{text}</SelectText>
      </CustomHeadersContainer>
      <OptionContainer>
        {custom.max === 1 && isCompulsory ? (
          <StyledRadioGroup
            {...register(`${custom.title}`, { required: isCompulsory })}
            onChange={(e) => {
              clearErrors(`${custom.title}`)
              setValue(`${custom.title}`, e.target.value)
            }}
            defaultValue={null}
          >
            {custom.options.map((option, index) => {
              return (
                <RadioButtonContainer key={index} isHidden={index >= 3 && !isExpanded}>
                  <RadioButton
                    margin="0 0 0 2px"
                    value={option.name}
                    label={
                      <OptionText>
                        {option.name}
                        {option.price !== 0 && ' (+$' + option.price.toFixed(2) + ')'}
                      </OptionText>
                    }
                  />
                </RadioButtonContainer>
              )
            })}
          </StyledRadioGroup>
        ) : (
          <>
            {custom.options.map((option, index) => (
              <MultipleOptions
                key={index}
                custom={custom}
                isCompulsory={isCompulsory}
                index={index}
                isExpanded={isExpanded}
                option={option}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            ))}
          </>
        )}
        {custom.options.length > 3 && (
          <ViewMoreLessButton onClick={() => setIsExpanded(!isExpanded)}>
            {ICON}
            {VIEW_TEXT}
          </ViewMoreLessButton>
        )}
      </OptionContainer>
    </CustomContainer>
  )
}

const MultipleOptions = ({
  custom,
  isCompulsory,
  index,
  isExpanded,
  option,
  register,
  setValue,
  watch,
}: {
  custom: Custom
  isCompulsory: boolean
  index: number
  isExpanded: boolean
  option: Option
  register
  setValue
  watch
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const isDisabled = custom.max ? (watch(`${custom.title}`) ?? []).length >= custom.max : false
  return (
    <CheckboxContainer
      {...register(`${custom.title}`, { required: isCompulsory })}
      key={index}
      onClick={() => {
        if (isSelected) {
          const newArr: string[] = (watch(`${custom.title}`) as string[])?.filter((i) => i !== option.name)
          setValue(`${custom.title}`, newArr)
          setIsSelected(false)
        } else if (!isDisabled) {
          const newArr: string[] = [option.name].concat(watch(`${custom.title}`) ?? [])
          setValue(`${custom.title}`, newArr)
          setIsSelected(true)
        }
      }}
      isHidden={index >= 3 && !isExpanded}
    >
      <Checkbox margin="auto 10px auto 0" sizePercentage={0.9} isChecked={isSelected} isDisabled={isDisabled} />
      <OptionText>
        {option.name}
        {option.price !== 0 && ' (+$' + option.price.toFixed(2) + ')'}
      </OptionText>
    </CheckboxContainer>
  )
}

type CustomData = Record<string, string | string[] | CancelAction>

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
      const custom: Custom[] = (menuFood?.custom ?? []).map((cf) => {
        const options: Option[] = Object.entries(watch())
          .filter((e) => e[0] !== 'cancelAction' && e[0] !== 'comments')
          .map((entry) => {
            const fieldName = entry[0]
            const fieldDetails = [entry[1]].flat()
            if (cf.title === fieldName) {
              const k = cf.options.map(
                (option) =>
                  fieldDetails.map((fd) => {
                    if (option.name === fd) {
                      return { ...option, isSelected: true }
                    }
                    return { ...option, isSelected: false }
                  })[0],
              )
              return k
            } else {
              console.log(cf.title, fieldName)
              return {} as Option
            }
          })
          .filter(Boolean)
          .flat()
          .filter((k) => k.name !== undefined) //to remove empty Option objects

        return {
          title: cf.title,
          options: options,
          max: cf.max,
          min: cf.min,
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

  const checkFormValidity = () => {
    if (watch('cancelAction')) {
      let count = 0
      compulsoryFields.map((custom) => {
        if (watch(`${custom.title}`) && watch(`${custom.title}`).length >= custom.min) {
          count++
        }
      })
      if (count === compulsoryFields.length) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const calculateAdditionalCost = () => {
    let addOns = 0
    Object.entries(watch()).map((entry) => {
      const fieldName = entry[0]
      const fieldDetails = [entry[1]].flat()
      const originalCustom = menuFood?.custom?.find((custom) => custom.title === fieldName)
      originalCustom?.options.map((option) => {
        fieldDetails?.map((fd) => {
          if (option.name === fd) addOns += option.price
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
            <SingleOptions
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
                  margin="0 0 0 2px"
                  value={CancelAction.REMOVE}
                  label={<OptionText>Remove it from my order</OptionText>}
                />
              </RadioButtonContainer>
              <RadioButtonContainer>
                <RadioButton
                  margin="0 0 0 2px"
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
            isGrey={!checkFormValidity()}
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
