import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { Radio, Switch, Input, TimePicker } from 'antd'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { paymentMethods, restaurantList } from '../../../store/stubs'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { createSupperGroup, setOrder, unixTo12HourTime } from '../../../store/supper/action'
import { PaymentMethod, SplitACMethod, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { useHistory } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { PATHS } from '../../Routes'
import moment from 'moment'
import { updateIndexedAccessTypeNode } from 'typescript'

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
  align-items: baseline;
`

const Header = styled.text`
  font-weight: 700;
  font-size: 16px;
`

const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
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
  padding 5px 0 0 0;
`

const HortInputContainer = styled.div`
  padding: 0px 0px 0px 15px;
  width: 45%;
`

const InputText = styled.input<{ flex?: boolean }>`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.flex && 'display: flex;'}
`

const StyledTimePicker = styled(TimePicker)`
  width: 70%;
  margin: 5px auto 0 auto;
  display: flex;
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
    setError: setError1,
    control: control1,
    errors: errors1,
    clearErrors: clearErrors1,
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
    setError: setError3,
    clearErrors: clearErrors3,
  } = useForm<FormValues3>()

  useEffect(() => {
    dispatch(setOrder(initSupperGroup))
  }, [dispatch])

  useEffect(() => {
    if (selectedPaymentMethod.length === 0 || pmError !== 0) {
      setValue3('paymentMethod', undefined)
      setError3('paymentMethod', { type: 'required' })
    } else {
      pmError = 0
      clearErrors3('paymentMethod')
      setValue3('paymentMethod', selectedPaymentMethod)
    }
  }, [selectedPaymentMethod])

  let updatedSPInfo

  const onChange = (time, timeString) => {
    if (!time || !timeString) {
      setValue1('closingTime', undefined)
      setError1('closingTime', { type: 'required' })
      return
    }
    console.log(time._d)
    console.log(timeString)
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }
    console.log(epochClosingTime)
    console.log(unixTo12HourTime(epochClosingTime))
    setValue1('closingTime', epochClosingTime)
    clearErrors1('closingTime')
    updatedSPInfo = { ...supperGroup, closingTime: epochClosingTime }
  }

  const onClick1 = () => {
    setValue1('restaurant', selectedRestaurant)
    console.log(selectedRestaurant)
    if (priceLimit > 0 && hasMaxPrice) {
      setValue1('maxPrice', priceLimit)
    }
    handleSubmit1((data) => {
      updatedSPInfo = {
        ...supperGroup,
        supperGroupName: data.supperGroupName,
        restaurantName: data.restaurant,
      }
      if (hasMaxPrice) {
        updatedSPInfo = { ...updatedSPInfo, costLimit: data.maxPrice }
      }
      setOrder(updatedSPInfo)
      setCount(count + 1)
    })()
  }

  const onClick2 = () => {
    handleSubmit2((data) => {
      updatedSPInfo = {
        ...supperGroup,
        additionalCost: data.estDeliveryFee,
        SplitAdditionalCost: data.splitDeliveryFees,
      }
      setOrder(updatedSPInfo)
      setCount(count + 1)
    })()
  }

  const onClick3 = () => {
    handleSubmit3((data) => {
      updatedSPInfo = {
        ...supperGroup,
        paymentMethods: data.paymentMethod,
        phoneNumber: data.phoneNumber,
        ownerId: localStorage.userID,
      }
      setOrder(updatedSPInfo)
      //TODO: fix dispatch full updated info to backend
      console.log(updatedSPInfo)
      dispatch(createSupperGroup(updatedSPInfo))
      console.log('success')
    })()
    // history.push(`${PATHS.USER_JOIN_ORDER_MAIN_PAGE}/${supperGroup?.supperGroupId}`)
  }

  const onConfirmDiscardClick = () => {
    setOrder(initSupperGroup)
    history.goBack()
  }

  const onCancelClick = () => {
    setModalIsOpen(false)
  }

  let pmError = 0
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
                    placeholder="$$$"
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
                {paymentMethods
                  .filter((pm) => pm !== PaymentMethod.CASH)
                  .map((pm) => {
                    return (
                      selectedPaymentMethod.includes(pm) && (
                        <InputText
                          flex
                          type="text"
                          name={pm}
                          ref={register3({
                            required: true,
                            validate: (input) => input.trim().length !== 0,
                          })}
                          style={{
                            borderColor: errors3[`${pm}`] && 'red',
                            background: errors3[`${pm}`] && '#ffd1d1',
                          }}
                          placeholder={pm + ' Link'}
                        />
                      )
                    )
                  })}
                {selectedPaymentMethod.filter((pm) => {
                  if (errors3[`${pm}`]) {
                    return pmError++
                  }
                })}
                {errors3.paymentMethod && pmError === 0 && <ErrorText>Payment method required!</ErrorText>}
                {pmError !== 0 && <ErrorText>Payment link{pmError > 1 && 's'} required!</ErrorText>}
              </VertSectionContainer>
              <VertSectionContainer>
                <Header>Phone Number {RedAsterisk}</Header>
                <VertInputContainer>
                  <InputText
                    flex
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
                    flex
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
                      <StyledTimePicker
                        use12Hours
                        format="h:mm a"
                        onChange={onChange}
                        ref={register1({ required: true })}
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
