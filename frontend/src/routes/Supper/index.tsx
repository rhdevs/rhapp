import React from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'
import { MainSGCard } from '../../components/Supper/CustomCards/MainSGCard'
import { MaxPriceFixer } from '../../components/Supper/MaxPriceFixer'
import { QuantityTracker } from '../../components/Supper/QuantityTracker'
import { LineProgress } from '../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../components/Supper/UnderlinedButton'
import { JoinOrderSGCard } from '../../components/Supper/CustomCards/JoinOrderSGCard'
import { PaymentMethod, SplitACMethod, SupperGroupStatus } from '../../store/supper/types'
import { ViewOrderSGCard } from '../../components/Supper/CustomCards/ViewOrderSGCard'
// import { ViewCartButton } from '../../components/Supper/ViewCartButton'
import { SGStatusBubble } from '../../components/Supper/SGStatusBubble'
import { OrderSummaryCard } from '../../components/Supper/CustomCards/OrderSummaryCard'
import { foodList, foodMenuStub, orderList, paymentMethods } from '../../store/stubs'
import { AddUpdateCartButton } from '../../components/Supper/AddUpdateCartButton'
import { SGCardWithStatus } from '../../components/Supper/CustomCards/SGCardWithStatus'
import { ExpandableSGCard } from '../../components/Supper/CustomCards/ExpandableSGCard'
import { PaymentMethodBubbles } from '../../components/Supper/PaymentMethodBubbles'
import { MenuSection } from '../../components/Supper/MenuSection'

export default function Supper() {
  return (
    <>
      <RoundProgress priceLimit={50} currentAmount={10} />
      <StatusSymbol backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <PaymentMethodBubbles paymentMethods={paymentMethods} />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <OrderSummaryCard orderByUser isOwner isEditable foodList={foodList} orderList={orderList} />
      <ExpandableSGCard
        isOwner
        supperGroupName="SUPPER FRIENDS"
        supperGroupId="RHSO#1002"
        ownerName="Zhou BaoBao"
        priceLimit={30}
        currentAmount={10}
        closingTime="10.30PM"
        numberOfUsers={10}
        deliveryFee="10.70"
      />
      <MainSGCard isOwner title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <MaxPriceFixer />
      <QuantityTracker default={5} />
      <SGStatusBubble text={SupperGroupStatus.ORDERED} />
      <RoundProgress priceLimit={50} currentAmount={10} />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <SGCardWithStatus
        supperGroupStatus={SupperGroupStatus.CLOSED}
        location="Basketball Court"
        collectionTime="12:30AM"
        username="Zhou BaoBao"
        title="f> SUPPER FRIENDS"
        orderId="RHSO#1002"
        buttonTeleHandle="someOwnerTele"
        paymentMethod={[
          { paymentMethod: PaymentMethod.CASH },
          { paymentMethod: PaymentMethod.PAYLAH, link: 'https://www.google.com' },
          { paymentMethod: PaymentMethod.GOOGLEPAY, link: 'https://www.google.com' },
          { paymentMethod: PaymentMethod.PAYNOW, link: 'https://www.google.com' },
        ]}
      />
      <LineProgress currentStep={1} numberOfSteps={3} />
      <UnderlinedButton text="Add Item" color="red" />
      <JoinOrderSGCard
        isOwner
        title="f> SUPPER FRIENDS I REALLY LIKE A RLY LONG NAME"
        orderId="RHSO#1002"
        username="Zhou BaoBao"
        currentAmount={50}
        priceLimit={100}
        closingTime="11:59PM"
        numberOfUsers={10}
        splitACType={SplitACMethod.EQUAL}
        deliveryFee="10.70"
      />
      <ViewOrderSGCard
        title="f> SUPPER FRIENDS :0"
        orderId="RHSO#1002"
        username="Zhou BaoBao"
        currentAmount={50}
        priceLimit={70}
        closingTime="11:59PM"
        numberOfUsers={10}
        deliveryFee="10.70"
      />
      {/* <ViewCartButton numberOfItems={5} currentTotal="7.90" /> */}
      <AddUpdateCartButton update currentTotal="7.90" />
      <MenuSection menu={foodMenuStub} />
    </>
  )
}
