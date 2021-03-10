import React, { useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { Alert, AutoComplete, Input } from 'antd'
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
  fetchAllCCAs,
  getFacilityList,
  handleCreateBooking,
  resetNewBooking,
  SetIsLoading,
  setNewBookingFacilityName,
  setSelectedFacility,
} from '../../../store/facilityBooking/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'

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
    facilityList,
    isLoading,
    ccaList,
    createBookingError,
    newBookingFacilityId,
  } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(SetIsLoading(true))
    if (newBooking) {
      dispatch(editBookingFromDate(new Date(newBooking.startTime * 1000)))
      dispatch(editBookingToDate(new Date(newBooking.endTime * 1000)))
      dispatch(editBookingDescription(newBooking.description))
      dispatch(editBookingName(newBooking.eventName))
      dispatch(editBookingCCA(newBooking.ccaName ? newBooking.ccaName : ''))
    } else {
      dispatch(resetNewBooking())
    }
    dispatch(fetchAllCCAs())
    if (facilityList.length === 0) {
      dispatch(getFacilityList())
    }
  }, [dispatch])

  const CheckIcon = (
    <div
      onClick={() => {
        dispatch(handleCreateBooking(newBooking?.bookingID ? true : false))
        history.replace(PATHS.FACILITY_BOOKING_MAIN)
        if (newBookingFacilityId) {
          history.push('/facility/view/' + newBookingFacilityId)
        } else {
          history.push('/facility/view/1')
        }
      }}
    >
      <CheckOutlined style={{ color: 'black' }} />
    </div>
  )

  const handleFromDateChange = (newDate: Date) => {
    dispatch(editBookingFromDate(newDate))
  }

  const handleToDateChange = (newDate: Date) => {
    dispatch(editBookingToDate(newDate))
  }

  const setCca = (newCCA: string) => {
    dispatch(editBookingCCA(newCCA))
  }

  const setDescription = (description: string) => {
    dispatch(editBookingDescription(description))
  }

  const setFacility = (newFacilityName: string) => {
    dispatch(setNewBookingFacilityName(newFacilityName))
    const newSelectedFacilityId = facilityList.find((facility) => facility.facilityName === newFacilityName)?.facilityID
    if (newSelectedFacilityId) {
      dispatch(setSelectedFacility(newSelectedFacilityId))
    }
  }

  const toCustomDateFormat = (date: Date) => {
    return `${dayjs(date).format('ddd, MMM D, YYYY, h:mm A')}`
  }

  const locationOptions = facilityList.map((facility) => ({
    value: facility.facilityName,
  }))

  return (
    <div>
      <TopNavBar title={newBooking?.bookingID ? `Edit Booking` : `New Booking`} rightComponent={CheckIcon} />
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <Background>
          {createBookingError !== '' && (
            <Alert
              message={createBookingError}
              // description="You can book up to maximum of 4 hours!"
              type="error"
              style={{ margin: '23px 23px 23px 23px' }}
              closable
              showIcon
            />
          )}
          <AutoComplete
            style={{ width: '50%', marginBottom: '23px' }}
            options={locationOptions}
            value={newBookingFacilityName}
            placeholder="Location"
            onChange={(newFacilityName) => setFacility(newFacilityName)}
            filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
          <StyledInput
            placeholder="Event Name"
            value={newBookingName}
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
          <div style={{ width: '100%', margin: '10px 0px' }}>
            <StyledTitle>CCA</StyledTitle>
            <AutoComplete
              style={{ width: '100%' }}
              options={ccaList.concat({ ccaID: 0, ccaName: 'Personal', category: 'Personal' }).map((cca) => ({
                value: cca.ccaName,
              }))}
              value={newBookingCCA}
              placeholder="Select your CCA, else select Personal"
              onChange={(value) => setCca(value)}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </div>
          <InputRow
            title="Description"
            placeholder="Tell us what your booking is for!"
            value={newBookingDescription}
            setValue={setDescription}
            textarea
          />
        </Background>
      )}
    </div>
  )
}
