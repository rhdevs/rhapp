import { Button as AntdButton } from 'antd'
import React from 'react'

import styled from 'styled-components'

const MainContainer = styled.div<{ isSticky?: boolean; width?: string }>`
  margin: auto;
  padding: 6px 15px;
  width: ${(props) => props.width ?? '100vw'};
  position: ${(props) => (props.isSticky ? 'fixed' : '')};
  bottom: 0;
  z-index: 1000;
  background: #fafaf4;
  height: 60px;
`

const StyledRedButton = styled(AntdButton)`
  width: 100%;
  height: fit-content;
  border-radius: 5px;
  background: #de5f4c;
  border: 1px solid #de5f4c;
  &.ant-btn-primary:hover,
  &.ant-btn-primary:focus,
  &.ant-btn:hover,
  &.ant-btn:focus {
    background: #de5f4c;
    border: 1px solid #de5f4c;
  }
  &.ant-btn-primary {
    background: #de5f4c;
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
  leftText?: string
  middleText?: string
  rightText?: string
  width?: string
  isGrey?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const RedButton = (props: Props) => {
  return (
    <MainContainer isSticky={props.isSticky} width={props.width}>
      {props.isGrey ? (
        <StyledGreyButton type="primary" htmlType={props.htmlType ?? 'button'} onClick={props.onClick}>
          <ButtonTextContainer>
            <TextField>{props.leftText}</TextField>
            <TextField>{props.middleText}</TextField>
            <TextField>{props.rightText}</TextField>
          </ButtonTextContainer>
        </StyledGreyButton>
      ) : (
        <StyledRedButton type="primary" htmlType={props.htmlType ?? 'button'} onClick={props.onClick}>
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
