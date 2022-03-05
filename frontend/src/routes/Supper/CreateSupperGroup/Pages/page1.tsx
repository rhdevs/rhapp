import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import styled from 'styled-components'
import { Switch } from 'antd'
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../../components/Supper/FormHeader'
import { LineProgress } from '../../../../components/Supper/LineProgess'
import { MaxPriceFixer } from '../../../../components/Supper/MaxPriceFixer'
import { RestaurantBubbles } from '../../../../components/Supper/RestaurantBubbles'
import { UnderlinedButton } from '../../../../components/Supper/UnderlinedButton'
import { initSupperGroup, restaurantList } from '../../../../store/stubs'
import { unixToFormattedTime } from '../../../../common/unixToFormattedTime'
import { RootState } from '../../../../store/types'
import { PATHS } from '../../../Routes'
import { ErrorText } from '..'
import LoadingSpin from '../../../../components/LoadingSpin'
import { V1_BLUE } from '../../../../common/colours'
import { Restaurants, SupperGroup } from '../../../../store/supper/types'
import { errorStyling, Input, StyledTimePicker } from '../../EditSupperGroup'
import { ConfirmationModal } from '../../../../components/Mobile/ConfirmationModal'
import { setSupperGroup } from '../../../../store/supper/action/setter'

const FormContainer = styled.div`
  width: 80vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
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
    background-color: ${V1_BLUE};
  }
`

type FormValues = {
  onLeftTopButtonClick: (() => void) | undefined
  supperGroupName: string
  restaurant: Restaurants
  closingTime: number | undefined
}

export const CreateOrderPageOne = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<FormValues>()
  const { supperGroup, priceLimit, selectedRestaurant, isLoading } = useSelector((state: RootState) => state.supper)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [hasMaxPrice, setHasMaxPrice] = useState<boolean>(supperGroup?.costLimit ? true : false)

  useEffect(() => {
    if (supperGroup) {
      reset({
        supperGroupName: supperGroup.supperGroupName,
        restaurant: supperGroup.restaurantName as Restaurants,
        closingTime: supperGroup.closingTime,
      })
      if (supperGroup.restaurantName) clearErrors('restaurant')
      if (supperGroup.closingTime) clearErrors('closingTime')
      setHasMaxPrice(supperGroup.costLimit ? true : false)
    }
  }, [supperGroup, reset])

  // Control restaurants validity
  useEffect(() => {
    if (selectedRestaurant) {
      setValue('restaurant', selectedRestaurant as Restaurants)
      clearErrors('restaurant')
    }
  }, [selectedRestaurant])

  const onConfirmDiscardClick = () => {
    dispatch(setSupperGroup(initSupperGroup))
    history.push(PATHS.SUPPER_HOME)
  }

  const onCancelClick = () => {
    setModalIsOpen(false)
  }

  const onLeftClick = () => {
    if (JSON.stringify(supperGroup) === JSON.stringify(initSupperGroup)) {
      history.push(PATHS.SUPPER_HOME)
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

  const onSubmit = () => {
    let updatedSPInfo: SupperGroup = { ...(supperGroup ?? initSupperGroup) }
    setValue('restaurant', selectedRestaurant as Restaurants)
    if (updatedSPInfo.closingTime) {
      clearErrors('closingTime')
    }

    handleSubmit((data) => {
      updatedSPInfo = {
        ...updatedSPInfo,
        supperGroupName: data.supperGroupName,
        restaurantName: data.restaurant,
        closingTime: data.closingTime,
        costLimit: hasMaxPrice ? priceLimit : undefined,
      }
      dispatch(setSupperGroup(updatedSPInfo))
      history.push(`${PATHS.CREATE_SUPPER_GROUP}/2`)
    })()
  }

  return (
    <>
      <TopNavBar
        title="Create Group"
        rightComponent={<UnderlinedButton onClick={onSubmit} text="Next" fontWeight={700} />}
        onLeftClick={onLeftClick}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {modalIsOpen && (
            <ConfirmationModal
              title="Discard Changes?"
              hasLeftButton
              leftButtonText="Delete"
              onLeftButtonClick={onConfirmDiscardClick}
              rightButtonText="Cancel"
              onRightButtonClick={onCancelClick}
            />
          )}
          <LineProgress margin="0 0 1.5rem 0" currentStep={1} numberOfSteps={3} />
          <FormContainer>
            <FormHeader headerName="Group Name" isCompulsory />
            <Input
              type="text"
              defaultValue={supperGroup?.supperGroupName ?? ''}
              placeholder="Group name"
              {...register('supperGroupName', {
                required: true,
                validate: (input) => input.trim().length !== 0,
                maxLength: 50,
              })}
              style={errors.supperGroupName ? errorStyling : {}}
            />
            {errors.supperGroupName?.type === 'required' && <ErrorText>Order Name required!</ErrorText>}
            {errors.supperGroupName?.type === 'validate' && <ErrorText>Invalid Order Name!</ErrorText>}
            {errors.supperGroupName?.type === 'maxLength' && <ErrorText>Group name exceeded 50 characters!</ErrorText>}
            <FormHeader topMargin headerName="Restaurant" isCompulsory />
            <Controller
              control={control}
              name="restaurant"
              rules={{ required: true }}
              defaultValue={undefined}
              render={() => (
                <RestaurantBubbles defaultRestaurant={supperGroup?.restaurantName} restaurantList={restaurantList} />
              )}
            />
            {errors.restaurant?.type === 'required' && <ErrorText>Restaurant is required!</ErrorText>}
            <FormHeader topMargin headerName="Closing Time" isCompulsory />
            <Controller
              control={control}
              name="closingTime"
              rules={{ required: true }}
              render={() => (
                <StyledTimePicker
                  use12Hours
                  format="h:mm a"
                  onChange={onChange}
                  style={errors.closingTime ? errorStyling : {}}
                  {...(supperGroup?.closingTime && {
                    defaultValue: moment(`${unixToFormattedTime(supperGroup?.closingTime)}`, 'HH:mm:ss'),
                  })}
                />
              )}
              defaultValue={undefined}
            />
            {errors.closingTime?.type === 'required' && <ErrorText>Closing Time required!</ErrorText>}
            <FormHeader topMargin headerName="Max Price" />
            <PriceContainer>
              Set maximum total price
              <StyledSwitch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onClick={() => setHasMaxPrice(!hasMaxPrice)}
                defaultChecked={hasMaxPrice}
              />
            </PriceContainer>
            {hasMaxPrice && <MaxPriceFixer min={5} defaultValue={supperGroup?.costLimit} center />}
          </FormContainer>
        </>
      )}
    </>
  )
}
