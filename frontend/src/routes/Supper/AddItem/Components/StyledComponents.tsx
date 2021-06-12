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
  display: ${(props) => (props.isHidden ? 'none !important' : 'inherit')};
  display: flex;
  flex-direction: row;
  min-height: 25px;
`

export const CheckboxMainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const CheckboxContainer = styled.div<{ isHidden?: boolean }>`
  width: fit-content;
  cursor: pointer;
  min-height: 30px;
  align-items: center;
  display: ${(props) => (props.isHidden ? 'none' : 'inherit')};
`

export const OptionText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  margin: 0 0 3px 2px;
`

export const FlexDiv = styled.div<{ flex: number }>`
  flex: ${(props) => props.flex}%;
`
