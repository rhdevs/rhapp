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
  SetIsLoading,
  resetBooking,
  handleCreateNewBooking,
  setBookingStartTime,
  setBookingEndTime,
} from '../../../store/facilityBooking/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import InputField from '../../../components/Mobile/InputField'
import { Switch } from '../../../components/Switch'
import { get24Hourtime } from '../../../common/get24HourTime'
import { BookingStatus } from '../../../store/facilityBooking/types'
import ConflictAlert from '../../../components/ConflictAlert'
import { unixToFullDate } from '../../../common/unixToFullDate'

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
  padding: 0px 20px;
`

const StyledDateName = styled.label`
  font-family: Inter;
  z-index: 1;
  margin-top: 8px;
  margin-left: 8px;
  color: black;
  width: 70%;
  height: 20px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: bold;
  position: absolute;
  background: #f3f3f9;
  pointer-events: none;
`

const StyledTitle = styled.text`
  font-family: Inter;
  padding: 5px 10px;
  color: black;
  width: 100%;
  text-align: left;
  font-size: 15px;
  font-weight: bold;
  line-height: 30px;
  white-space: nowrap;
`

const DatePickerRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin: 10px 0;
  color: #666;
  height: 34px;
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

const CCAInput = styled(AutoComplete)`
  width: 100%;
  color: #bfbfbf;
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 10px !important;
    border: 0;
    background-color: #f3f3f9;
  }
`

const RepeatWeeklyPickerRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
  color: #666666;
`

export default function CreateBooking() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const { register, handleSubmit, errors, control } = useForm()
  const [isWeeklyOn, setIsWeeklyOn] = useState(false)
  const [ccaName, setCcaName] = useState<string>('')
  const { facilityList, isLoading, ccaList, booking, bookingStatus, bookingStartTime, bookingEndTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(resetBooking())
    dispatch(fetchAllCCAs())
    if (facilityList.length === 0) {
      dispatch(getFacilityList())
    }
  }, [dispatch])

  const getFacilityName = () => {
    return facilityList.find((facility) => facility.facilityID === Number(params.facilityId))?.facilityName
  }

  /* 
  TODO: There are two places that are called conference room, 1 in kuok and 1 in UL. The name has to deconflict.
  Used to be there are two Main Area also but since name is short, they are now Main Area (UL) and Main Area (Hall)
  */
  const locationOptions = facilityList
    .filter((facility) => facility.facilityName !== 'Conference Room')
    .map((facility) => ({
      value: facility.facilityName,
    }))

  locationOptions.push({ value: 'Conference Room' })

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
            ccaId,
            data.description,
          ),
        )
      })()
    }
  }

  useEffect(() => {
    dispatch(setBookingStartTime(1644641028))
    dispatch(setBookingEndTime(1644648228))
  }, [])

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
          <Controller
            name="eventName"
            render={({ onChange, value }) => (
              <InputField
                title="Event Name"
                {...register('eventName', { required: 'Event name is required!' })}
                placeholder="Event Name"
                value={value}
                onChange={onChange}
              />
            )}
            control={control}
            defaultValue={null}
          />
          {errors.eventName && <p>{errors.eventName?.message}</p>}
          <div style={{ width: '100%' }}>
            <StyledTitle>Start</StyledTitle>
            {/* DATETIME IS FULLY INTEGRATED, AND CHANGING THE FORMAT RESULTS IN IT NOT WORKING, NEED TO DO FURTHER REVIEW */}
            <DatePickerRow>
              <StyledDateName>
                {/* 
                TODO: create dd month yyyy (eg 27 April 2022) method in common folder
                format(new Date(booking?.startTime), 'd MMMM yyyy')
                */}
                {bookingStartTime && unixToFullDate(bookingStartTime) + ' at ' + get24Hourtime(bookingStartTime)}
              </StyledDateName>
            </DatePickerRow>
            <StyledTitle>End</StyledTitle>
            <DatePickerRow>
              <StyledDateName>
                {bookingEndTime && unixToFullDate(bookingEndTime) + ' at ' + get24Hourtime(bookingEndTime)}
              </StyledDateName>
            </DatePickerRow>
          </div>
          <StyledTitle>CCA</StyledTitle>
          <CCAInput
            options={ccaList.concat({ ccaID: 0, ccaName: 'Personal', category: 'Personal' }).map((cca) => ({
              value: cca.ccaName,
            }))}
            value={ccaName}
            placeholder="CCA"
            onChange={(value) => setCcaName(value)}
            filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            notFoundContent="No Matching CCAs"
            allowClear
          />
          <Controller
            name="description"
            render={({ onChange, value }) => (
              <InputField
                title="Description"
                placeholder="Tell us what your booking is for!"
                textArea
                value={value}
                onChange={onChange}
              />
            )}
            control={control}
            defaultValue={null}
          />
          <WeeklyRecurrenceRow>
            <StyledTitle>Weekly Recurrence</StyledTitle>
            <Switch isOn={isWeeklyOn} handleToggle={() => setIsWeeklyOn(!isWeeklyOn)} switchSize={50} />
          </WeeklyRecurrenceRow>
          {isWeeklyOn && (
            <RepeatWeeklyPickerRow>
              <StyledTitle>End</StyledTitle>
              {/* TODO: add weekly recurrence button row */}
            </RepeatWeeklyPickerRow>
          )}
          {bookingStatus === BookingStatus.CONFLICT && <ConflictAlert />}
          <div>
            <button type="submit">Confirm</button>
          </div>
        </Form>
      )}
    </Background>
  )
}
