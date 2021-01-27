import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const Spinner = styled.div`
  text-align: center;
  padding: 23px;
  background-color: #fafaf4;
  .ant-spin {
    color: #de5f4c !important;
  }
`

function LoadingSpin() {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
  return (
    <Spinner>
      <Spin indicator={antIcon} />
    </Spinner>
  )
}

export default LoadingSpin
