import React from 'react'

import styled from 'styled-components'
import { onRefresh } from '../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'

const PullToRefreshContainer = styled(PullToRefresh)`
  &.pull-down-container {
    overflow-y: hidden;
    height: 100%;
    max-height: 100vh;
    position: relative;
  }
`

const PullToRefreshRH = ({ children }: { children: React.ReactNode }) => {
  return (
    <PullToRefreshContainer style={{ height: '100vh' }} onRefresh={onRefresh}>
      {children}
    </PullToRefreshContainer>
  )
}
export default PullToRefreshRH
