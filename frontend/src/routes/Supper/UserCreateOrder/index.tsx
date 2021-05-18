import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { Radio, Input } from 'antd'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { paymentMethods, restaurantList } from '../../../store/stubs'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { setOrder } from '../../../store/supper/action'
import { PaymentMethod, SplitACMethod, SupperGroupStatus } from '../../../store/supper/types'
import { useHistory } from 'react-router-dom'

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

const StyledRadioButtons = styled(Radio.Group)`
  .ant-radio-checked .ant-radio-inner {
    border-color: #002642;
  }

  .ant-radio-inner::after {
    background-color: #002642;
  }
`

export default function UserCreateOrder() {
  const [count, setCount] = useState(1)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const initSupperGroup = {
    costLimit: 0,
    createdAt: 10000000,
    currentFoodCost: 0,
    location: '',
    numOrders: 0,
    ownerId: '',
    ownerName: '',
    paymentInfo: [],
    restaurantLogo: '',
    restaurantName: '',
    splitAdditionalCost: SplitACMethod.EQUAL,
    status: SupperGroupStatus.OPEN,
    supperGroupId: 1,
    supperGroupName: '',
    totalPrice: 0,
    userIdList: [],
    closingTime: 10000000,
  }

  const history = useHistory()

  useEffect(() => {
    setOrder(initSupperGroup)
  }, [])

  const onConfirmDiscardClick = () => {
    setOrder(initSupperGroup)
    history.goBack()
  }

  const onCancelClick = () => {
    setModalIsOpen(false)
  }
  const abstractSteps = () => {
    {
      switch (count) {
        case 2:
          return (
            <Step>
              <TopNavBar
                title="Create Order"
                rightComponent={
                  <UnderlinedButton
                    onClick={() => {
                      setCount(count + 1)
                    }}
                    text="Next"
                    fontWeight={700}
                  />
                }
                onLeftClick={() => setCount(count - 1)}
              />
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
            </Step>
          )
        case 3:
          return (
            <Step>
              <TopNavBar
                title="Create Order"
                rightComponent={<UnderlinedButton onClick={() => setCount(count + 1)} text="Finish" fontWeight={700} />}
                onLeftClick={() => setCount(count - 1)}
              />
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
          )
        default:
          return (
            <Step>
              <TopNavBar
                title="Create Order"
                rightComponent={<UnderlinedButton onClick={() => setCount(count + 1)} text="Next" fontWeight={700} />}
                onLeftClick={() =>
                  modalIsOpen && (
                    <ConfirmationModal
                      title={'Discard Order?'}
                      hasLeftButton={true}
                      leftButtonText={'Discard'}
                      onLeftButtonClick={onConfirmDiscardClick}
                      rightButtonText={'Cancel'}
                      onRightButtonClick={onCancelClick}
                    />
                  )
                }
              />
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
            </Step>
          )
      }
    }
  }

  return <Background>{abstractSteps()}</Background>
}
