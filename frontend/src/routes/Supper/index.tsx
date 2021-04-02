import React from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'
import { MainSGCard } from '../../components/Supper/MainSGCard'
import { UnderlinedButton } from '../../components/Supper/UnderlinedButton'

export default function Supper() {
  return (
    <>
      <RoundProgress amountLeft={50} percent={100} />
      <StatusSymbol isClicked backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <UnderlinedButton text="Add Item" color="red" />
    </>
  )
}
