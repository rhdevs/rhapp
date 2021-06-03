import React, { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.label<{ checked?: boolean; margin?: string; sizePercentage?: number }>`
  display: block;
  position: relative;
  margin: ${(props) => props.margin ?? 'auto 5px'};
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: ${(props) => (props.sizePercentage ?? 1) * 20}px;
  width: ${(props) => (props.sizePercentage ?? 1) * 20}px;
`

const Checkmark = styled.span<{ checked?: boolean; checkboxColor?: string; sizePercentage?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: ${(props) => (props.sizePercentage ?? 1) * 20}px;
  width: ${(props) => (props.sizePercentage ?? 1) * 20}px;
  ${(props) =>
    props.checked
      ? `background-color: ${props.checkboxColor ?? '#002642'};
        left: 35%;
        top: 15%;
        width: 6px;
        height: 11px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);`
      : `
        background-color:#fff;
        border-radius: 2px;
        border: 1px solid ${props.checkboxColor ?? '#002642'};
      `}
`

const Background = styled.div<{ checked?: boolean; checkboxColor?: string; sizePercentage?: number }>`
  background-color: ${(props) => (props.checked ? props.checkboxColor ?? '#002642' : '#fff')};
  top: 0;
  left: 0;
  height: ${(props) => (props.sizePercentage ?? 1) * 20}px;
  width: ${(props) => (props.sizePercentage ?? 1) * 20}px;
  position: absolute;
  border-radius: 2px;
`

type Props = {
  checkboxColor?: string
  isChecked?: boolean
  isDisabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  sizePercentage?: number
  margin?: string
}

export const Checkbox = (props: Props) => {
  useEffect(() => {
    setIsChecked(props.isChecked ?? false)
  }, [props.isChecked])
  const [isChecked, setIsChecked] = useState(props.isChecked ?? false)

  return (
    <Container sizePercentage={props.sizePercentage} margin={props.margin}>
      <Background
        onClick={(e) => {
          if (!props.isDisabled) {
            setIsChecked(!isChecked)
            props.onClick ? props.onClick(e) : null
          }
        }}
        checked={isChecked}
        checkboxColor={props.checkboxColor}
        sizePercentage={props.sizePercentage}
      >
        <Checkmark checked={isChecked} checkboxColor={props.checkboxColor} sizePercentage={props.sizePercentage} />
      </Background>
    </Container>
  )
}
