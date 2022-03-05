import React from 'react'
import { FieldError } from 'react-hook-form/dist/types/errors'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { CancelAction } from '../../store/supper/types'
import { RootState } from '../../store/types'
import LoadingSpin from '../LoadingSpin'
import { RadioButton } from '../RadioButton'
import {
  CustomHeaders,
  CustomHeadersContainer,
  OptionText,
  OptionTitleContainer,
  RadioButtonContainer,
  RedText,
  SelectText,
  StyledRadioGroup,
} from './SelectField'

const CancelActionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

type Props = {
  cancelActionError: FieldError | FieldError[]
  register
  clearErrors: (name?: string | string[]) => void
  setValue
  defaultValue?: CancelAction | undefined
}

const CancelActionField = (props: Props) => {
  const { isLoading } = useSelector((state: RootState) => state.supper)
  return (
    <>
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <CancelActionContainer>
          <CustomHeadersContainer>
            <OptionTitleContainer>
              <CustomHeaders>If this product is not available</CustomHeaders>
              {props.cancelActionError && <RedText> • 1 Required</RedText>}
            </OptionTitleContainer>
            <SelectText>Select 1</SelectText>
          </CustomHeadersContainer>
          <StyledRadioGroup
            {...props.register('cancelAction', { required: true })}
            onChange={(e) => {
              props.clearErrors('cancelAction')
              props.setValue('cancelAction', e.target.value as CancelAction)
            }}
            defaultValue={props.defaultValue ?? null}
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
                label={<OptionText>Contact me</OptionText>}
              />
            </RadioButtonContainer>
          </StyledRadioGroup>
        </CancelActionContainer>
      )}
    </>
  )
}

export default CancelActionField
