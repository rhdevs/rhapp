import { Radio } from 'antd'
import styled from 'styled-components'

export const MainCalendarContainer = styled.div`
  width: 100%;
  height: 85vh;
  background-color: #fafaf4;
  padding-top: 20px;
`

// Facility Display List
export const MainContainer = styled.div`
  width: 100%;
  background-color: #fafaf4;
  height: 88vh;
`
export const FacilityCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

export const FacilityHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
`

export const FacilitySubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
`

export const FacilityLabels = styled.div`
  align-self: center;
  margin-top: 14px;
`

export const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper:hover {
    color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: #de5f4c;
    border-left-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover:before {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper {
    font-family: Inter;
  }
`

export const StyledRadioGroupDiv = styled.div`
  overflow: auto;
  white-space: nowrap;
  margin: 0 21px;
  position: sticky;
  left: 0;
  top: 4.4rem;
  padding-bottom: 10px;
  background: #fafaf4;
`

export const StyledBodyDiv = styled.div`
  background-color: #fafaf4;
  height: 80vh;
  overflow: scroll;
  overflow-x: hidden;
`
