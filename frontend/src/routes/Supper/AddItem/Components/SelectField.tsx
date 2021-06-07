import React, { useState } from 'react'
import styled from 'styled-components'
import { DownOutlined, UpOutlined } from '@ant-design/icons/lib/icons'
import { DeepMap, FieldError } from 'react-hook-form'
import { Checkbox } from '../../../../components/Checkbox'
import { CancelAction, Custom, Option } from '../../../../store/supper/types'
import {
  CustomHeaders,
  CustomHeadersContainer,
  OptionText,
  OptionTitleContainer,
  RadioButtonContainer,
  RedText,
  SelectText,
  StyledRadioGroup,
} from './StyledComponents'
import { RadioButton } from '../../../../components/RadioButton'

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

type CustomData = Record<string, string | string[] | CancelAction>

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

export default SingleOptions
