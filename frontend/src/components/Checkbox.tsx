import React, { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.label<{ checked?: boolean }>`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: fit-content;
  height: fit-content;
`

const Checkmark = styled.span<{ checked?: boolean; checkboxColor?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  ${(props) =>
    props.checked
      ? `background-color: ${props.checkboxColor ?? '#002642'};
        left: 7px;
        top: 3px;
        width: 6px;
        height: 11px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);`
      : `
        background-color:#eee;
        border-radius: 2px;
        border: 1px solid ${props.checkboxColor ?? '#002642'};
      `}
`

const Background = styled.div<{ checked?: boolean; checkboxColor?: string }>`
  background-color: ${(props) => (props.checked ? props.checkboxColor ?? '#002642' : '#eee')};
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  position: absolute;
  border-radius: 2px;
`

type Props = {
  checkboxColor?: string
  isChecked?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const Checkbox = (props: Props) => {
  useEffect(() => {
    setIsChecked(props.isChecked ?? false)
  }, [props.isChecked])
  const [isChecked, setIsChecked] = useState(props.isChecked ?? false)

  return (
    <Container>
      <Background
        onClick={(e) => {
          setIsChecked(!isChecked)
          props.onClick ? props.onClick(e) : null
        }}
        checked={isChecked}
        checkboxColor={props.checkboxColor}
      >
        <Checkmark checked={isChecked} checkboxColor={props.checkboxColor} />
      </Background>
    </Container>
  )
}
