import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { DownOutlined, UpOutlined } from '@ant-design/icons/lib/icons'
import { Radio } from 'antd'
import { RadioButton } from '../../../components/RadioButton'
import { foodItemStub } from '../../../store/stubs'
import { Checkbox } from '../../../components/Checkbox'
import { CancelAction } from '../../../store/supper/types'
import { Controller, useForm } from 'react-hook-form'
import InputRow from '../../../components/Mobile/InputRow'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { getMenuFood } from '../../../store/supper/action'
import { useParams } from 'react-router-dom'

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

const CustomHeaders = styled.text<{ marginTop?: string }>`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '1.5rem')};
`

const OptionText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
`

const CancelActionContainer = styled.div`
  margin: 1.5rem 0;
`

const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
`

const Spacer = styled.div`
  height: 0.7rem;
`

/**
export const foodItemStub: FoodMenu = {
  foodMenuId: 'snm',
  restaurantId: 'mdn',
  foodMenuName: 'Spicy McNuggets Meal',
  price: 7.5,
  custom: [
    {
      title: 'Sides',
      options: [{ name: 'fries', price: 0 }],
      min: 1,
      max: 1,
      customNumber: 1,
    },
  ],
  section: 'Upsized Value Meals',
}
import { Checkbox } from 'antd';

    <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} />

<StyledRadioGroup
            {...register('splitDeliveryFee', { required: true })}
            onChange={(e) => {
              clearErrors('splitDeliveryFee')
              setValue('splitDeliveryFee', e.target.value)
            }}
            defaultValue={supperGroup?.splitAdditionalCost}
          >
 */
const { Text } = Typography

const StyledText = styled(Text)`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
`

type CustomData = Record<string, string | string[] | CancelAction>

const AddItem = () => {
  const dispatch = useDispatch()
  const params = useParams<{ orderId: string; foodId: string }>()
  const { register, setValue, handleSubmit, watch, clearErrors, errors, control } = useForm<CustomData>()
  const RedAsterisk = <RedText>*</RedText>
  const { count, menuFood } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(getMenuFood(params.foodId))
    console.log(menuFood)
  }, [dispatch])

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit((data) => {
      console.log(data, count)
    })()
  }
  return (
    <Background onSubmit={onSubmit}>
      <TopNavBar title="Add Item" />
      <MainContainer>
        <ItemText>{foodItemStub.foodMenuName}</ItemText>
        {foodItemStub.custom?.map((custom, index) => {
          const [isExpanded, setIsExpanded] = useState<boolean>(false)
          const VIEW_TEXT = isExpanded ? 'View Less' : 'View More'
          const ICON = isExpanded ? (
            <UpOutlined style={{ fontSize: '10px', padding: '3px 5px 3px 3px' }} />
          ) : (
            <DownOutlined style={{ fontSize: '10px', padding: '3px 5px 3px 3px' }} />
          )
          const isCompulsory = custom.min === 1
          return (
            <CustomContainer key={index}>
              <CustomHeaders marginTop={index === 0 ? '10px' : undefined}>
                {custom.title}
                {isCompulsory && RedAsterisk} {(custom.max ?? 0) > 1 && <StyledText mark>Max {custom.max}</StyledText>}
              </CustomHeaders>
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
                            label={<OptionText>{option.name}</OptionText>}
                          />
                        </RadioButtonContainer>
                      )
                    })}
                  </StyledRadioGroup>
                ) : (
                  <>
                    {custom.options.map((option, index) => {
                      const [isSelected, setIsSelected] = useState<boolean>(false)
                      const isDisabled = custom.max ? (watch(`${custom.title}`) ?? []).length >= custom.max : false
                      return (
                        <CheckboxContainer
                          {...register(`${custom.title}`, { required: isCompulsory })}
                          key={index}
                          onClick={() => {
                            if (isSelected) {
                              const newArr: string[] = (watch(`${custom.title}`) as string[])?.filter(
                                (i) => i !== option.name,
                              )
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
                          <Checkbox
                            margin="auto 10px auto 0"
                            sizePercentage={0.9}
                            isChecked={isSelected}
                            isDisabled={isDisabled}
                          />
                          <OptionText>{option.name}</OptionText>
                        </CheckboxContainer>
                      )
                    })}
                  </>
                )}
                {custom.options.length > 3 && (
                  <ViewMoreLessButton onClick={() => setIsExpanded(!isExpanded)}>
                    {ICON}
                    {VIEW_TEXT}
                  </ViewMoreLessButton>
                )}
                {errors[`${custom.title}`] && <RedText>ERROR</RedText>}
              </OptionContainer>
            </CustomContainer>
          )
        })}
        <CancelActionContainer>
          <CustomHeaders>If this product is not available{RedAsterisk}</CustomHeaders>
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
                value={CancelAction.CANCEL}
                label={<OptionText>Cancel my entire order</OptionText>}
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
          {errors.cancelAction && <RedText>ERROR</RedText>}
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
        <AddUpdateCartButton htmlType="submit" add currentTotal="7.90" />
      </MainContainer>
    </Background>
  )
}

export default AddItem
