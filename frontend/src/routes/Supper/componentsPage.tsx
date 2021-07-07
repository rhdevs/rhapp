import React from 'react'
import styled from 'styled-components'
import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { RoundProgress } from '../../components/Supper/RoundProgress'
import { MainSGCard } from '../../components/Supper/CustomCards/MainSGCard'
import { MaxPriceFixer } from '../../components/Supper/MaxPriceFixer'
import { QuantityTracker } from '../../components/Supper/QuantityTracker'
import { LineProgress } from '../../components/Supper/LineProgess'
import { UnderlinedButton } from '../../components/Supper/UnderlinedButton'
import { JoinOrderSGCard } from '../../components/Supper/CustomCards/JoinOrderSGCard'
import { PaymentMethod, Restaurants, SplitACMethod, SupperGroupStatus } from '../../store/supper/types'
import { ViewOrderSGCard } from '../../components/Supper/CustomCards/ViewOrderSGCard'
// import { ViewCartButton } from '../../components/Supper/ViewCartButton'
import { SGStatusBubble } from '../../components/Supper/SGStatusBubble'
import { OrderSummaryCard } from '../../components/Supper/CustomCards/OrderSummaryCard'
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
import { SGCardWithStatus } from '../../components/Supper/CustomCards/SGCardWithStatus'
import { ExpandableSGCard } from '../../components/Supper/CustomCards/ExpandableSGCard'
import { PaymentMethodBubbles } from '../../components/Supper/PaymentMethodBubbles'
import { RestaurantBubbles } from '../../components/Supper/RestaurantBubbles'
import { SGStatusOptions } from '../../components/Supper/SGStatusOptions'
import { MenuSection } from '../../components/Supper/MenuSection'
import { NotificationBarOld } from '../../components/Supper/NotificationBarOld'
import { SGPaymentStatus } from '../../components/Supper/CustomCards/SGPaymentStatus'
import { BubbleSection } from '../../components/Supper/BubbleSection'
import { DeliveryTimeSetter } from '../../components/Supper/DeliveryTimeSetter'
import { Checkbox } from '../../components/Checkbox'
import { RhAppQrCode } from '../../components/RhAppQrCode'
import { RadioButton } from '../../components/RadioButton'
import { SupperGroupCard } from '../../components/Supper/SupperGroupCard'
import { OrderCard } from '../../components/Supper/CustomCards/OrderCard'
import { FoodLine } from '../../components/Supper/FoodLine'
// import { ContactModal } from '../../components/Supper/ContactModal'
import { InformationCard } from '../../components/Supper/InformationCard'
import { SGStatusCard } from '../../components/Supper/CustomCards/SGStatusCard'
import { getRestaurantLogo } from '../../common/getRestaurantLogo'
// import { NotificationBar } from '../../components/Supper/NotificationBar'
// import { ViewMenuFoodModal } from '../../components/Supper/ViewMenuFoodModal'

const OptionText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
`

export default function Supper() {
  // const [isFoodMenuModalOpen, setIsFoodMenuModalOpen] = useState<boolean>(true)
  // const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(true)
  const restaurantLogo = getRestaurantLogo(supperGroupStub.restaurantName as Restaurants)
  return (
    <>
      <div style={{ width: '80vw' }}>
        <FoodLine backgroundColor="#EEEEEE" food={foodList[0]} hasNoQuantity />
      </div>
      <OrderCard
        collatedOrder={dummyCollatedOrderList}
        order={orderList[0]}
        ownerId={'A1234567B'}
        // isEditable
        supperGroupStatus={supperGroupStub.status}
        // ownerId={localStorage.userID}
        // foodList={foodList}
        supperGroup={supperGroupStub}
      />
      <SupperGroupCard supperGroup={supperGroupStub} />
      <RadioButton
        margin="0 0 3px 2px"
        value="option.name"
        label={<OptionText>McCafe Caramel Frappe With Oreo Medium (+$4.45)</OptionText>}
      />
      <RhAppQrCode link="google.com" />
      <NotificationBarOld supperGroupName="THIS IS THE GROUP naME" />
      <RoundProgress priceLimit={50} currentAmount={19.7} />
      <Checkbox isChecked={true} />
      <BubbleSection title="Order Information" number={1}>
        hello
      </BubbleSection>
      <SGPaymentStatus supperGroup={supperGroupStub} />
      <StatusSymbol backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <SGStatusOptions supperGroupStatusList={supperGroupStatusList} />
      <RestaurantBubbles restaurantList={restaurantList} />
      <PaymentMethodBubbles paymentMethods={paymentMethods} />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <OrderSummaryCard orderByUser isEditable foodList={foodList} orderList={orderList} />
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
      <DeliveryTimeSetter default={20} />
      <QuantityTracker default={5} />
      <SGStatusBubble text={SupperGroupStatus.ORDERED} />
      <RoundProgress currentAmount={10} />
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
      <SGStatusCard
        supperGroupStatus={SupperGroupStatus.CANCELLED}
        restaurantLogo={restaurantLogo}
        username="Zhou BaoBao"
        title="f> SUPPER FRIENDS long long long name just checking how it looks like"
        orderId="RHSO#1002"
        cancelReason="Lazy to order"
      />
      <SGStatusCard
        supperGroupStatus={SupperGroupStatus.ORDERED}
        restaurantLogo={restaurantLogo}
        username="Zhou BaoBao"
        title="f> SUPPER FRIENDS"
        orderId="RHSO#1002"
      />
      <SGStatusCard
        supperGroupStatus={SupperGroupStatus.ARRIVED}
        restaurantLogo={restaurantLogo}
        username="Zhou BaoBao"
        location="Basketball Court"
        collectionTime="12:30AM"
        title="f> SUPPER FRIENDS long long long name just checking how it looks like"
        orderId="RHSO#1002"
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
        isOwner
      />
      {/* <ViewCartButton numberOfItems={5} currentTotal="7.90" /> */}
      <AddUpdateCartButton update currentTotal="7.90" />
      <InformationCard content="This is important, have a  great day!" />
      <MenuSection menu={foodMenuStub} />
      {/* {isContactModalOpen && (
        <ContactModal orderList={orderList} food={foodList[0]} contactModalSetter={setIsContactModalOpen} />
      )} */}
      {/* {isFoodMenuModalOpen && (
        <ViewMenuFoodModal
          foodList={foodList}
          foodId={'12345364832764134'}
          menuFoodName={'McGriddles with Egg Meal'}
          supperGroupId={1}
          orderId="1"
          viewMenuFoodModalSetter={setIsFoodMenuModalOpen}
        />
      )} */}
    </>
  )
}
