import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import dayjs from 'dayjs'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { Input } from 'antd'
import { DatePicker } from 'antd-mobile'
import { LeftOutlined, CheckOutlined } from '@ant-design/icons'
import enUs from 'antd-mobile/lib/date-picker/locale/en_US'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

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

const BackIcon = (
  <Link to={'/schedule'}>
    <LeftOutlined style={{ color: 'black', padding: '0 10px' }} />
  </Link>
)

const CheckIcon = (
  <div>
    <CheckOutlined style={{ color: 'black' }} />
  </div>
)

const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)

export default function CreateBooking() {
  const [bookingName, setBookingName] = useState('')
  const [fromDateTime, setFromDateTime] = useState(now)
  const [toDateTime, setToDateTime] = useState(dayjs(now).add(1, 'hour').toDate())
  const [cca, setCca] = useState('')
  const [description, setDescription] = useState('')

  const handleFromDateChange = (newDate: Date) => {
    if (toDateTime < newDate) {
      setToDateTime(dayjs(newDate).add(1, 'hour').toDate())
    }

    setFromDateTime(newDate)
  }

  const handleToDateChange = (newDate: Date) => {
    if (fromDateTime > newDate) {
      setFromDateTime(dayjs(newDate).subtract(1, 'hour').toDate())
    }

    setToDateTime(newDate)
  }

  const toCustomDateFormat = (date: Date) => {
    return `${dayjs(date).format('ddd, MMM D, YYYY, h:mm A')}`
  }

  return (
    <div>
      <TopNavBar title={`New Booking`} leftIcon leftIconComponent={BackIcon} rightComponent={CheckIcon} />
      <Background>
        <StyledInput placeholder="Event Name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} />
        <div style={{ width: '100%' }}>
          <DatePicker mode="datetime" locale={enUs} value={fromDateTime} onChange={handleFromDateChange}>
            <DatePickerRow>
              <StyledTitle>From</StyledTitle>
              <span>{`${toCustomDateFormat(fromDateTime)}`}</span>
            </DatePickerRow>
          </DatePicker>
          <DatePicker mode="datetime" locale={enUs} value={toDateTime} onChange={handleToDateChange}>
            <DatePickerRow>
              <StyledTitle>To</StyledTitle>
              <span>{`${toCustomDateFormat(toDateTime)}`}</span>
            </DatePickerRow>
          </DatePicker>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>{`Duration: ${dayjs(toDateTime)
            .diff(dayjs(fromDateTime), 'hour', true)
            .toFixed(1)} hours`}</div>
        </div>
        <InputRow title="CCA" placeholder="CCA Name" value={cca} setValue={setCca} />
        <InputRow
          title="Description"
          placeholder="Tell us what your booking is for!"
          value={description}
          setValue={setDescription}
          textarea
        />
      </Background>
    </div>
  )
}
