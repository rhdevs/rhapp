import React, { useEffect, useState } from 'react'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Controller, FieldError, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { LineProgress } from '../../../components/Supper/LineProgess'
import { Switch, TimePicker } from 'antd'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { VerticalInputForm } from '../../../components/Supper/VerticalInputForm'
import { restaurantList } from '../../../store/stubs'
import { Restaurants, SplitACMethod, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import moment from 'moment'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { setOrder } from '../../../store/supper/action'
import { useHistory } from 'react-router-dom'

const VertSectionContainer = styled.div`
  margin: 25px 35px;
`

const VertInputContainer = styled.div`
  padding 5px 0 0 0;
`

const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

const StyledTimePicker = styled(TimePicker)`
  width: 70%;
  margin: 5px auto 0 auto;
  display: flex;
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const StyledSwitch = styled(Switch)<{ flex?: boolean; error?: FieldError | undefined }>`
  width: fit-content;
  &.ant-switch-checked {
    background-color: #002642;
  }
  ${(props) => props.error && 'borderColor: red;'}
  ${(props) => props.error && 'background:#ffd1d1;'}
`

const FixerContainer = styled.div`
  display: flex;
  justify-content: center;
`

type FormValues = {
  supperGroupName: string
  restaurant: string
  closingTime: number
  maxPrice: number
}

export const CreateOrderPageOne = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, setError, control, errors, clearErrors, reset } = useForm<FormValues>()
  const { supperGroup, priceLimit, selectedRestaurant } = useSelector((state: RootState) => state.supper)
  const [count, setCount] = useState(1)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [hasMaxPrice, setHasMaxPrice] = useState<boolean>(supperGroup?.costLimit ? true : false)

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
    closingTime: 0,
    phoneNumber: 0,
  }

  useEffect(() => {
    if (supperGroup) {
      reset({
        restaurant: supperGroup.restaurantName,
        maxPrice: supperGroup.costLimit,
      })
      setHasMaxPrice(supperGroup.costLimit ? true : false)
    }
  }, [supperGroup, reset])

  const onConfirmDiscardClick = () => {
    dispatch(setOrder(initSupperGroup))
    history.goBack()
  }

  const onCancelClick = () => {
    setModalIsOpen(false)
  }

  const onLeftClick = () => {
    if (JSON.stringify(supperGroup) === JSON.stringify(initSupperGroup)) {
      history.goBack()
    } else {
      setModalIsOpen(true)
    }
  }

  const onChange = (time, timeString) => {
    if (!time || !timeString) {
      setValue('closingTime', undefined)
      setError('closingTime', { type: 'required' })
      return
    }
    console.log('time.d', time._d)
    console.log('timeString', timeString)
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }
    console.log('ECT', epochClosingTime)
    setValue('closingTime', epochClosingTime)
    clearErrors('closingTime')
  }

  const onClick = () => {
    let updatedSPInfo = { ...initSupperGroup }
    if (priceLimit > 0 && hasMaxPrice) {
      setValue('maxPrice', priceLimit)
    }
    handleSubmit((data: FormValues) => {
      updatedSPInfo = {
        ...updatedSPInfo,
        supperGroupName: data.supperGroupName,
        restaurantName: data.restaurant,
        closingTime: data.closingTime,
      }
      if (hasMaxPrice) {
        updatedSPInfo = { ...updatedSPInfo, costLimit: data.maxPrice }
      }
      setCount(count + 1)
      console.log('firstSubmit', updatedSPInfo)
      dispatch(setOrder(updatedSPInfo))
    })()
  }

  return (
    <>
      <TopNavBar
        title="Create Order"
        rightComponent={<UnderlinedButton onClick={onClick} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
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
      <VerticalInputForm
        headerName={'Order Name'}
        inputType={'text'}
        inputName={'supperGroupName'}
        inputPlaceHolder={'Order Name'}
        inputDefaulValue={supperGroup?.supperGroupName ?? ''}
      />
      <VertSectionContainer>
        <FormHeader headerName={'Restaurant'} />
        <Controller
          name="restaurant"
          control={control}
          rules={{ required: true }}
          defaultValue={null}
          render={() => (
            <RestaurantBubbles
              defaultRestaurant={supperGroup?.restaurantName ?? Restaurants.MCDONALDS}
              restaurantList={restaurantList}
            />
          )}
        />
        {errors.restaurant?.type === 'required' && <ErrorText>Selecting a restaurant is required.</ErrorText>}
      </VertSectionContainer>
      <VertSectionContainer>
        <FormHeader headerName={'Closing Time'} />
        <VertInputContainer>
          <Controller
            name="closingTime"
            control={control}
            rules={{ required: true }}
            defaultValue={null}
            render={() => (
              <StyledTimePicker
                use12Hours
                error={errors.closingTime}
                format="h:mm a"
                onChange={onChange}
                name="closingTime"
                ref={register({ required: true })}
                //defaultValue={moment(`${unixToFormattedTime(supperGroup?.closingTime)}`, 'HH:mm:ss')}
              />
            )}
          />
          {errors.closingTime?.type === 'required' && <ErrorText>Closing Time is required.</ErrorText>}
        </VertInputContainer>
      </VertSectionContainer>
      <VertSectionContainer>
        <FormHeader headerName={'Max Price'} />
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
              control={control}
              defaultValue={null}
              render={() => <MaxPriceFixer defaultValue={supperGroup?.costLimit ?? 0} />}
            />
          </FixerContainer>
        )}
        {errors.maxPrice?.type === 'required' && <ErrorText>Setting a Max price is required.</ErrorText>}
      </VertSectionContainer>
    </>
  )
}
