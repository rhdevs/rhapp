import React from 'react'

import { onRefresh } from '../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'

const PullToRefreshRH = ({ children }: { children: React.ReactNode }) => {
  return (
    <PullToRefresh style={{ height: '100vh' }} onRefresh={onRefresh}>
      {children}
    </PullToRefresh>
  )
}
export default PullToRefreshRH
