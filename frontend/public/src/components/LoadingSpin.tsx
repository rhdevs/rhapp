import React from 'react'
import { Spin } from 'antd'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'

function LoadingSpin() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return <Spin indicator={antIcon} />
}

export default LoadingSpin
