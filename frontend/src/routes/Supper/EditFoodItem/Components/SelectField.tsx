import React, { useState } from 'react'
import styled from 'styled-components'
import { UpOutlined } from '@ant-design/icons/lib/icons'
import { DeepMap, FieldError } from 'react-hook-form'
import { Checkbox } from '../../../../components/Checkbox'
import { Custom, Option } from '../../../../store/supper/types'
import {
  CustomHeaders,
  CustomHeadersContainer,
  OptionText,
  OptionTitleContainer,
  RadioButtonContainer,
  RedText,
  SelectText,
  StyledRadioGroup,
  CheckboxContainer,
} from './StyledComponents'
import { RadioButton } from '../../../../components/RadioButton'
import { CustomData } from '..'

const CustomContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const ViewMoreLessButton = styled.div`
  cursor: default;
  width: fit-content;
  margin: 3px 5px;
`

const SelectHelperText = (isCompulsory: boolean, custom: Custom) => {
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

  return <SelectText>{text}</SelectText>
}

const ViewMoreButton = (
  setIsExpanded: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void },
  isExpanded: boolean,
) => {
  return (
    <ViewMoreLessButton onClick={() => setIsExpanded(!isExpanded)}>
      <UpOutlined
        style={{ fontSize: '10px', padding: '3px 5px 3px 3px', transform: !isExpanded ? 'rotate(180deg)' : 'none' }}
      />
      {isExpanded ? 'Show Less' : 'View More'}
    </ViewMoreLessButton>
  )
}

const SelectField = ({
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
  const isCompulsory = custom.min !== 0

  return (
    <CustomContainer key={index}>
      <CustomHeadersContainer marginTop={index === 0 ? '10px' : '0px'}>
        <OptionTitleContainer>
          <CustomHeaders>{custom.title}</CustomHeaders>
          {errors[`${custom.title}`] && <RedText> • {custom.min} Required</RedText>}
        </OptionTitleContainer>
        {SelectHelperText(isCompulsory, custom)}
      </CustomHeadersContainer>
      <OptionContainer>
        {custom.max === 1 && isCompulsory ? (
          <SingleOptions
            key={index}
            custom={custom}
            isCompulsory={isCompulsory}
            isExpanded={isExpanded}
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
          />
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
        {custom.options.length > 3 && ViewMoreButton(setIsExpanded, isExpanded)}
      </OptionContainer>
    </CustomContainer>
  )
}

const SingleOptions = ({
  custom,
  isCompulsory,
  isExpanded,
  register,
  setValue,
  clearErrors,
}: {
  custom: Custom
  isCompulsory: boolean
  isExpanded: boolean
  register
  setValue
  clearErrors: (name?: string | string[]) => void
}) => {
  return (
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

export default SelectField
