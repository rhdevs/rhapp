import React from 'react'
import styled from 'styled-components'

import { Radio } from 'antd'

const StyledRadioButton = styled(Radio)<{ color: string; margin?: string }>`
  ${(props) => `.ant-radio-checked .ant-radio-inner {
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

type Props = {
  value: string
  label?: string
  color?: string
  margin?: string
}

export const RadioButton = (props: Props) => {
  const BLUE = '#002642'

  return (
    <StyledRadioButton margin={props.margin} color={props.color ?? BLUE} value={props.value}>
      {props.label}
    </StyledRadioButton>
  )
}
