import React from 'react'

import { Progress } from 'antd'
import styled from 'styled-components'

const TextContainer = styled.text<{ fontSize?: string }>`
  font-size: ${(props) => props.fontSize ?? '20px'};
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`

const SubTextContainer = styled.text<{ fontSize?: string }>`
  font-size: ${(props) => props.fontSize ?? '15px'};
  font-weight: 300;
  color: rgba(0, 0, 0, 0.65);
`

type Props = {
  amountLeft: number
  percent: number
  width?: number
  moneyFontSize?: string
  textFontSize?: string
}

export const RoundProgress = (props: Props) => {
  return (
    <Progress
      format={() => {
        return (
          <>
            <TextContainer fontSize={props.moneyFontSize}>
              ${props.amountLeft}
              <br />
            </TextContainer>
            <SubTextContainer fontSize={props.textFontSize}>left</SubTextContainer>
          </>
        )
      }}
      type="circle"
      percent={props.percent}
      width={props.width ?? 80}
      strokeColor="#DE5F4C"
    />
  )
}
