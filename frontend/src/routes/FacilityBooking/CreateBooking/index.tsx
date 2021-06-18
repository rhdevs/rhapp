import React, { useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { Alert, AutoComplete, Input } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearErrors,
  editBookingCCA,
  editBookingDescription,
  editBookingFromDate,
  editBookingName,
  editBookingToDate,
  fetchAllCCAs,
  getFacilityList,
  handleCreateBooking,
  resetCreateBookingSuccessFailure,
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
    createSuccess,
    createFailure,
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

  useEffect(() => {
    if (createSuccess === true && createFailure === false) {
      history.replace(PATHS.FACILITY_BOOKING_MAIN)
      if (newBookingFacilityId) {
        history.push('/facility/view/' + newBookingFacilityId)
      } else {
        history.push('/facility/view/1')
      }
      dispatch(resetCreateBookingSuccessFailure(true, true))
      setTimeout(() => dispatch(resetCreateBookingSuccessFailure(false, false)), 5000)
    }
  }, [createSuccess, createFailure])

  const CheckIcon = (createBookingError: string) => {
    if (
      createBookingError === '' &&
      newBookingCCA !== '' &&
      newBookingDescription !== '' &&
      newBookingFacilityName !== ''
    ) {
      return (
        <div
          onClick={() => {
            dispatch(handleCreateBooking(newBooking?.bookingID ? true : false))
          }}
        >
          <CheckOutlined style={{ color: 'green' }} />
        </div>
      )
    } else {
      // if (newBookingCCA !== '' || newBookingDescription !== '' || newBookingFacilityName !== '') {
      //   dispatch(SetCreateBookingError('All fields are compulsary!'))
      // }
      return <CheckOutlined style={{ color: '#0000004d' }} />
    }
  }

  const handleFromDateChange = (newDate: string) => {
    dispatch(editBookingFromDate(new Date(newDate)))
  }

  const handleToDateChange = (newDate: string) => {
    dispatch(editBookingToDate(new Date(newDate)))
  }

  const convertLocalTime = (date: Date) => {
    const newDate = new Date(date.getTime() + 28800000)
    return newDate.toISOString().slice(0, -8)
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

  const locationOptions = facilityList
    .filter((facility) => facility.facilityName !== 'Conference Room' && facility.facilityName !== 'Main Area')
    .map((facility) => ({
      value: facility.facilityName,
    }))

  locationOptions.push({ value: 'Conference Room' }, { value: 'Main Area' })

  return (
    <div>
      <TopNavBar
        title={newBooking?.bookingID ? `Edit Booking` : `New Booking`}
        rightComponent={CheckIcon(createBookingError)}
      />
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
              afterClose={() => {
                dispatch(clearErrors())
              }}
            />
          )}
          {createBookingError === '' && <div style={{ margin: '20px' }} />}
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
            <DatePickerRow>
              <StyledTitle>From</StyledTitle>
              <input
                type="datetime-local"
                value={convertLocalTime(newBookingFromDate)}
                onChange={(event) => handleFromDateChange(event.target.value)}
              />
            </DatePickerRow>
            <DatePickerRow>
              <StyledTitle>To</StyledTitle>
              <input
                type="datetime-local"
                value={convertLocalTime(newBookingToDate)}
                onChange={(event) => handleToDateChange(event.target.value)}
              />
            </DatePickerRow>
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
