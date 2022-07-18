import React, { useState } from 'react'
import styled from 'styled-components'
import SmileOutlined from '@ant-design/icons/lib/icons/SmileOutlined'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { MaxPriceFixer } from '../../components/Supper/MaxPriceFixer'
import { QuantityTracker } from '../../components/Supper/QuantityTracker'
import { LineProgress } from '../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../components/Supper/UnderlinedButton'
import { PaymentMethod, Restaurants, SupperGroupStatus } from '../../store/supper/types'
import { SGStatusBubble } from '../../components/Supper/SGStatusBubble'
import {
  foodList,
  orderList,
  paymentMethods,
  restaurantList,
  supperGroupStatusList,
  foodMenuStub,
  supperGroupStub,
  dummyCollatedOrderList,
} from '../../store/stubs'
import { AddUpdateCartButton } from '../../components/Supper/AddUpdateCartButton'
import { PaymentMethodBubbles } from '../../components/Supper/PaymentMethodBubbles'
import { RestaurantBubbles } from '../../components/Supper/RestaurantBubbles'
import { SGStatusOptions } from '../../components/Supper/SGStatusOptions'
import { MenuSection } from '../../components/Supper/MenuSection'
import { SGPaymentStatus } from '../../components/Supper/CustomCards/SGPaymentStatus'
import { BubbleSection } from '../../components/Supper/BubbleSection'
import { DeliveryTimeSetter } from '../../components/Supper/DeliveryTimeSetter'
import { Checkbox } from '../../components/Checkbox'
import { RhAppQrCode } from '../../components/RhAppQrCode'
import { RadioButton } from '../../components/RadioButton'
import { SupperGroupCard } from '../../components/Supper/SupperGroupCard'
import { OrderCard } from '../../components/Supper/CustomCards/OrderCard'
import { FoodLine } from '../../components/Supper/FoodLine'
import { InformationCard } from '../../components/Supper/InformationCard'
import { SupperSearchBar } from '../../components/Supper/SupperSearchBar'
import { SGStatusCard } from '../../components/Supper/CustomCards/SGStatusCard'
import { getRestaurantLogo } from '../../common/getRestaurantLogo'
import { FilterBubbles } from '../../components/Supper/FilterBubbles'
import { SupperButton } from '../../components/Supper/SupperButton'
import { V1_GREY_BACKGROUND } from '../../common/colours'
import { TwoStepCancelGroupModal } from '../../components/Supper/Modals/TwoStepCancelGroupModal'

const OptionText = styled.p`
  margin: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
`

export default function Supper() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const restaurantLogo = getRestaurantLogo(supperGroupStub.restaurantName as Restaurants)
  return (
    <>
      <FilterBubbles />
      <SupperSearchBar />
      <InformationCard splitACMethod />
      <div onClick={() => setIsModalOpen(true)}>open modal</div>
      {isModalOpen && <TwoStepCancelGroupModal modalSetter={setIsModalOpen} supperGroupId={1} />}
      <div style={{ width: '80vw' }}>
        <FoodLine backgroundColor={V1_GREY_BACKGROUND} food={foodList[0]} hasNoQuantity />
      </div>
      <SupperButton center ghost defaultButtonDescription="Ghost Button" />
      <OrderCard
        collatedOrder={dummyCollatedOrderList}
        order={orderList[0]}
        ownerId="A1234567B"
        supperGroupStatus={supperGroupStub.status}
        supperGroup={supperGroupStub}
      />
      <SupperGroupCard supperGroup={supperGroupStub} isHome={false} />
      <RadioButton
        margin="0 0 3px 2px"
        value="option.name"
        label={<OptionText>McCafe Caramel Frappe With Oreo Medium (+$4.45)</OptionText>}
      />
      <RhAppQrCode link="google.com" />
      <Checkbox isChecked={true} />
      <BubbleSection title="Order Information" number={1}>
        hello
      </BubbleSection>
      <SGPaymentStatus supperGroup={supperGroupStub} />
      <StatusSymbol backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <SGStatusOptions supperGroupStatusList={supperGroupStatusList} />
      <RestaurantBubbles restaurantList={restaurantList} />
      <PaymentMethodBubbles paymentMethods={paymentMethods} />
      <MaxPriceFixer />
      <DeliveryTimeSetter default={20} />
      <QuantityTracker default={5} />
      <SGStatusBubble text={SupperGroupStatus.ORDERED} />
      <SGStatusCard
        supperGroupStatus={SupperGroupStatus.CANCELLED}
        restaurantLogo={restaurantLogo}
        idHeader="RHSO#1002 Zhou BaoBao"
        rawSupperGroupId={1}
        buttonTeleHandle="ZBB"
        supperGroupName="f> SUPPER FRIENDS"
        cancelReason="Lazy to order"
        statusOnly={false}
      />
      <SGStatusCard
        supperGroupStatus={SupperGroupStatus.CLOSED}
        restaurantLogo={restaurantLogo}
        idHeader="RHSO#1002 Zhou BaoBao"
        rawSupperGroupId={3}
        buttonTeleHandle="ZBB"
        supperGroupName="f> SUPPER FRIENDS this is a long name let try me out :>"
        statusOnly={false}
        isOwner
      />
      <SGStatusCard
        supperGroupStatus={SupperGroupStatus.AWAITING_PAYMENT}
        restaurantLogo={restaurantLogo}
        idHeader="RHSO#1002 Zhou BaoBao"
        rawSupperGroupId={1}
        buttonTeleHandle="ZBB"
        location="Basketball Court"
        collectionTime="12:30AM"
        supperGroupName="f> SUPPER FRIENDS"
        paymentMethod={[
          { paymentMethod: PaymentMethod.CASH },
          { paymentMethod: PaymentMethod.PAYLAH, link: 'https://www.google.com' },
          { paymentMethod: PaymentMethod.GOOGLEPAY, link: 'https://www.google.com' },
          { paymentMethod: PaymentMethod.PAYNOW, link: 'https://www.google.com' },
        ]}
        statusOnly={false}
        isOwner
      />
      <LineProgress currentStep={1} numberOfSteps={3} />
      <UnderlinedButton text="Add Item" color="red" />
      <AddUpdateCartButton update currentTotal="7.90" />
      <InformationCard content="This is important, have a  great day!" />
      <MenuSection menu={foodMenuStub} />
    </>
  )
}
