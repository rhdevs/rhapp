import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { DeliveryTimeSetter } from '../../../components/Supper/DeliveryTimeSetter'
import { SGStatusOptions } from '../../../components/Supper/SGStatusOptions'
import { supperGroupStatusList } from '../../../store/stubs'
import {
  getSupperGroupById,
  getReadableSupperGroupId,
  setEstimatedArrivalTime,
  updateSupperGroup,
  unixTo12HourTime,
} from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import InputRow from '../../../components/Mobile/InputRow'
import { V1_BACKGROUND } from '../../../common/colours'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'

const Background = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background-color: ${V1_BACKGROUND};
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: 0 auto;
`

const StyledSGIdText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: #00000099;
`

const StyledText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
`

const DeliveryTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  align-items: center;
  justify-content: space-between;
  width: 13rem;
`

const StyledTimeText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 22px;
  color: #000000a6;
`

const ButtonContainer = styled.div`
  margin: 20px auto 10px auto;
`

const InputText = styled.input`
  width: 60%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 10px auto;
  height: 35px;
`

const CancellationBox = styled.div`
  margin: 25px 0px 10px 0px;
`

const CancellationInputBox = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  textarea.ant-input {
    height: 80px;
  }
`

const ErrorText = styled.p<{ padding?: string }>`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-family: 'Inter';
  ${(props) => props.padding && `padding: ${props.padding};`}
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

type FormValues = {
  location: string
  cancelReason: string
}

const DeliveryDetails = () => {
  const { register, handleSubmit, reset, watch, errors, control } = useForm<FormValues>({
    shouldUnregister: false,
  })
  const history = useHistory()
  const RedAsterisk = <RedText>*</RedText>
  const dispatch = useDispatch()
  const params = useParams<{ supperGroupId: string }>()
  const { supperGroup, deliveryTime, estArrivalTime, selectedSupperGroupStatus, isLoading } = useSelector(
    (state: RootState) => state.supper,
  )
  const [orderStatusHasError, setOrderStatusHasError] = useState<boolean>(false)
  const [hasChangedModal, setHasChangedModal] = useState<boolean>(false)
  const currentUNIXDate = Math.round(Date.now() / 1000)
  const supperGroupIsCancelled = selectedSupperGroupStatus === SupperGroupStatus.CANCELLED
  const errorStyling = {
    borderColor: 'red',
    background: '#ffd1d1',
  }

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(
      setEstimatedArrivalTime(
        calculateArrivalTime(
          supperGroup?.estArrivalTime ? Math.round((supperGroup?.estArrivalTime - currentUNIXDate) / 60) : 20,
        ),
      ),
    )
  }, [dispatch])

  // To set initial fields with suppergroup details
  useEffect(() => {
    reset({
      location: supperGroup?.location,
      cancelReason: supperGroup?.comments,
    })
  }, [reset, supperGroup])

  // To control status error
  useEffect(() => {
    if (
      selectedSupperGroupStatus === SupperGroupStatus.ORDERED ||
      selectedSupperGroupStatus === SupperGroupStatus.ARRIVED ||
      selectedSupperGroupStatus === SupperGroupStatus.CANCELLED
    ) {
      setOrderStatusHasError(false)
    }
  }, [selectedSupperGroupStatus])

  const onSubmit = () => {
    // Check if status is filled
    if (
      selectedSupperGroupStatus !== SupperGroupStatus.ORDERED &&
      selectedSupperGroupStatus !== SupperGroupStatus.ARRIVED &&
      selectedSupperGroupStatus !== SupperGroupStatus.CANCELLED
    ) {
      setOrderStatusHasError(true)
      return
    }
    handleSubmit((data) => {
      const initialGroup = supperGroup
      if (
        initialGroup?.status === selectedSupperGroupStatus &&
        unixTo12HourTime(initialGroup?.estArrivalTime) === estArrivalTime &&
        initialGroup?.comments === data.cancelReason &&
        initialGroup?.location === data.location
      ) {
        // No changes were made - ignore submission
        return
      }
      console.log(Math.round(Date.now() / 1000) + 60 * deliveryTime)
      if (selectedSupperGroupStatus === SupperGroupStatus.CANCELLED) {
        const updatedInfo = {
          status: selectedSupperGroupStatus,
          comments: data.cancelReason,
        }
        dispatch(updateSupperGroup(params.supperGroupId, updatedInfo))
      } else {
        const updatedInfo = {
          status: selectedSupperGroupStatus,
          estArrivalTime: Math.round(Date.now() / 1000) + 60 * deliveryTime,
          location: data.location,
        }
        dispatch(updateSupperGroup(params.supperGroupId, updatedInfo))
      }
    })()
  }

  const calculateArrivalTime = (deliveryTime: number) => {
    const estimatedTime = Math.round(Date.now() / 1000) + deliveryTime * 60
    return estimatedTime
  }

  useEffect(() => {
    if (
      deliveryTime !==
      (supperGroup?.estArrivalTime ? Math.round((supperGroup?.estArrivalTime - currentUNIXDate) / 60) : 20)
    ) {
      dispatch(setEstimatedArrivalTime(calculateArrivalTime(deliveryTime)))
    }
  }, [deliveryTime])

  // Transform unix time to minutes
  const defaultDeliveryTime = supperGroup?.estArrivalTime
    ? Math.round((supperGroup?.estArrivalTime - currentUNIXDate) / 60)
    : 20

  const onLeftClick = () => {
    if (
      supperGroup?.status === selectedSupperGroupStatus &&
      unixTo12HourTime(supperGroup?.estArrivalTime) === estArrivalTime &&
      supperGroup?.comments === watch('cancelReason') &&
      supperGroup?.location === watch('location')
    ) {
      // No changes were made
      history.goBack()
    } else {
      setHasChangedModal(true)
    }
  }

  return (
    <Background>
      <TopNavBar title="Delivery Details" onLeftClick={onLeftClick} />
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            {hasChangedModal && (
              <ConfirmationModal
                title="Discard Changes?"
                hasLeftButton
                leftButtonText="Delete"
                onLeftButtonClick={() => history.goBack()}
                rightButtonText="Cancel"
                onRightButtonClick={() => setHasChangedModal(false)}
              />
            )}
            <StyledSGIdText>{getReadableSupperGroupId(supperGroup?.supperGroupId)}</StyledSGIdText>
            <StyledText>Order Status {RedAsterisk}</StyledText>
            <SGStatusOptions default={supperGroup?.status} supperGroupStatusList={supperGroupStatusList} />
            {orderStatusHasError && <ErrorText padding="5px 0 0 0">Status required!</ErrorText>}
            {supperGroupIsCancelled ? (
              <CancellationBox>
                <StyledText>Reason for Cancellation {RedAsterisk}</StyledText>
                <CancellationInputBox>
                  <Controller
                    name="cancelReason"
                    render={({ onChange, value }) => (
                      <InputRow
                        placeholder="e.g. Driver cancelled, Restaurant cancelled.."
                        textarea
                        value={value}
                        onChange={onChange}
                        {...register('cancelReason', {
                          required: true,
                          validate: (input) => input.trim().length !== 0,
                        })}
                        haserror={errors.cancelReason ? true : false}
                      />
                    )}
                    control={control}
                    defaultValue={null}
                  />
                  {errors.cancelReason?.type && <ErrorText>Reason for cancellation required!</ErrorText>}
                </CancellationInputBox>
              </CancellationBox>
            ) : (
              <>
                <DeliveryTimeContainer>
                  <StyledText>Delivery Time</StyledText>
                  <StyledTimeText>{estArrivalTime}</StyledTimeText>
                </DeliveryTimeContainer>
                <DeliveryTimeSetter center default={defaultDeliveryTime < 0 ? 0 : defaultDeliveryTime} />
                <br />
                <StyledText>Collection Point {RedAsterisk}</StyledText>
                <>
                  <InputText
                    type="text"
                    placeholder="Enter Location"
                    name="location"
                    ref={register({
                      required: true,
                      validate: (input) => input.trim().length !== 0,
                    })}
                    style={errors.location ? errorStyling : {}}
                  />
                  {errors.location?.type === 'required' && <ErrorText>Location required!</ErrorText>}
                  {errors.location?.type === 'validate' && <ErrorText>Invalid location!</ErrorText>}
                </>
              </>
            )}
            <ButtonContainer>
              <Button
                stopPropagation
                defaultButtonDescription="Save Changes"
                buttonWidth="fit-content"
                buttonHeight="2.3rem"
                descriptionStyle={{
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 200,
                  fontSize: '17px',
                  lineHeight: '22px',
                }}
                onButtonClick={onSubmit}
                isFlipButton={false}
              />
            </ButtonContainer>
          </>
        )}
      </MainContainer>
    </Background>
  )
}

export default DeliveryDetails
