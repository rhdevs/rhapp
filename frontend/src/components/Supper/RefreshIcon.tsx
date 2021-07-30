import React from 'react'
import { ReloadOutlined } from '@ant-design/icons/lib/icons'

import styled from 'styled-components'
import { onRefresh } from '../../common/reloadPage'
import { V1_RED } from '../../common/colours'

const StyledReloadIcon = styled(ReloadOutlined)`
  margin: auto 0;
  font-size: 21px;
  color: ${V1_RED};
`

export const RefreshIcon = () => {
  const onClick = () => {
    onRefresh()
  }
  return <StyledReloadIcon onClick={onClick} />
}
