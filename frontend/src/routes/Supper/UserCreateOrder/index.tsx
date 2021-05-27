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
import { SplitACMethod, SupperGroupStatus } from '../../../store/supper/types'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import InputRow from '../../../components/Mobile/InputRow'
import { withSuccess } from 'antd/lib/modal/confirm'

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

const ErrorText = styled.p`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 17px;
  font-family: 'Inter';
`

const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const VertInputContainer = styled.div`
  width: 85%;
  padding 5px 12px;
`

const HortInputContainer = styled.div`
  padding: 0px 0px 0px 15px;
  width: 50%;
`

const InputText = styled.input`
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 10px auto;
  height: 35px;
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

const FixerContainer = styled.div`
  display: flex;
  justify-content: center;
`

type FormValues = {
  orderName: string
}

export default function UserCreateOrder() {
  const [count, setCount] = useState(1)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const RedAsterisk = <RedText>*</RedText>
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

  const { register, handleSubmit, watch, errors } = useForm()

  // const onSubmit = (data) => console.log(data)

  useEffect(() => {
    //TODO: dispatch new order to backend
    // setOrder(initSupperGroup)
  }, [])

  const onClick = () => {
    console.log(watch())
    console.log(errors)
    handleSubmit((data) => {
      console.log(data)
    })()
    if (!errors) {
      setCount(count + 1)
    }
    if (count > 3) {
      console.log('success')
    }
  }
  const onConfirmDiscardClick = () => {
    //TODO: discard changes
    // setOrder(initSupperGroup)
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
                      console.log()
                      onClick()
                    }}
                    text="Next"
                    fontWeight={700}
                  />
                }
                onLeftClick={() => setCount(count - 1)}
              />
              <LineProgress currentStep={2} numberOfSteps={3} />
              <HortSectionContainer>
                <Header>Est. Delivery Fees {RedAsterisk}</Header>
                <HortInputContainer>
                  <InputBox
                    type="number"
                    placeholder="e.g. $3"
                    {...register('e.g. $3', {
                      min: 0,
                      maxLength: 12,
                      pattern: { value: /[0-9]+/i, message: 'Invalid input.' },
                    })}
                  />
                </HortInputContainer>
              </HortSectionContainer>
              <HortSectionContainer>
                <Header>Split Delivery Fees {RedAsterisk}</Header>
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
                rightComponent={
                  <UnderlinedButton
                    onClick={() => {
                      console.log('Finish')
                      onClick()
                    }}
                    text="Finish"
                    fontWeight={700}
                  />
                }
                onLeftClick={() => setCount(count - 1)}
              />
              <LineProgress currentStep={3} numberOfSteps={3} />
              <VertSectionContainer>
                <Header>Payment Method {RedAsterisk}</Header>
                <PaymentMethodBubbles paymentMethods={paymentMethods} />
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Phone Number {RedAsterisk}</Header>
                <VertInputContainer>
                  <InputBox
                    type="number"
                    placeholder="Phone Number"
                    {...register('Phone Number', {
                      required: true,
                    })}
                  />
                </VertInputContainer>
              </VertSectionContainer>
            </Step>
          )
        default:
          return (
            <Step>
              <TopNavBar
                title="Create Order"
                rightComponent={<UnderlinedButton onClick={onClick} text="Next" fontWeight={700} />}
                onLeftClick={() =>
                  modalIsOpen && (
                    <ConfirmationModal
                      title={'Discard Changes?'}
                      hasLeftButton={true}
                      leftButtonText={'Delete'}
                      onLeftButtonClick={onConfirmDiscardClick}
                      rightButtonText={'Cancel'}
                      onRightButtonClick={onCancelClick}
                    />
                  )
                }
              />
              <LineProgress currentStep={1} numberOfSteps={3} />
              <VertSectionContainer>
                <Header>Order Name{RedAsterisk}</Header>
                <VertInputContainer>
                  <InputText
                    type="text"
                    placeholder="Order Name"
                    name="orderName"
                    ref={register({
                      required: true,
                      validate: (input) => input.trim().length !== 0,
                    })}
                    style={{
                      borderColor: errors.orderName && 'red',
                      background: errors.orderName && '#ffd1d1',
                    }}
                  />
                  {errors.orderName?.type === 'required' && <ErrorText>This field is required.</ErrorText>}
                </VertInputContainer>
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Restaurant{RedAsterisk}</Header>
                <RestaurantBubbles restaurantList={restaurantList} />
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Closing Time{RedAsterisk}</Header>
                <VertInputContainer>
                  <InputBox
                    type="datetime-local"
                    placeholder="Select Time"
                    {...register('Select Time', { required: true, pattern: /^\S+@\S+$/i })}
                  />
                </VertInputContainer>
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Max Price{RedAsterisk}</Header>
                <FixerContainer>
                  <MaxPriceFixer />
                </FixerContainer>
              </VertSectionContainer>
            </Step>
          )
      }
    }
  }

  return <Background>{abstractSteps()}</Background>
}
