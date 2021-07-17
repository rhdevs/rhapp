import { Button as AntdButton } from 'antd'
import React from 'react'

import styled from 'styled-components'
import { V1_BACKGROUND, V1_RED } from '../../common/colours'

const MainContainer = styled.div<{ isSticky?: boolean | undefined; width?: string | undefined; zIndex?: number }>`
  margin: auto;
  padding: 6px 15px;
  width: ${(props) => props.width ?? '100vw'};
  position: ${(props) => (props.isSticky ? 'fixed' : '')};
  bottom: 0;
  z-index: ${(props) => props.zIndex ?? 1000};
  background: ${(props) => (props.isSticky ? V1_BACKGROUND : 'transparent')};
  height: ${(props) =>
    props.isSticky
      ? `4rem;
  display: flex;
  align-items: center;`
      : `60px;`};
`

const StyledRedButton = styled(AntdButton)`
  width: 100%;
  height: fit-content;
  border-radius: 5px;
  background: ${V1_RED};
  border: 1px solid ${V1_RED};
  &.ant-btn-primary:hover,
  &.ant-btn-primary:focus,
  &.ant-btn:hover,
  &.ant-btn:focus {
    background: ${V1_RED};
    border: 1px solid ${V1_RED};
  }
  &.ant-btn-primary {
    background: ${V1_RED};
  }
`

const ButtonTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 15px;
`

const TextField = styled.text`
  font-size: 17px;
`

const StyledGreyButton = styled(AntdButton)`
  width: 100%;
  height: fit-content;
  border-radius: 5px;
  background: #ccc;
  border: 1px solid #ccc;
  &.ant-btn-primary:hover,
  &.ant-btn-primary:focus,
  &.ant-btn:hover,
  &.ant-btn:focus,
  &.ant-btn-primary {
    background: #ccc;
    border: 1px solid #ccc;
  }
  --antd-wave-shadow-color: none;
`

type Props = {
  htmlType?: 'button' | 'submit' | 'reset' | undefined
  isSticky?: boolean
  leftText?: string | undefined
  middleText?: string
  rightText?: string
  width?: string
  zIndex?: number
  isGrey?: boolean | undefined
  onClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined
}

export const RedButton = (props: Props) => {
  return (
    <MainContainer isSticky={props.isSticky} width={props.width} zIndex={props.zIndex}>
      {props.isGrey ? (
        <StyledGreyButton
          type="primary"
          htmlType={props.htmlType ?? 'button'}
          onClick={props.onClick as React.MouseEventHandler<HTMLElement>}
        >
          <ButtonTextContainer>
            <TextField>{props.leftText}</TextField>
            <TextField>{props.middleText}</TextField>
            <TextField>{props.rightText}</TextField>
          </ButtonTextContainer>
        </StyledGreyButton>
      ) : (
        <StyledRedButton
          type="primary"
          htmlType={props.htmlType ?? 'button'}
          onClick={props.onClick as React.MouseEventHandler<HTMLElement>}
        >
          <ButtonTextContainer>
            <TextField>{props.leftText}</TextField>
            <TextField>{props.middleText}</TextField>
            <TextField>{props.rightText}</TextField>
          </ButtonTextContainer>
        </StyledRedButton>
      )}
    </MainContainer>
  )
}
