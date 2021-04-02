import React from 'react'

import { Progress } from 'antd'
import styled from 'styled-components'

const TextContainer = styled.text`
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`
const SubTextContainer = styled.text`
  font-size: 15px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.65);
`

type Props = {
  amountLeft: number
  percent: number
}

export const RoundProgress = (props: Props) => {
  return (
    <Progress
      format={() => {
        return (
          <>
            <TextContainer>
              ${props.amountLeft}
              <br />
            </TextContainer>
            <SubTextContainer>left</SubTextContainer>
          </>
        )
      }}
      type="circle"
      percent={props.percent}
      width={80}
      strokeColor="#DE5F4C"
    />
  )
}
