import React from 'react'
import styled from 'styled-components'

const Directinglink = styled.a`
  font-family: Lato;
  font-size: 14px;
  line-height: 16.8px;
  text-decoration-line: underline;
  color: #4d6daa;
  text-align: center;
  padding-bottom: 10px;
  position: relative;
  top: -15px;
`

type Props = {
  text: string
  onClick: React.MouseEventHandler<HTMLElement>
}

function ModalLink(prop: Props) {
  return <Directinglink onClick={prop.onClick}>{prop.text}</Directinglink>
}

export default ModalLink
