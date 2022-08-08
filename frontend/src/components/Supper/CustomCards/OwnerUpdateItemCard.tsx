import React, { useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { ErrorText } from '../../../routes/Supper/CreateSupperGroup'
import { updateOwnerEdits, updateSupperGroup } from '../../../store/supper/action/level1/putRequests'
import { Food, SupperGroup, UpdateAction, Updates } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { FormHeader } from '../FormHeader'
import { MainCard } from '../MainCard'
import { QuantityTracker } from '../QuantityTracker'
import { SupperButton } from '../SupperButton'

const Input = styled.input<{ error?: FieldError | undefined }>`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

const TextArea = styled.textarea<{ error?: FieldError | undefined }>`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: fit-content;
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}

  ::placeholder {
    line-height: 18px;
  }
`

type Props = {
  foodItem?: boolean
  deliveryFee?: boolean
  food?: Food | null
  foodId?: string
  orderId?: string
  supperGroup?: SupperGroup | null
  hasTouchedSetter: React.Dispatch<React.SetStateAction<boolean>>
  all?: boolean
}

type FormData = {
  changes: string | undefined
  newPrice: number
  newQuantity: number
  editReason: string
  newDeliveryFee: number
}

export const OwnerUpdateItemCard = (props: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    formState: { touched },
  } = useForm<FormData>({
    shouldUnregister: false,
  })
  const dispatch = useDispatch()
  const history = useHistory()
  const { count } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (props.foodItem) {
      reset({
        changes: props.food?.updates?.change,
        newPrice: props.food?.updates?.updatedPrice,
        editReason: props.food?.updates?.reason,
      })
    }
    if (props.deliveryFee) {
      reset({
        newDeliveryFee: props.supperGroup?.wasDeliveryUpdated ? props.supperGroup?.additionalCost : undefined,
      })
    }
  }, [reset, props.food, props.supperGroup])

  useEffect(() => {
    props.hasTouchedSetter(Object.values(touched).length ? true : false)
  }, [touched, watch()])

  const onUpdateItemClick = () => {
    handleSubmit((data) => {
      const priceWasUpdated =
        data.newPrice === null
          ? false
          : (props.food?.updates?.updatedPrice ?? props.food?.foodPrice ?? 0) === data.newPrice
          ? false
          : true
      const quantityWasUpdated =
        (props.food?.updates?.updatedQuantity ?? props.food?.quantity ?? 0) === count ? false : true
      const hasChanges = data.changes !== ''

      const update: Updates = {
        updateAction: UpdateAction.UPDATE,
        reason: data.editReason,
        ...(hasChanges && { change: data.changes }),
        ...(priceWasUpdated && { updatedPrice: data.newPrice }),
        ...(quantityWasUpdated && !props.all && { updatedQuantity: count }),
      }
      dispatch(updateOwnerEdits(props.supperGroup?.supperGroupId, props.foodId, update, props.all ?? false))
      history.goBack()
    })()
  }

  const onDeleteItemClick = () => {
    setValue('newPrice', 0)
    handleSubmit((data) => {
      const update: Updates = {
        updateAction: UpdateAction.REMOVE,
        reason: data.editReason,
        updatedPrice: data.newPrice,
      }
      dispatch(updateOwnerEdits(props.supperGroup?.supperGroupId, props.foodId, update, props.all ?? false))
      history.goBack()
    })()
  }

  const onUpdateDeliveryClick = () => {
    handleSubmit((data) => {
      const updatedInfo = {
        additionalCost: data.newDeliveryFee,
        wasDeliveryUpdated: true,
      }
      dispatch(updateSupperGroup(props.supperGroup?.supperGroupId, updatedInfo))
      history.goBack()
    })()
  }

  return (
    <>
      <MainCard margin="0 23px" flexDirection="column" padding="1.5rem 2rem !important" minHeight="fit-content">
        <>
          {props.foodItem && (
            <>
              <FormHeader headerName="What changed?" />
              <Input
                type="text"
                defaultValue=""
                placeholder="List changes here"
                name="changes"
                ref={register({
                  required: false,
                })}
              />
              <FormHeader headerName="New Price (per quantity)" topMargin />
              <Input
                type="number"
                placeholder="Indicate new price"
                name="newPrice"
                defaultValue=""
                ref={register({
                  required: false,
                  valueAsNumber: true,
                  min: 0,
                })}
              />
              {errors.newPrice?.type === 'min' && <ErrorText>Invalid price!</ErrorText>}
              {!props.all && (
                <>
                  <FormHeader headerName="New Quantity" topMargin />
                  <QuantityTracker
                    center
                    min={1}
                    max={props.food?.updates?.updatedQuantity ?? props.food?.quantity ?? 1}
                    default={props.food?.updates?.updatedQuantity ?? props.food?.quantity ?? 1}
                  />
                </>
              )}
              <FormHeader headerName="Reason for edit" isCompulsory topMargin />
              <TextArea
                defaultValue=""
                placeholder="e.g. Price different on app, sides unavailable, etc.."
                name="editReason"
                ref={register({
                  required: false,
                  ...(props.foodItem && { validate: (input) => input.trim().length !== 0 }),
                })}
                error={errors.editReason}
              />
              {errors.editReason?.type === 'required' && <ErrorText>Reason required!</ErrorText>}
              {errors.editReason?.type === 'validate' && <ErrorText>Invalid reason!</ErrorText>}
              <SupperButton
                htmlType="submit"
                onButtonClick={onDeleteItemClick}
                defaultButtonDescription={
                  props.all && (props.food?.quantity ?? 0) > 1 ? 'Delete Item for All' : 'Delete Item'
                }
                ghost
                buttonWidth="100%"
                style={{ margin: '2rem 0 0.5rem 0' }}
              />
              <SupperButton
                htmlType="submit"
                onButtonClick={onUpdateItemClick}
                defaultButtonDescription={
                  props.all && (props.food?.quantity ?? 0) > 1 ? 'Update Item for All' : 'Update Item'
                }
                buttonWidth="100%"
                style={{ margin: '1rem 0 0 0' }}
              />
            </>
          )}
          {props.deliveryFee && (
            <>
              <FormHeader headerName="Delivery Fee" isCompulsory />
              <Input
                type="number"
                placeholder="Indicate new delivery fee"
                name="newDeliveryFee"
                defaultValue=""
                ref={register({
                  required: true,
                  ...(props.deliveryFee && { validate: (input) => input.trim().length !== 0 }),
                  valueAsNumber: true,
                  min: 0,
                })}
                error={errors.newDeliveryFee}
              />
              {errors.newDeliveryFee?.type === 'required' && <ErrorText>Delivery fee required!</ErrorText>}
              {(errors.newDeliveryFee?.type === 'min' || errors.newDeliveryFee?.type === 'validate') && (
                <ErrorText>Invalid delivery fee!</ErrorText>
              )}
              <SupperButton
                htmlType="submit"
                onButtonClick={onUpdateDeliveryClick}
                defaultButtonDescription="Update"
                buttonWidth="100%"
                style={{ margin: '2rem 0 0 0' }}
              />
            </>
          )}
        </>
      </MainCard>
      <br />
    </>
  )
}
