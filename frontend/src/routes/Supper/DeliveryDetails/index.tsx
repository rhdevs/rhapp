import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { DeliveryTimeSetter } from '../../../components/Supper/DeliveryTimeSetter'
import { SGStatusOptions } from '../../../components/Supper/SGStatusOptions'
import { supperGroupStatusList } from '../../../store/stubs'
import { getSupperGroupById, getReadableSupperGroupId, setEstimatedArrivalTime } from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import InputRow from '../../../components/Mobile/InputRow'
import { V1_BACKGROUND } from '../../../common/colours'

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

const ErrorText = styled.p`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 14px;
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

type FormValues = {
  location: string
  cancelReason: string
}

const DeliveryDetails = () => {
  const { register, handleSubmit, watch, errors, control } = useForm<FormValues>()
  const RedAsterisk = <RedText>*</RedText>
  const dispatch = useDispatch()
  const params = useParams<{ supperGroupId: string }>()
  const { supperGroup, deliveryTime, estArrivalTime, selectedSupperGroupStatus, isLoading } = useSelector(
    (state: RootState) => state.supper,
  )
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
        calculateArrivalTime(supperGroup?.estArrivalTime ? supperGroup?.estArrivalTime - currentUNIXDate : 20),
      ),
    )
  }, [dispatch])

  const onClick = () => {
    console.log(watch())
    handleSubmit((data) => {
      console.log('Save changes!')
      //TODO: Update status, delivery time, delivery duration (estArrivalTime, deliveryTime) and location
      console.log(selectedSupperGroupStatus + ',' + estArrivalTime + ',' + deliveryTime + ',' + data.location)
      console.log(errors)
      //TODO: Update comments when status === cancelled
    })()
  }

  const calculateArrivalTime = (deliveryTime: number) => {
    const estimatedTime = Math.round(Date.now() / 1000) + deliveryTime * 60
    return estimatedTime
  }

  useEffect(() => {
    if (deliveryTime !== (supperGroup?.estArrivalTime ? supperGroup?.estArrivalTime - currentUNIXDate : 20)) {
      dispatch(setEstimatedArrivalTime(calculateArrivalTime(deliveryTime)))
    }
  }, [deliveryTime])

  return (
    <Background>
      <TopNavBar title="Delivery Details" />
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            <StyledSGIdText>{getReadableSupperGroupId(supperGroup?.supperGroupId)}</StyledSGIdText>
            <StyledText>Order Status</StyledText>
            <SGStatusOptions default={supperGroup?.status} supperGroupStatusList={supperGroupStatusList} />
            {supperGroupIsCancelled ? (
              <CancellationBox>
                <StyledText>Reason for Cancellation {RedAsterisk}</StyledText>
                <CancellationInputBox>
                  <Controller
                    name="cancelReason"
                    render={({ onChange, value }) => (
                      <InputRow
                        placeholder="Tell us what your event is about!"
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
                  {errors.cancelReason?.type && <ErrorText>This is required!</ErrorText>}
                </CancellationInputBox>
              </CancellationBox>
            ) : (
              <>
                <DeliveryTimeContainer>
                  <StyledText>Delivery Time</StyledText>
                  <StyledTimeText>{estArrivalTime}</StyledTimeText>
                </DeliveryTimeContainer>
                <DeliveryTimeSetter
                  center
                  default={supperGroup?.estArrivalTime ? supperGroup?.estArrivalTime - currentUNIXDate : 20}
                />
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
                  {errors.location?.type === 'required' && <ErrorText>This is required!</ErrorText>}
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
                onButtonClick={onClick}
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
