import React from 'react'

import { Progress } from 'antd'
import styled from 'styled-components'
import { V1_RED } from '../../common/colours'

const TextContainer = styled.text<{ moneyFontSize?: string | undefined }>`
  font-size: ${(props) => props.moneyFontSize ?? '21px'};
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`

const SubTextContainer = styled.text<{ textFontSize?: string | undefined }>`
  font-size: ${(props) => props.textFontSize ?? '15px'};
  font-weight: 300;
  color: rgba(0, 0, 0, 0.65);
`

const NoLimitText = styled.text<{ textFontSize?: string | undefined }>`
  font-size: ${(props) => props.textFontSize ?? '15px'};
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
`

type Props = {
  priceLimit?: number | undefined
  currentAmount: number
  width?: number
  moneyFontSize?: string
  textFontSize?: string
}

export const RoundProgress = (props: Props) => {
  if (!props.priceLimit) {
    return (
      <Progress
        format={() => {
          return (
            <>
              <NoLimitText textFontSize={props.textFontSize}>No Limit</NoLimitText>
            </>
          )
        }}
        type="circle"
        width={props.width ?? 80}
      />
    )
  }
  const percentage = (props.currentAmount / props.priceLimit) * 100
  const amountLeft = props.priceLimit - props.currentAmount
  return (
    <Progress
      format={() => {
        return (
          <>
            <TextContainer moneyFontSize={props.moneyFontSize}>
              ${Math.floor(amountLeft)}
              <br />
            </TextContainer>
            <SubTextContainer textFontSize={props.textFontSize}>left</SubTextContainer>
          </>
        )
      }}
      type="circle"
      percent={percentage}
      width={props.width ?? 80}
      strokeColor={V1_RED}
    />
  )
}
