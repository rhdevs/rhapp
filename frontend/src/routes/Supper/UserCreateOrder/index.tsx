import React from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { Radio, Input } from 'antd'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { paymentMethods, restaurantList } from '../../../store/stubs'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`

const Step = styled.div``

const VertSectionContainer = styled.div`
  margin: 25px 35px;
`

const HortSectionContainer = styled.div`
  margin: 25px 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Header = styled.text`
  font-weight: 700;
  font-size: 16px;
`

const VertInputContainer = styled.div`
  width: 85%;
  padding 5px 12px;
`

const HortInputContainer = styled.div`
  padding: 0px 0px 0px 15px;
  width: 50%;
`

const InputBox = styled(Input)`
  &.ant-input {
    border-radius: 25px;
  }
`

const OptionBox = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledRadioButtons = styled(Radio.Group)`
  .ant-radio-checked .ant-radio-inner {
    border-color: #002642;
  }

  .ant-radio-inner::after {
    background-color: #002642;
  }
`

export default function UserCreateOrder() {
  return (
    <Background>
      {/* <Step>
        <TopNavBar title="Create Order" rightComponent={<UnderlinedButton text="Next" fontWeight={700} />} />
        <LineProgress currentStep={1} numberOfSteps={3} />
        <VertSectionContainer>
          <Header>Order Name</Header>
          <VertInputContainer>
            <InputBox placeholder="Order Name" />
          </VertInputContainer>
        </VertSectionContainer>
        <VertSectionContainer>
          <Header>Restaurant</Header>
          <RestaurantBubbles restaurantList={restaurantList} />
        </VertSectionContainer>
        <VertSectionContainer>
          <Header>Closing Time</Header>
          <VertInputContainer>
            <InputBox placeholder="Select Time" />
          </VertInputContainer>
        </VertSectionContainer>
        <VertSectionContainer>
          <Header>Max Price</Header>
          <MaxPriceFixer />
        </VertSectionContainer>
      </Step> */}
      {/* <Step>
        <TopNavBar title="Create Order" rightComponent={<UnderlinedButton text="Next" fontWeight={700} />} />
        <LineProgress currentStep={2} numberOfSteps={3} />
        <HortSectionContainer>
          <Header>Est. Delivery Fees</Header>
          <HortInputContainer>
            <InputBox placeholder="e.g. $3" />
          </HortInputContainer>
        </HortSectionContainer>
        <HortSectionContainer>
          <Header>Split Delivery Fees</Header>
          <HortInputContainer>
            <StyledRadioButtons>
              <Radio value={1}>Equal</Radio>
              <Radio value={2}>Proportional</Radio>
            </StyledRadioButtons>
          </HortInputContainer>
        </HortSectionContainer>
      </Step> */}
      <Step>
        <TopNavBar title="Create Order" rightComponent={<UnderlinedButton text="Finish" fontWeight={700} />} />

        <LineProgress currentStep={3} numberOfSteps={3} />
        <VertSectionContainer>
          <Header>Payment Method</Header>
          <PaymentMethodBubbles paymentMethods={paymentMethods} />
        </VertSectionContainer>
        <VertSectionContainer>
          <Header>Phone Number</Header>
          <VertInputContainer>
            <InputBox placeholder="Phone Number" />
          </VertInputContainer>
        </VertSectionContainer>
      </Step>
    </Background>
  )
}
