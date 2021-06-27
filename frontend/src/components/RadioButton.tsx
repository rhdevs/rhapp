import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Radio } from 'antd'
import { V1_BLUE } from '../common/colours'

const StyledRadioButton = styled(Radio)<{ color: string | undefined; margin?: string | undefined }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 25px;
  ${(props) => `.ant-radio-checked, .ant-radio-inner {
    border-color: ${props.color} !important ;
  }

  .ant-radio-checked .ant-radio-inner:after {
    background-color: ${props.color};
  }

  .ant-radio:hover .ant-radio-inner {
    border-color: ${props.color};
  }
  ${props.margin && `margin: ${props.margin}`}
  `}
`

const LabelDiv = styled.div`
  width: 100%;
  white-space: pre-wrap;
`

type Props = {
  value: string
  label?: string | ReactElement
  color?: string
  margin?: string
}

export const RadioButton = (props: Props) => {
  return (
    <StyledRadioButton margin={props.margin} color={props.color ?? V1_BLUE} value={props.value}>
      <LabelDiv>{props.label}</LabelDiv>
    </StyledRadioButton>
  )
}
