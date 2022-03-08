import React from 'react'
import styled from 'styled-components'

const SwitchButton = styled.span<{
  width?: number | undefined
}>`
  width: ${(props) => (props.width ? props.width * 0.45 + 'px' : '45px')};
  height: ${(props) => (props.width ? props.width * 0.45 + 'px' : '45px')};
  position: absolute;
  left: ${(props) => (props.width ? '-' + props.width * 0.015 + 'px' : '-1.5px')};
  border-radius: 45px;
  box-shadow: 4px 0px 10px -4px;
  border: ${(props) => (props.width ? props.width * 0.03 + 'px solid #D3D3D3' : '3px solid #808080')};
  transition: 0.2s;
  background: #fff;
`

const SwitchLabel = styled.label<{
  width?: number | undefined
  isOn?: boolean | undefined
  onColor?: string | undefined
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: ${(props) => (props.width ? props.width + 'px' : '100px')};
  height: ${(props) => (props.width ? props.width * 0.5 + 'px' : '50px')};
  background: lightgray;
  background: ${(props) => (props.isOn ? (props.onColor ? props.onColor : '#468751') : '#F5F5F5')};
  border-radius: 100px;
  border: ${(props) => (props.width ? props.width * 0.04 + 'px solid lightgray' : '4px solid gray')};
  position: relative;
  transition: background-color 0.2s;
  &:active ${SwitchButton} {
    width: ${(props) => (props.width ? props.width * 0.6 + 'px' : '60px')};
  }
`

const SwitchCheckbox = styled.input.attrs({ type: 'checkbox' })<{
  width?: number | undefined
}>`
  height: 0;
  width: 0;
  visibility: hidden;
  &:checked + ${SwitchButton} {
    left: calc(100% + ${(props) => (props.width ? props.width * 0.015 + 'px' : '1.5px')});
    transform: translateX(-100%);
    box-shadow: -4px 0px 10px -4px;
  }
`

export const Switch = ({
  isOn,
  handleToggle,
  switchSize,
}: {
  isOn: boolean
  handleToggle: React.ChangeEventHandler<HTMLInputElement>
  switchSize?: number
}) => {
  return (
    <SwitchLabel isOn={isOn} width={switchSize}>
      <SwitchCheckbox checked={isOn} onChange={handleToggle} width={switchSize} />
      <SwitchButton width={switchSize} />
    </SwitchLabel>
  )
}
