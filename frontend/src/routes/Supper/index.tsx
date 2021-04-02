import React from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'
import { MainSGCard } from '../../components/Supper/MainSGCard'
import { MaxPriceFixer } from '../../components/Supper/MaxPriceFixer'
import { QuantityTracker } from '../../components/Supper/QuantityTracker'
import { LineProgress } from '../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../components/Supper/UnderlinedButton'
import { JoinOrderSGCard } from '../../components/Supper/JoinOrderSGCard'
import { SplitACMethod, SupperGroupStatus } from '../../store/supper/types'
import { ViewOrderSGCard } from '../../components/Supper/ViewOrderSGCard'
import { ViewCartButton } from '../../components/Supper/ViewCartButton'
import { SGStatusBubble } from '../../components/Supper/SGStatusBubble'
import { MenuSection } from '../../components/Supper/MenuSection'

export default function Supper() {
  return (
    <>
      {/* <RoundProgress amountLeft={50} percent={20} />
      <StatusSymbol isClicked backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <MaxPriceFixer />
      <QuantityTracker default={5} />
      <SGStatusBubble text={SupperGroupStatus.CANCELLED} />
      <RoundProgress amountLeft={50} percent={100} />
      <StatusSymbol isClicked backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <LineProgress currentStep={1} numberOfSteps={3} />
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
      <ViewCartButton numberOfItems={5} currentTotal="7.90" /> */}
      <MenuSection />
    </>
  )
}
