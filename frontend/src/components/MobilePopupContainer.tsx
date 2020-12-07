import React from 'react'
import styled from 'styled-components'
import { DESKTOP_VIEW } from '../common/breakpoints'

const Container = styled.div`
  width: calc(100vw - 32px);
  ${DESKTOP_VIEW} {
    width: 400px;
  }
`
// UNDONE, feel free to complete
function MobilePopupContainer() {
  return <Container />
}

export default MobilePopupContainer
