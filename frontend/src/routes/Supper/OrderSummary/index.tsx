import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import PullToRefresh from 'pull-to-refresh-react'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND } from '../../../common/colours'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { SupperGroupStatus } from '../../../store/supper/types'
import { TwoStepCancelGroupModal } from '../../../components/Supper/Modals/TwoStepCancelGroupModal'
import { updateSupperGroup } from '../../../store/supper/action/level1/putRequests'
import { getOrderSummaryPageDetails } from '../../../store/supper/action/level2'
import { onRefresh } from '../../../common/reloadPage'
import { DiscardChangesModal } from '../../../components/Supper/Modals/DiscardChangesModal'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { Controller, useForm } from 'react-hook-form'
import { unixTo12HourTime } from '../../../common/unixTo12HourTime'
import { StyledTimePicker } from '../EditSupperGroup'
import moment from 'moment'
import { unixToFormattedTime } from '../../../common/unixToFormattedTime'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
  display: flex;
  flex-direction: column;
`

const FormContainer = styled.div`
  margin: 20px 30px 10px;
  display: flex;
  flex-direction: column;
`

const InputText = styled.input`
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 10px auto;
  height: 35px;
  width: 100%;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 90vw;
  margin: 2rem auto 0.5rem auto;
`

type FormValues = {
  location: string
  estArrivalTime: number | undefined
}

const OrderSummary = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { collatedOrder, isLoading, supperGroup } = useSelector((state: RootState) => state.supper)
  const [twoStepModalIsOpen, setTwoStepModalIsOpen] = useState<boolean>(false)
  const [hasChangedModal, setHasChangedModal] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    errors,
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { touched },
  } = useForm<FormValues>({
    shouldUnregister: false,
  })
  const errorStyling = {
    borderColor: 'red',
    background: '#ffd1d1',
  }

  useEffect(() => {
    dispatch(getOrderSummaryPageDetails(params.supperGroupId))
  }, [dispatch])

  useEffect(() => {
    if (supperGroup?.status === SupperGroupStatus.CANCELLED) {
      history.replace(`${PATHS.SUPPER_HOME}`)
      history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
    }
  }, [supperGroup?.status])

  const onLeftClick = () => {
    Object.values(touched).length ? setHasChangedModal(true) : history.goBack()
  }

  const onChange = (time, timeString) => {
    if (!time || !timeString) {
      setValue('estArrivalTime', undefined)
      setError('estArrivalTime', { type: 'required' })
      return
    }
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }
    setValue('estArrivalTime', epochClosingTime)
    clearErrors('estArrivalTime')
  }

  const onClick = () => {
    handleSubmit((data: FormValues) => {
      const updatedInfo = {
        status: SupperGroupStatus.ORDERED,
        location: data.location,
        estArrivalTime: data.estArrivalTime,
      }
      if (updatedInfo.estArrivalTime) {
        clearErrors('estArrivalTime')
      }
      dispatch(updateSupperGroup(params.supperGroupId, updatedInfo))
      history.replace(`${PATHS.SUPPER_HOME}`)
      history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
    })()
  }

  return (
    <MainContainer>
      <PullToRefresh onRefresh={onRefresh}>
        <TopNavBar title="Order Summary" onLeftClick={onLeftClick} />
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            {hasChangedModal && <DiscardChangesModal modalSetter={setHasChangedModal} />}
            {twoStepModalIsOpen && (
              <TwoStepCancelGroupModal
                modalSetter={setTwoStepModalIsOpen}
                supperGroupId={params.supperGroupId}
                onLeftButtonClick={() => {
                  history.replace(PATHS.SUPPER_HOME)
                  history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
                }}
              />
            )}
            <OrderCard
              margin="0 23px"
              collatedOrder={collatedOrder}
              ownerId={supperGroup?.ownerId}
              supperGroupStatus={supperGroup?.status}
              splitCostMethod={supperGroup?.splitAdditionalCost}
              supperGroup={supperGroup}
              supperTotalCost={supperGroup?.totalPrice}
              isEditable
            />
            <FormContainer>
              <FormHeader topMargin headerName="Est Arrival Time" isCompulsory />
              <Controller
                control={control}
                name="estArrivalTime"
                rules={{ required: true }}
                render={() => (
                  <StyledTimePicker
                    use12Hours
                    format="h:mm a"
                    onChange={onChange}
                    style={errors.estArrivalTime ? errorStyling : {}}
                    {...(supperGroup?.estArrivalTime && {
                      defaultValue: moment(`${unixToFormattedTime(supperGroup?.estArrivalTime)}`, 'HH:mm:ss'),
                    })}
                  />
                )}
                defaultValue={null}
              />
              {errors.estArrivalTime?.type === 'required' && <ErrorText>Closing Time required!</ErrorText>}
            </FormContainer>
            <FormContainer>
              <FormHeader headerName="Collection Point" isCompulsory />
              <InputText
                type="text"
                placeholder="Enter Location"
                name="location"
                ref={register({
                  required: true,
                  ...(watch('location') && { validate: (input) => input.trim().length !== 0 }),
                })}
                style={errors.location ? errorStyling : {}}
                defaultValue={supperGroup?.location ?? ''}
              />
              {errors.location?.type === 'required' && <ErrorText>Location required!</ErrorText>}
              {errors.location?.type === 'validate' && <ErrorText>Invalid location!</ErrorText>}
            </FormContainer>
            <ButtonContainer>
              <SupperButton
                ghost
                center
                defaultButtonDescription="Order Cancelled"
                onButtonClick={() => setTwoStepModalIsOpen(true)}
              />
              <SupperButton center defaultButtonDescription="Order Placed" onButtonClick={onClick} />
            </ButtonContainer>
            <InformationCard updateSummary />
          </>
        )}
      </PullToRefresh>
    </MainContainer>
  )
}

export default OrderSummary
