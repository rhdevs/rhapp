import React, { useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { Input } from 'antd'
import { DatePicker } from 'antd-mobile'
import { CheckOutlined } from '@ant-design/icons'
import enUs from 'antd-mobile/lib/date-picker/locale/en_US'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  editBookingCCA,
  editBookingDescription,
  editBookingFromDate,
  editBookingName,
  editBookingToDate,
  handleCreateBooking,
} from '../../../store/facilityBooking/action'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`
const StyledInput = styled(Input)`
  &.ant-input {
    width: 100%;
    border-radius: 30px;
    border: 1px solid #d9d9d9;
    padding: 5px 10px;
    margin: 0px 0px 20px 0px;
  }
  &.ant-input::placeholder {
    color: #d9d9d9;
  }
`
const StyledTitle = styled.text`
  font-family: Inter;
  color: black;
  font-size: 15px;
  font-weight: bold;
  line-height: 30px;
  margin-right: 20px;
  white-space: nowrap;
`

const DatePickerRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
  color: #666666;
`

export default function CreateBooking() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    newBooking,
    newBookingName,
    newBookingFromDate,
    newBookingToDate,
    newBookingCCA,
    newBookingDescription,
    newBookingFacilityName,
  } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    if (newBooking) {
      dispatch(editBookingFromDate(newBooking.startTime))
      dispatch(editBookingToDate(newBooking.endTime))
      dispatch(editBookingDescription(newBooking.description))
      dispatch(editBookingName(newBooking.eventName))
      dispatch(editBookingCCA('RHDevs')) // To fetch CCA Name instead
    }
  }, [dispatch])

  const CheckIcon = (
    <div
      onClick={() => {
        dispatch(handleCreateBooking())
        history.push('/facility/view/' + newBookingFacilityName)
      }}
    >
      <CheckOutlined style={{ color: 'black' }} />
    </div>
  )

  const handleFromDateChange = (newDate: Date) => {
    if (newBookingToDate > newDate) {
      dispatch(editBookingFromDate(newDate))
    }
  }

  const handleToDateChange = (newDate: Date) => {
    if (newBookingFromDate < newDate) {
      dispatch(editBookingToDate(newDate))
    }
  }

  const setCca = (newCCA: string) => {
    dispatch(editBookingCCA(newCCA))
  }

  const setDescription = (description: string) => {
    dispatch(editBookingDescription(description))
  }

  const toCustomDateFormat = (date: Date) => {
    return `${dayjs(date).format('ddd, MMM D, YYYY, h:mm A')}`
  }

  return (
    <div>
      <TopNavBar title={newBooking?.bookingID ? `Edit Booking` : `New Booking`} rightComponent={CheckIcon} />
      <Background>
        <StyledTitle>{newBookingFacilityName}</StyledTitle>
        <StyledInput
          placeholder="Event Name"
          value={newBooking?.bookingID ? newBooking.eventName : newBookingName}
          onChange={(e) => dispatch(editBookingName(e.target.value))}
        />
        <div style={{ width: '100%' }}>
          <DatePicker mode="datetime" locale={enUs} value={newBookingFromDate} onChange={handleFromDateChange}>
            <DatePickerRow>
              <StyledTitle>From</StyledTitle>
              <span>{`${toCustomDateFormat(newBookingFromDate)}`}</span>
            </DatePickerRow>
          </DatePicker>
          <DatePicker mode="datetime" locale={enUs} value={newBookingToDate} onChange={handleToDateChange}>
            <DatePickerRow>
              <StyledTitle>To</StyledTitle>
              <span>{`${toCustomDateFormat(newBookingToDate)}`}</span>
            </DatePickerRow>
          </DatePicker>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>{`Duration: ${dayjs(
            newBookingToDate,
          )
            .diff(dayjs(newBookingFromDate), 'hour', true)
            .toFixed(1)} hours`}</div>
        </div>
        <InputRow title="CCA" placeholder="CCA Name" value={newBookingCCA} setValue={setCca} />
        <InputRow
          title="Description"
          placeholder="Tell us what your booking is for!"
          value={newBookingDescription}
          setValue={setDescription}
          textarea
        />
      </Background>
    </div>
  )
}
