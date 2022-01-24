import styled from 'styled-components'
import { Button } from 'antd'

export const OverlayContainer = styled.div<{ overlayBackground: string; isModalOpen: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.overlayBackground ? props.overlayBackground : 'rgba(0, 0, 0, 0.3)')};
  z-index: 999;
`

export const MainContainer = styled.div`
  position: fixed;
  background-color: #fff;
  width: 90vw;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px;
  box-shadow: 0 2px 5px 1px #888888;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`

export const TitleContainer = styled.div<{ flex?: boolean }>`
  ${(props) => props.flex && 'display: flex;'}
`

export const TitleText = styled.text`
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
`

export const DescriptionText = styled.text`
  font-weight: 250;
  font-size: 14px;
  padding-top: 0.5rem;
  color: #33363a;
  text-align: justify;
`

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`

export const StyledButton = styled(Button)<{ defaultRightButtonColor: string; defaultRightButtonTextColor: string }>`
  background: ${(props) => props.defaultRightButtonColor};
  color: ${(props) => props.defaultRightButtonTextColor};
  border-radius: 5px;
  margin-left: 10px;

  &.ant-btn:hover,
  &.ant-btn:focus {
    color: ${(props) => (props.defaultRightButtonTextColor ? props.defaultRightButtonTextColor : 'black')};
    border-color: #d9d9d9;
    ${(props) => props.defaultRightButtonColor && `background: ${props.defaultRightButtonColor};`}
  }
`
