import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { UpOutlined } from '@ant-design/icons/lib/icons'
import { DeepMap, FieldError } from 'react-hook-form'
import { Checkbox } from '../Checkbox'
import { CancelAction, Custom, Option } from '../../store/supper/types'
import { RadioButton } from '../RadioButton'
import { Radio } from 'antd'

export type CustomData = Record<string, string | string[] | CancelAction>

export const CustomHeadersContainer = styled.div<{ marginTop?: string | undefined }>`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '1.5rem')};
`

export const OptionTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const CustomHeaders = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
`

export const RedText = styled.text`
  color: #ff4d4f;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  white-space: nowrap;
`

export const SelectText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  padding-bottom: 5px;
`

export const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const RadioButtonContainer = styled.div<{ isHidden?: boolean }>`
  display: ${(props) => (props.isHidden ? 'none !important' : 'inherit')};
  display: flex;
  flex-direction: row;
  min-height: 25px;
`

export const CheckboxMainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const CheckboxContainer = styled.div<{ isHidden?: boolean }>`
  display: flex;
  flex-direction: row;
  width: fit-content;
  cursor: pointer;
  min-height: 30px;
  align-items: center;
  display: ${(props) => (props.isHidden ? 'none' : 'inherit')};
`

export const OptionText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-size: 14px;
  margin: 0 0 3px 2px;
  word-break: break-word;
`

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

export const FlexDiv = styled.div<{ flex: number }>`
  flex: ${(props) => props.flex}%;
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
      <CustomHeadersContainer marginTop={index === 0 ? '10px' : undefined}>
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
  const selectedOption: string | null = custom.options.filter((option) => option.isSelected)[0]?.name ?? null
  useEffect(() => {
    if (selectedOption) setValue(`${custom.title}`, selectedOption)
  }, [])
  return (
    <StyledRadioGroup
      {...register(`${custom.title}`, { required: isCompulsory })}
      onChange={(e) => {
        clearErrors(`${custom.title}`)
        setValue(`${custom.title}`, e.target.value)
      }}
      defaultValue={selectedOption}
    >
      {custom.options.map((option, index) => {
        return (
          <RadioButtonContainer key={index} isHidden={index >= 3 && !isExpanded}>
            <RadioButton
              margin="0 0 3px 2px"
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
  const [isSelected, setIsSelected] = useState<boolean>(option.isSelected ?? false)
  const isDisabled = custom.max ? (watch(`${custom.title}`) ?? []).length >= custom.max : false

  return (
    <CheckboxMainContainer>
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
        <FlexDiv flex={5}>
          <Checkbox margin="auto 8px auto 0" sizePercentage={0.9} isChecked={isSelected} isDisabled={isDisabled} />
        </FlexDiv>
        <FlexDiv flex={95}>
          <OptionText>
            {option.name}
            {option.price !== 0 && ' (+$' + option.price.toFixed(2) + ')'}
          </OptionText>
        </FlexDiv>
      </CheckboxContainer>
    </CheckboxMainContainer>
  )
}

export default SelectField
