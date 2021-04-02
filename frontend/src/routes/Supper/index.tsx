import React from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'
import { MainSGCard } from '../../components/Supper/MainSGCard'
import { UnderlinedButton } from '../../components/Supper/UnderlinedButton'
import { JoinOrderSGCard } from '../../components/Supper/JoinOrderSGCard'
import { SplitACMethod } from '../../store/supper/types'
import { ViewOrderSGCard } from '../../components/Supper/ViewOrderSGCard'
import { ViewCartButton } from '../../components/Supper/ViewCartButton'

export default function Supper() {
  return (
    <>
      <RoundProgress amountLeft={50} percent={100} />
      <StatusSymbol isClicked backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <UnderlinedButton text="Add Item" color="red" />
      <JoinOrderSGCard
        title="f> SUPPER FRIENDS I REALLY LIKE A RLY LONG NAME"
        orderId="RHSO#1002"
        username="Zhou BaoBao"
        amountLeft={50}
        percent={100}
        closingTime="11:59PM"
        numberOfUsers={10}
        splitACType={SplitACMethod.EQUAL}
        deliveryFee="10.70"
      />
      <ViewOrderSGCard
        title="f> SUPPER FRIENDS :0"
        orderId="RHSO#1002"
        username="Zhou BaoBao"
        amountLeft={50}
        percent={70}
        closingTime="11:59PM"
        numberOfUsers={10}
        deliveryFee="10.70"
      />
      <ViewCartButton numberOfItems={5} currentTotal="7.90" />
    </>
  )
}
