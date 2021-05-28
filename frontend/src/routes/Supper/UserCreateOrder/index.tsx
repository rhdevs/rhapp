import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { Radio, Input, TimePicker } from 'antd'
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
import InputRow from '../../../components/Mobile/InputRow'
import { withSuccess } from 'antd/lib/modal/confirm'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'

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
  width: 50%;
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

const TimeBox = styled(TimePicker)`
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
  supperGroupName: string
  restaurant: string
  selectTime: number
  maxPrice: number
  estDeliveryFee: number
  phoneNumber: number
}

export default function UserCreateOrder() {
  const dispatch = useDispatch()
  const { selectedRestaurant, priceLimit } = useSelector((state: RootState) => state.supper)
  const [count, setCount] = useState(1)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const RedAsterisk = <RedText>*</RedText>
  const initSupperGroup: SupperGroup = {
    costLimit: 0,
    createdAt: 10000000,
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
    supperGroupId: 1,
    supperGroupName: '',
    totalPrice: 0,
    userIdList: [],
    closingTime: 10000000,
  }

  const history = useHistory()

  const { register, handleSubmit, setValue, watch, control, errors } = useForm<FormValues>()
  // const onSubmit = (data) => console.log(data)

  useEffect(() => {
    //TODO: dispatch new order to backend
    dispatch(setOrder(initSupperGroup))
  }, [dispatch])

  const onClick = () => {
    setValue('restaurant', selectedRestaurant)
    if (priceLimit > 0) {
      setValue('maxPrice', priceLimit)
    }
    //console.log(watch())
    handleSubmit((data) => {
      console.log('submitting' + data)
      console.log('old count' + count)
      if (errors === undefined) {
        setCount(count + 1)
        console.log('new count' + count)
      } else {
        console.log('errors' + errors.estDeliveryFee + errors.maxPrice + errors.restaurant + errors.selectTime)
      }
      if (count > 3) {
        console.log('success')
      }
    })()
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
                    {...register('estDeliveryFee', {
                      min: 0,
                      maxLength: 12,
                      pattern: { value: /[0-9]+/i, message: 'Invalid input.' },
                    })}
                  />
                  {errors.estDeliveryFee?.type === 'required' && <ErrorText>This field is required.</ErrorText>}
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
                    {...register('phoneNumber', {
                      required: true,
                    })}
                  />
                  {errors.phoneNumber?.type === 'required' && <ErrorText>This field is required.</ErrorText>}
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
                    name="supperGroupName"
                    ref={register({
                      required: true,
                      validate: (input) => input.trim().length !== 0,
                    })}
                    style={{
                      borderColor: errors.supperGroupName && 'red',
                      background: errors.supperGroupName && '#ffd1d1',
                    }}
                  />
                  {errors.supperGroupName?.type === 'required' && <ErrorText>This field is required.</ErrorText>}
                </VertInputContainer>
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Restaurant{RedAsterisk}</Header>
                <Controller
                  name="restaurant"
                  control={control}
                  rules={{ required: true }}
                  render={() => <RestaurantBubbles defaultRestaurant={"McDonald's"} restaurantList={restaurantList} />}
                />
                {errors.restaurant?.type === 'required' && <ErrorText>Restaurant is required.</ErrorText>}
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Closing Time{RedAsterisk}</Header>
                <VertInputContainer>
                  <Controller
                    name="selectTime"
                    control={control}
                    defaultValue={Date.now()}
                    rules={{ required: true }}
                    render={() => (
                      <InputBox
                        type="datetime-local"
                        placeholder="select time"
                        defaultValue={Date.now()}
                        onChange={(time) => {
                          console.log(time.timeStamp)
                          setValue('selectTime', time.timeStamp)
                        }}
                        {...register('selectTime', { required: true, pattern: /^\S+@\S+$/i })}
                        style={{
                          borderColor: errors.selectTime && 'red',
                          background: errors.selectTime && '#ffd1d1',
                        }}
                      />
                    )}
                  />
                  {errors.selectTime?.type === 'required' && <ErrorText>Closing Time required.</ErrorText>}
                </VertInputContainer>
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Max Price{RedAsterisk}</Header>
                <FixerContainer>
                  <Controller
                    name="maxPrice"
                    control={control}
                    defaultValue={null}
                    rules={{ required: true }}
                    render={() => <MaxPriceFixer />}
                  />
                </FixerContainer>
                {errors.maxPrice?.type === 'required' && <ErrorText>Setting a Max price is required.</ErrorText>}
              </VertSectionContainer>
            </Step>
          )
      }
    }
  }

  return <Background>{abstractSteps()}</Background>
}
