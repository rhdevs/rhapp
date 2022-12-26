import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { AutoComplete } from 'antd'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import { unixToFullDate } from '../../../common/unixToFullDate'
import { get24Hourtime } from '../../../common/get24HourTime'

import {
  fetchAllCCAs,
  getFacilityList,
  setIsLoading,
  handleCreateNewBooking,
  setBookingEndDate,
  setSelectedBlockTimestamp,
  setSelectedStartTime,
  setSelectedEndTime,
  resetTimeSelectorSelection,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'
import { BookingStatus, SearchMode } from '../../../store/facilityBooking/types'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import InputField from '../../../components/Mobile/InputField'
// TODO, change the way how InputField works?
import { Switch } from '../../../components/Switch'
import SelectableField from '../../../components/SelectableField'
import ButtonComponent from '../../../components/Button'

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
}

/**
 * # Create Booking Form
 * Path: `/facility/booking/create/:facilityId`
 *
 * ## Page Description
 * This page contains the booking form for creating a booking. \
 * Once the user selects the start and end time on the `CreateBookingDailyView` page, they will be directed to here
 *
 * @remarks
 *
 */

export default function CreateBookingForm() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    handleSubmit,
    formState: { errors },
    watch,
    register,
    setValue,
  } = useForm<FormValues>()

  const [ccaName, setCcaName] = useState<string>('')
  const {
    facilityList,
    isLoading,
    ccaList,
    bookingStatus,
    bookingStartTime,
    bookingEndTime,
    bookingEndDate,
    searchMode,
  } = useSelector((state: RootState) => state.facilityBooking)
  const [isWeeklyOn, setIsWeeklyOn] = useState<boolean>(bookingEndDate !== 0)

  const params = useParams<{ facilityId: string }>()

  const selectedFacilityId = parseInt(params.facilityId)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchAllCCAs())
    if (facilityList.length === 0) {
      dispatch(getFacilityList())
    }
    return () => {
      // dispatch(resetNewBooking) // TODO this function is defunct; newBooking is unused
    }
  }, [dispatch])

  /**
   *
   * @returns boolean to check if form is filled, else submit button is disabled
   */
  const formIsValid = () => {
    if (isWeeklyOn) {
      return watch('eventName') !== '' && ccaName !== '' && bookingEndDate !== 0
    }
    return watch('eventName') !== '' && ccaName !== ''
  }

  /**
   *
   * @returns string of the facility's name
   */
  const getFacilityName = () => {
    return facilityList.find((facility) => facility.facilityID === Number(selectedFacilityId))?.facilityName
  }

  const handleToggleWeekly = () => {
    setIsWeeklyOn(!isWeeklyOn)
    isWeeklyOn && dispatch(setBookingEndDate(0))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const ccaId = ccaList.find((cca) => cca.ccaName === ccaName)?.ccaID

    if (!ccaId && ccaName !== 'Personal') {
      //selected cca is not valid (error)
    } else {
      handleSubmit((data) => {
        console.log(data, ccaName)
        if (bookingStatus === BookingStatus.CONFLICT) {
          // setModalIsOpen(true)
        } else {
          history.replace(PATHS.VIEW_ALL_FACILITIES)
          history.push(`${PATHS.VIEW_FACILITY}/${selectedFacilityId}`)
          dispatch(
            handleCreateNewBooking(
              Number(params.facilityId),
              data.eventName,
              bookingStartTime,
              bookingEndTime,
              bookingEndDate === 0 ? bookingEndTime : bookingEndDate,
              ccaId,
              data.description,
            ),
          )
        }
      })()
    }
  }

  const goBackToTimeSelectionPage = () => {
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}/reselect`)
  }

  /**
   * when user goes back, reset user's time selections
   */
  const reselectBothDates = () => {
    dispatch(resetTimeSelectorSelection())
    goBackToTimeSelectionPage()
  }

  /**
   * TODO not yet implemented
   */
  const reselectStartDate = () => {
    reselectBothDates()
  }

  /**
   * reselect end date only
   */
  const reselectEndDate = () => {
    dispatch(setSelectedEndTime(0))
    goBackToTimeSelectionPage()
  }

  const onLeftClick = () => {
    history.push(
      searchMode === SearchMode.BY_TIME ? PATHS.SEARCH_BOOKING_RESULTS : `${PATHS.VIEW_FACILITY}/${selectedFacilityId}`,
    )
  }

  return (
    <Background>
      <TopNavBar title={`Book ${getFacilityName()}`} onLeftClick={onLeftClick} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Form onSubmit={onSubmit}>
          <InputField
            name="eventName"
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
            onClick={reselectStartDate}
            isCompulsory
          />
          <SelectableField
            title="End"
            value={bookingEndTime == 0 ? '' : unixToFullDate(bookingEndTime) + ' at ' + get24Hourtime(bookingEndTime)}
            onClick={reselectEndDate}
            isCompulsory
          />
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
            name="description"
            title="Description"
            placeholder="Tell us what your booking is for!"
            textArea
            register={register}
            setValue={setValue}
            errors={errors.description}
          />
          <WeeklyRecurrenceRow>
            <StyledTitle>Weekly Recurrence</StyledTitle>
            <Switch isOn={isWeeklyOn} handleToggle={() => handleToggleWeekly()} switchSize={50} />
          </WeeklyRecurrenceRow>
          {isWeeklyOn && (
            <SelectableField
              title="End Date"
              value={bookingEndDate === 0 ? '' : unixToFullDate(bookingEndDate)}
              isCompulsory
              onClick={() => history.push(`${PATHS.SELECT_RECURRING_BOOKING_END_DATE}/${params.facilityId}`)}
            />
          )}
          <div style={{ width: '100%', height: '30px' }} />
          <ButtonComponent state="primary" text="Submit" type="submit" disabled={!formIsValid()} onClick={() => null} />
        </Form>
      )}
    </Background>
  )
}
