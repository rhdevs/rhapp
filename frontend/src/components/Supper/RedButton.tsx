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

const Button = styled(AntdButton)`
  width: 100%;
  height: fit-content;
  border-radius: 5px;
  background: #de5f4c;
  border: 1px solid #de5f4c;
  &.ant-btn-primary:hover,
  .ant-btn-primary:focus {
    background: #de5f4c;
    border: 1px solid #de5f4c;
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

type Props = {
  htmlType?: 'button' | 'submit' | 'reset' | undefined
  isSticky?: boolean
  leftText?: string
  middleText?: string
  rightText?: string
  width?: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const RedButton = (props: Props) => {
  return (
    <MainContainer isSticky={props.isSticky} width={props.width}>
      <Button type="primary" htmlType={props.htmlType ?? 'button'} onClick={props.onClick}>
        <ButtonTextContainer>
          <TextField>{props.leftText}</TextField>
          <TextField>{props.middleText}</TextField>
          <TextField>{props.rightText}</TextField>
        </ButtonTextContainer>
      </Button>
    </MainContainer>
  )
}
