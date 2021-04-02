import React from 'react'

import { FileProtectOutlined, SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'
import { MainSGCard } from '../../components/Supper/MainSGCard'
import { PlusButton } from '../../components/Supper/PlusButton'
import { MinusButton } from '../../components/Supper/MinusButton'

export default function Supper() {
  return (
    <>
      <RoundProgress amountLeft={50} percent={20} />
      <StatusSymbol isClicked backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <PlusButton />
      <MinusButton />
    </>
  )
}
