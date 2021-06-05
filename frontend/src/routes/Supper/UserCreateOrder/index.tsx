import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { Radio, Switch, Input } from 'antd'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { paymentMethods, restaurantList } from '../../../store/stubs'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { setOrder } from '../../../store/supper/action'
import { SplitACMethod, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { useHistory } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { PATHS } from '../../Routes'

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
  padding 5px 12px;
`

const HortInputContainer = styled.div`
  padding: 0px 0px 0px 15px;
  width: 45%;
`

const InputText = styled.input`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

const InputBox = styled(Input)`
  &.ant-input {
    border-radius: 25px;
  }
`

const StyledSwitch = styled(Switch)`
  width: fit-content;
  &.ant-switch-checked {
    background-color: #002642;
  }
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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

type FormValues1 = {
  supperGroupName: string
  restaurant: string
  closingTime: string
  maxPrice: number
}

type FormValues2 = {
  estDeliveryFee: number
  splitDeliveryFees: string
}

type FormValues3 = {
  paymentMethod: string
  phoneNumber: number
}

export default function UserCreateOrder() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { supperGroup, selectedRestaurant, priceLimit, selectedPaymentMethod } = useSelector(
    (state: RootState) => state.supper,
  )
  const [count, setCount] = useState(1)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [hasMaxPrice, setHasMaxPrice] = useState<boolean>(supperGroup?.costLimit ? true : false)

  const RedAsterisk = <RedText>*</RedText>
  const initSupperGroup: SupperGroup = {
    costLimit: 0,
    createdAt: Math.round(Date.now() / 1000),
    currentFoodCost: 0,
    location: '',
    numOrders: 0,
    ownerId: '',
    ownerName: '',
    ownerTele: '',
    paymentInfo: [],
    restaurantLogo: '',
    restaurantName: '',
    splitAdditionalCost: SplitACMethod.EQUAL,
    status: SupperGroupStatus.OPEN,
    supperGroupId: '',
    supperGroupName: '',
    totalPrice: 0,
    userIdList: [],
    closingTime: Math.round(Date.now() / 1000),
  }

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    control: control1,
    errors: errors1,
  } = useForm<FormValues1>()
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    control: control2,
    errors: errors2,
  } = useForm<FormValues2>()
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    setValue: setValue3,
    errors: errors3,
  } = useForm<FormValues3>()

  useEffect(() => {
    dispatch(setOrder(initSupperGroup))
  }, [dispatch])

  const onClick1 = () => {
    setValue1('restaurant', selectedRestaurant)
    if (priceLimit > 0) {
      setValue1('maxPrice', priceLimit)
    }
    //console.log(watch())
    handleSubmit1((data) => {
      //TODO: update store
      console.log(data)
      setCount(count + 1)
    })()
  }

  const onClick2 = () => {
    handleSubmit2((data) => {
      //TODO: update store
      console.log(data)
      setCount(count + 1)
    })()
  }

  const onClick3 = () => {
    setValue3('paymentMethod', selectedPaymentMethod)
    handleSubmit3((data) => {
      //TODO: update store
      //TODO: dispatch full updated info to backend
      //dispatch(createSupperGroup(...))
      console.log(data)
      console.log('success')
    })()
    history.push(`${PATHS.JOIN_ORDER_MAIN_PAGE}/${supperGroup?.supperGroupId}`)
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
                rightComponent={<UnderlinedButton onClick={onClick2} text="Next" fontWeight={700} />}
                onLeftClick={() => setCount(count - 1)}
              />
              <LineProgress currentStep={2} numberOfSteps={3} />
              <HortSectionContainer>
                <Header>Est. Delivery Fees {RedAsterisk}</Header>
                <HortInputContainer>
                  <InputText
                    type="number"
                    placeholder="e.g $3"
                    name="estDeliveryFee"
                    ref={register2({
                      required: true,
                      valueAsNumber: true,
                    })}
                    style={{
                      borderColor: errors2.estDeliveryFee && 'red',
                      background: errors2.estDeliveryFee && '#ffd1d1',
                    }}
                  />
                </HortInputContainer>
              </HortSectionContainer>
              {errors2.estDeliveryFee?.type === 'required' && <ErrorText>Estimated delivery fees required!</ErrorText>}
              <HortSectionContainer>
                <Header>Split Delivery Fees {RedAsterisk}</Header>
                <HortInputContainer>
                  <Controller
                    name="splitDeliveryFees"
                    control={control2}
                    defaultValue={null}
                    render={() => (
                      <StyledRadioButtons
                        onChange={(selected) => {
                          setValue2('splitDeliveryFees', selected.target.value)
                        }}
                        {...register2('splitDeliveryFees', {
                          required: true,
                        })}
                        style={{
                          borderColor: errors2.splitDeliveryFees && 'red',
                          background: errors2.splitDeliveryFees && '#ffd1d1',
                        }}
                      >
                        <Radio value={1}>Equal</Radio>
                        <Radio value={2}>Proportional</Radio>
                      </StyledRadioButtons>
                    )}
                  />
                </HortInputContainer>
              </HortSectionContainer>
              {errors2.splitDeliveryFees?.type === 'required' && <ErrorText>Please select one option.</ErrorText>}
            </Step>
          )
        case 3:
          return (
            <Step>
              <TopNavBar
                title="Create Order"
                rightComponent={<UnderlinedButton onClick={onClick3} text="Finish" fontWeight={700} />}
                onLeftClick={() => setCount(count - 1)}
              />
              <LineProgress currentStep={3} numberOfSteps={3} />
              <VertSectionContainer>
                <Header>Payment Method {RedAsterisk}</Header>
                <PaymentMethodBubbles
                  {...register3('paymentMethod', { required: true })}
                  paymentMethods={paymentMethods}
                />
                {errors3.paymentMethod?.type === 'required' && (
                  <ErrorText>Payment method(s) is/are required.</ErrorText>
                )}
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Phone Number {RedAsterisk}</Header>
                <VertInputContainer>
                  <InputText
                    type="number"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    ref={register3({
                      required: true,
                      valueAsNumber: true,
                    })}
                    style={{
                      borderColor: errors3.phoneNumber && 'red',
                      background: errors3.phoneNumber && '#ffd1d1',
                    }}
                  />
                  {errors3.phoneNumber?.type === 'required' && <ErrorText>Phone Number is required.</ErrorText>}
                </VertInputContainer>
              </VertSectionContainer>
            </Step>
          )
        default:
          return (
            <Step>
              <TopNavBar
                title="Create Order"
                rightComponent={<UnderlinedButton onClick={onClick1} text="Next" fontWeight={700} />}
                onLeftClick={() => setModalIsOpen(true)}
              />
              {modalIsOpen && (
                <ConfirmationModal
                  title={'Discard Changes?'}
                  hasLeftButton={true}
                  leftButtonText={'Delete'}
                  onLeftButtonClick={onConfirmDiscardClick}
                  rightButtonText={'Cancel'}
                  onRightButtonClick={onCancelClick}
                />
              )}
              <LineProgress currentStep={1} numberOfSteps={3} />
              <VertSectionContainer>
                <Header>Order Name{RedAsterisk}</Header>
                <VertInputContainer>
                  <InputText
                    type="text"
                    placeholder="Order Name"
                    name="supperGroupName"
                    ref={register1({
                      required: true,
                      validate: (input) => input.trim().length !== 0,
                    })}
                    style={{
                      borderColor: errors1.supperGroupName && 'red',
                      background: errors1.supperGroupName && '#ffd1d1',
                    }}
                  />
                  {errors1.supperGroupName?.type === 'required' && <ErrorText>Order name is required.</ErrorText>}
                </VertInputContainer>
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Restaurant{RedAsterisk}</Header>
                <Controller
                  name="restaurant"
                  control={control1}
                  rules={{ required: true }}
                  defaultValue={null}
                  render={() => <RestaurantBubbles defaultRestaurant={"McDonald's"} restaurantList={restaurantList} />}
                />
                {errors1.restaurant?.type === 'required' && <ErrorText>Selecting a restaurant is required.</ErrorText>}
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Closing Time{RedAsterisk}</Header>
                <VertInputContainer>
                  <Controller
                    name="closingTime"
                    control={control1}
                    defaultValue={Date.now()}
                    rules={{ required: true }}
                    render={() => (
                      <InputBox
                        type="datetime-local"
                        placeholder="select time"
                        onChange={(input) => {
                          console.log(input.target.value)
                          setValue1('closingTime', input.target.value)
                        }}
                        {...register1('closingTime', { required: true, pattern: /^\S+@\S+$/i })}
                        style={{
                          borderColor: errors1.closingTime && 'red',
                          background: errors1.closingTime && '#ffd1d1',
                        }}
                      />
                    )}
                  />
                  {errors1.closingTime?.type === 'required' && <ErrorText>Closing Time is required.</ErrorText>}
                </VertInputContainer>
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Max Price</Header>
                <PriceContainer>
                  Set maximum total price
                  <StyledSwitch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    onClick={() => setHasMaxPrice(!hasMaxPrice)}
                    defaultChecked={hasMaxPrice}
                  />
                </PriceContainer>
                {hasMaxPrice && (
                  <FixerContainer>
                    <Controller
                      name="maxPrice"
                      control={control1}
                      defaultValue={null}
                      render={() => <MaxPriceFixer />}
                    />
                  </FixerContainer>
                )}
                {errors1.maxPrice?.type === 'required' && <ErrorText>Setting a Max price is required.</ErrorText>}
              </VertSectionContainer>
            </Step>
          )
      }
    }
  }

  return <Background>{abstractSteps()}</Background>
}
