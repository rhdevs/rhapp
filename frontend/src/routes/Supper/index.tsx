import React from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'

export default function Supper() {
  return (
    <>
      <StatusSymbol leftIcon={<SmileOutlined />} preText="est." text="$10.70 (Equal)" />
      <RoundProgress amountLeft={50} percent={100} />
    </>
  )
}
