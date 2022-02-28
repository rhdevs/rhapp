import React from 'react'

import styled from 'styled-components'

const StyledHr = styled.hr<{ width?: string; top?: string; left?: string; right?: string; bottom?: string }>`
  border: 1.5px solid #468751;
  position: absolute;
  z-index: 1;
  width: ${(props) => props.width ?? '100%'};
  ${(props) => props.top && `top: ${props.top};`}
  ${(props) => props.left && `left: ${props.left};`}
  ${(props) => props.right && `right: ${props.right};`}
  ${(props) => props.bottom && `bottom: ${props.bottom};`}
`

type Props = {
  width?: string
  top?: string
  left?: string
  right?: string
  bottom?: string
}

const CurrentTimeLine = (props: Props) => {
  return <StyledHr width={props.width} top={props.top} left={props.left} right={props.right} bottom={props.bottom} />
}

export default CurrentTimeLine
