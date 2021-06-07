import styled from 'styled-components'
import { Radio } from 'antd'

export const CustomHeadersContainer = styled.div<{ marginTop?: string }>`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '1.5rem')};
`

export const OptionTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const CustomHeaders = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
`

export const RedText = styled.text`
  color: #ff4d4f;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  white-space: nowrap;
`

export const SelectText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  padding-bottom: 5px;
`

export const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const RadioButtonContainer = styled.div<{ isHidden?: boolean }>`
  ${(props) => props.isHidden && 'display: none;'}
  display: flex;
  flex-direction: row;
  height: 25px;
`

export const OptionText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
`
