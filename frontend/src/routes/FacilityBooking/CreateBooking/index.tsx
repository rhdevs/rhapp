import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AutoComplete } from 'antd'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { RootState } from '../../../store/types'
import {
  fetchAllCCAs,
  getFacilityList,
  setIsLoading,
  resetBooking,
  handleCreateNewBooking,
  setBookingStartTime,
  setBookingEndTime,
  setBookingEndDate,
  handleCreateBooking,
  resetCreateBookingSuccessFailure,
  resetNewBooking,
  setNewBookingFacilityName,
  setSelectedFacility,
  setBookingRepeat,
} from '../../../store/facilityBooking/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import InputField from '../../../components/Mobile/InputField'
// TODO, change the way how InputField works?
import { Switch } from '../../../components/Switch'
import { BookingStatus } from '../../../store/facilityBooking/types'
import ConflictAlert from '../../../components/ConflictAlert'
import { unixToFullDate } from '../../../common/unixToFullDate'
import SelectableField from '../../../components/SelectableField'
import ButtonComponent from '../../../components/Button'
import { unixToFormattedTime } from '../../../common/unixToFormattedTime'
import { get24Hourtime } from '../../../common/get24HourTime'

const Background = styled.div`
  background-color: #fff;
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`

const WeeklyRecurrenceRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
  color: #666;
  align-items: center;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0;
`
const StyledTitle = styled.div`
  display: flex;
  font-family: Lato;
  color: #000;
  font-size: 15px;
  line-height: 30px;
  font-weight: bold;
  white-space: nowrap;
`
const CCAInput = styled(AutoComplete)`
  width: 100%;
  color: #000;
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 10px !important;
    border: 0;
    background-color: #f3f3f9;
  }
`

type FormValues = {
  eventName: string
  description: string
  descriptionRegister: string
}

export default function CreateBooking() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const {
    handleSubmit,
    formState: { errors },
    watch,
    register,
    setValue,
  } = useForm<FormValues>()
  const [isWeeklyOn, setIsWeeklyOn] = useState<boolean>(false)
  const [ccaName, setCcaName] = useState<string>('')
  const {
    facilityList,
    isLoading,
    ccaList,
    booking,
    bookingStatus,
    bookingStartTime,
    bookingEndTime,
    bookingEndDate,
  } = useSelector((state: RootState) => state.facilityBooking)
  const FormData = watch()
  const ValidForm = () => {
    if (isWeeklyOn) {
      return watch('eventName') !== '' && ccaName !== '' && bookingEndDate !== 0
    }
    return watch('eventName') !== '' && ccaName !== ''
  }
  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchAllCCAs())
    if (facilityList.length === 0) {
      dispatch(getFacilityList())
    }
    return () => {
      dispatch(resetNewBooking)
    }
  }, [dispatch])

  const getFacilityName = () => {
    return facilityList.find((facility) => facility.facilityID === Number(params.facilityId))?.facilityName
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const ccaId = ccaList.find((cca) => cca.ccaName === ccaName)?.ccaID

    if (!ccaId && ccaName !== 'Personal') {
      //selected cca is not valid (error)
    } else {
      handleSubmit((data) => {
        console.log(data, ccaName)
        dispatch(
          handleCreateNewBooking(
            Number(params.facilityId),
            data.eventName,
            bookingStartTime,
            bookingEndTime,
            bookingEndDate,
            ccaId,
            data.description,
          ),
        )
      })()
    }
  }

  useEffect(() => {
    console.log(watch())
    console.log(errors)
  })

  useEffect(() => {
    if (bookingStatus === BookingStatus.SUCCESS) {
      history.replace(PATHS.FACILITY_BOOKING_MAIN)
      history.push(`${PATHS.VIEW_FACILITY}/${params.facilityId}`)
    }
  }, [bookingStatus])

  return (
    <Background>
      <TopNavBar title={`Book ${getFacilityName()}`} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Form onSubmit={onSubmit}>
          <InputField
            name={'eventName'}
            title="Event Name"
            placeholder="Event Name"
            required
            register={register}
            setValue={setValue}
            errors={errors.eventName}
          />
          <SelectableField
            title="Start"
            value={
              bookingStartTime == 0 ? '' : unixToFullDate(bookingStartTime) + ' at ' + get24Hourtime(bookingStartTime)
            }
            isCompulsory={true}
            onClick={() => dispatch(setBookingStartTime(1644641028))}
            // TODO, Redirect to choose timing page
          ></SelectableField>
          <SelectableField
            title="End"
            value={bookingEndTime == 0 ? '' : unixToFullDate(bookingEndTime) + ' at ' + get24Hourtime(bookingEndTime)}
            isCompulsory={true}
            onClick={() => dispatch(setBookingEndTime(1644648228))}
            // TODO, Redirect to choose timing page
          ></SelectableField>
          <Container>
            <StyledTitle>CCA</StyledTitle>
            <CCAInput
              options={ccaList.concat({ ccaID: 0, ccaName: 'Personal', category: 'Personal' }).map((cca) => ({
                value: cca.ccaName,
              }))}
              value={ccaName}
              placeholder="CCA"
              onChange={(value) => setCcaName(value)}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              notFoundContent="No Matching CCAs"
              allowClear
            />
          </Container>
          <InputField
            name={'description'}
            title="Description"
            placeholder="Tell us what your booking is for!"
            textArea
            register={register}
            setValue={setValue}
            errors={errors.description}
          />
          <WeeklyRecurrenceRow>
            <StyledTitle>Weekly Recurrence</StyledTitle>
            <Switch isOn={isWeeklyOn} handleToggle={() => setIsWeeklyOn(!isWeeklyOn)} switchSize={50} />
          </WeeklyRecurrenceRow>
          {isWeeklyOn && (
            <SelectableField
              title="End Date"
              value={bookingEndDate == 0 ? '' : unixToFullDate(bookingEndDate)}
              isCompulsory={true}
              onClick={() => dispatch(setBookingEndDate(1644648228))}
              // TODO, Redirect to choose date calender page
            ></SelectableField>
          )}
          {bookingStatus === BookingStatus.CONFLICT && <ConflictAlert errorType={'CONFLICT'} />}
          <ButtonComponent
            state={ValidForm() ? 'primary' : 'secondary'}
            text="Submit"
            type="submit"
            disabled={!ValidForm()}
            onClick={() => console.log('submitted')}
          ></ButtonComponent>
        </Form>
      )}
    </Background>
  )
}
