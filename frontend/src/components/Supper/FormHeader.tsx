import React from 'react'
import styled from 'styled-components'

const Header = styled.text<{ margin?: string; topMargin?: boolean; fontSize?: string }>`
  font-style: normal;
  font-weight: 500;
  font-size: ${(props) => props.fontSize ?? '16px'};
  ${(props) => props.topMargin && 'margin-top: 1rem;'}
  margin-bottom: 5px;
  ${(props) => props.margin && `margin: ${props.margin}`}
`
const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`

type Props = {
  headerName: string
  isCompulsory?: boolean
  topMargin?: boolean
  margin?: string
  fontSize?: string
}

export const FormHeader = (props: Props) => {
  const RedAsterisk = <RedText>*</RedText>

  return (
    <Header margin={props.margin} topMargin={props.topMargin} fontSize={props.fontSize}>
      {props.headerName}
      {props.isCompulsory && RedAsterisk}
    </Header>
  )
}
