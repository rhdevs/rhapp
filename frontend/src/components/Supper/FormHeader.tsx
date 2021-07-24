import React from 'react'
import styled from 'styled-components'

const Header = styled.text<{ margin?: string; topMargin?: boolean }>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  ${(props) => props.topMargin && 'margin-top: 1rem;'}
  margin-bottom: 5px;
  ${(props) => props.margin && `margin: ${props.margin}`}
`
const RedText = styled.text<{ noPadding?: boolean }>`
  color: red;
  padding-right: ${(props) => (props.noPadding ? '0' : '5px')};
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
  noPadding?: boolean
}

export const FormHeader = (props: Props) => {
  const RedAsterisk = <RedText noPadding={props.noPadding}>*</RedText>

  return (
    <Header margin={props.margin} topMargin={props.topMargin}>
      {props.headerName}
      {props.isCompulsory && RedAsterisk}
    </Header>
  )
}
