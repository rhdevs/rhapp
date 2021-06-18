import React from 'react'
import styled from 'styled-components'

const Header = styled.text`
  font-weight: 700;
  font-size: 16px;
`
const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

type Props = {
  headerName: string
  isCompulsory?: boolean
}

export const FormHeader = (props: Props) => {
  const RedAsterisk = <RedText>*</RedText>

  return (
    <Header>
      {props.headerName}
      {props.isCompulsory && RedAsterisk}
    </Header>
  )
}
