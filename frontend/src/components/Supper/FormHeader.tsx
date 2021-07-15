import React from 'react'
import styled from 'styled-components'

const Header = styled.text<{ topMargin?: boolean }>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  ${(props) => props.topMargin && 'margin-top: 1rem;'}
  margin-bottom: 5px;
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
}

export const FormHeader = (props: Props) => {
  const RedAsterisk = <RedText>*</RedText>

  return (
    <Header topMargin={props.topMargin}>
      {props.headerName}
      {props.isCompulsory && RedAsterisk}
    </Header>
  )
}
