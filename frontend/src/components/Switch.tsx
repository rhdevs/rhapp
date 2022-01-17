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
  border: ${(props) => (props.width ? +props.width * 0.02 + 'px solid lightgray' : '2px solid gray')};
  transition: 0.2s;
  background: #fff;
`

const SwitchLabel = styled.label<{
  width?: number | undefined
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: ${(props) => (props.width ? props.width + 'px' : '100px')};
  height: ${(props) => (props.width ? props.width * 0.5 + 'px' : '50px')};
  background: lightgray;
  border-radius: 100px;
  border: ${(props) => (props.width ? +props.width * 0.03 + 'px solid lightgray' : '2px solid gray')};
  position: relative;
  transition: background-color 0.2s;
  &:active ${SwitchButton} {
    width: ${(props) => (props.width ? props.width * 0.6 + 'px' : '100px')};
  }
`

const SwitchCheckbox = styled.input.attrs({ type: 'checkbox' })<{
  width?: number | undefined
}>`
  height: 0;
  width: 0;
  visibility: hidden;
  &:checked + ${SwitchButton} {
    left: calc(100% + ${(props) => (props.width ? +props.width * 0.015 + 'px' : '1.5px')});
    transform: translateX(-100%);
  }
`

export const Switch = ({
  isOn,
  handleToggle,
  onColor,
  switchSize,
}: {
  isOn: boolean
  handleToggle: React.ChangeEventHandler<HTMLInputElement>
  onColor: any
  switchSize?: number
}) => {
  return (
    <>
      <SwitchLabel style={{ background: isOn && onColor }} width={SwitchSize}>
        <SwitchCheckbox checked={isOn} onChange={handleToggle} width={SwitchSize}></SwitchCheckbox>
        <SwitchButton width={SwitchSize} />
      </SwitchLabel>
    </>
  )
}
