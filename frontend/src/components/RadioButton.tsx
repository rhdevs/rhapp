import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Radio } from 'antd'

const StyledRadioButton = styled(Radio)<{ color: string; margin?: string }>`
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
  defaultChecked?: boolean
}

export const RadioButton = (props: Props) => {
  const BLUE = '#002642'

  return (
    <StyledRadioButton
      defaultChecked={props.defaultChecked}
      margin={props.margin}
      color={props.color ?? BLUE}
      value={props.value}
    >
      <LabelDiv>{props.label}</LabelDiv>
    </StyledRadioButton>
  )
}
