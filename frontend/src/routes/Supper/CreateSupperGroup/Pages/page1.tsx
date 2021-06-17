import React, { useEffect, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import styled from 'styled-components'
import { TimePicker, Switch } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import ConfirmationModal from '../../../../components/Mobile/ConfirmationModal'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../../components/Supper/FormHeader'
import { LineProgress } from '../../../../components/Supper/LineProgess'
import { MaxPriceFixer } from '../../../../components/Supper/MaxPriceFixer'
import { RestaurantBubbles } from '../../../../components/Supper/RestaurantBubbles'
import { UnderlinedButton } from '../../../../components/Supper/UnderlinedButton'
import { restaurantList } from '../../../../store/stubs'
import { setSupperGroup, unixToFormattedTime, setCreateOrderPage } from '../../../../store/supper/action'
import { SupperGroup, SupperGroupStatus } from '../../../../store/supper/types'
import { RootState } from '../../../../store/types'
import { PATHS } from '../../../Routes'
import { ErrorText, InputText } from '..'
import LoadingSpin from '../../../../components/LoadingSpin'

const VertSectionContainer = styled.div`
  margin: 25px 35px;
`

const VertInputContainer = styled.div`
  padding 5px 0 0 0;
`

const StyledTimePicker = styled(TimePicker)<{ error?: FieldError | undefined }>`
  width: 70%;
  margin: 5px auto 0 auto;
  display: flex;
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const StyledSwitch = styled(Switch)`
  width: fit-content;
  &.ant-switch-checked {
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
  closingTime: number | undefined
  maxPrice: number
}

export const CreateOrderPageOne = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, setError, control, errors, clearErrors, reset } = useForm<FormValues>()
  const { supperGroup, priceLimit, selectedRestaurant, createOrderPage, isLoading } = useSelector(
    (state: RootState) => state.supper,
  )
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
    splitAdditionalCost: undefined,
    status: SupperGroupStatus.OPEN,
    supperGroupId: undefined,
    supperGroupName: '',
    totalPrice: 0,
    closingTime: undefined,
    phoneNumber: 0,
  }

  useEffect(() => {
    dispatch(setCreateOrderPage(1))
  }, [])

  useEffect(() => {
    if (!supperGroup) dispatch(setSupperGroup(initSupperGroup))
  }, [dispatch])

  useEffect(() => {
    if (priceLimit > 0) {
      clearErrors('maxPrice')
    }
  }, [priceLimit])

  useEffect(() => {
    if (supperGroup) {
      reset({
        restaurant: supperGroup.restaurantName,
        closingTime: supperGroup?.closingTime,
        maxPrice: supperGroup.costLimit,
      })
      clearErrors('restaurant')
      clearErrors('closingTime')
      setHasMaxPrice(supperGroup.costLimit ? true : false)
    }
  }, [supperGroup, reset])

  useEffect(() => {
    if (selectedRestaurant) {
      setValue('restaurant', selectedRestaurant)
      clearErrors('restaurant')
    }
  }, [selectedRestaurant])

  const onConfirmDiscardClick = () => {
    dispatch(setSupperGroup(initSupperGroup))
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
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }
    setValue('closingTime', epochClosingTime)
    clearErrors('closingTime')
  }

  let updatedSPInfo

  const onClick = () => {
    updatedSPInfo = { ...supperGroup }
    setValue('restaurant', selectedRestaurant)
    if (priceLimit >= 0 && hasMaxPrice) {
      if (priceLimit === 0) {
        setError('maxPrice', { type: 'min' })
      } else {
        clearErrors('maxPrice')
        setValue('maxPrice', priceLimit)
      }
    }
    if (updatedSPInfo.closingTime) {
      clearErrors('closingTime')
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
      dispatch(setCreateOrderPage(createOrderPage + 1))
      console.log('firstSubmit', updatedSPInfo)
      dispatch(setSupperGroup(updatedSPInfo))
      history.push(`${PATHS.CREATE_SUPPER_GROUP}/2`)
    })()
  }

  return (
    <>
      <TopNavBar
        title="Create Order"
        rightComponent={<UnderlinedButton onClick={onClick} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
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
            <FormHeader headerName={'Order Name'} isCompulsory />
            <VertInputContainer>
              <InputText
                flex
                type="text"
                placeholder="Order Name"
                name="supperGroupName"
                defaultValue={supperGroup?.supperGroupName ?? ''}
                ref={register({
                  required: true,
                  validate: (input) => input.trim().length !== 0,
                })}
                error={errors.supperGroupName}
              />
              {errors.supperGroupName?.type === 'required' && <ErrorText>Order name is required.</ErrorText>}
            </VertInputContainer>
          </VertSectionContainer>
          <VertSectionContainer>
            <FormHeader headerName={'Restaurant'} isCompulsory />
            <Controller
              name="restaurant"
              control={control}
              rules={{ required: true }}
              defaultValue={null}
              render={() => (
                <RestaurantBubbles defaultRestaurant={supperGroup?.restaurantName} restaurantList={restaurantList} />
              )}
            />
            {errors.restaurant?.type === 'required' && <ErrorText>Restaurant is required.</ErrorText>}
          </VertSectionContainer>
          <VertSectionContainer>
            <FormHeader headerName={'Closing Time'} isCompulsory />
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
                    {...(supperGroup?.closingTime && {
                      defaultValue: moment(`${unixToFormattedTime(supperGroup?.closingTime)}`, 'HH:mm:ss'),
                    })}
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
              <>
                <FixerContainer>
                  <Controller
                    name="maxPrice"
                    control={control}
                    defaultValue={null}
                    render={() => <MaxPriceFixer defaultValue={supperGroup?.costLimit} />}
                  />
                </FixerContainer>
                {errors.maxPrice?.type === 'required' && <ErrorText>Max price is required.</ErrorText>}
                {errors.maxPrice?.type === 'min' && <ErrorText>Max price cannot be zero.</ErrorText>}
              </>
            )}
          </VertSectionContainer>
        </>
      )}
    </>
  )
}
