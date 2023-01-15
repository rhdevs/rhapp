import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { AutoComplete } from 'antd'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import { unixToFullDate } from '../../../common/unixToFullDate'
import { unixToFullDateTime } from '../../../common/unixToFullDateTime'

import {
  fetchAllCCAs,
  getFacilityList,
  setIsLoading,
  handleCreateNewBooking,
  setBookingEndDate,
  setSelectedEndTime,
  resetTimeSelectorSelection,
  setBookingFormCCA,
  setBookingFormDescription,
  setBookingFormName,
  resetBookingFormInfo,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'
import { SearchMode } from '../../../store/facilityBooking/types'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import InputField from '../../../components/Mobile/InputField'
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
    facilityList,
    isLoading,
    ccaList,
    bookingStartTime,
    bookingEndTime,
    bookingEndDate,
    searchMode,
    bookingFormName,
    bookingFormCCA,
    bookingFormDescription,
  } = useSelector((state: RootState) => state.facilityBooking)
  const [isWeeklyOn, setIsWeeklyOn] = useState<boolean>(bookingEndDate !== 0)

  const params = useParams<{ facilityId: string }>()

  const selectedFacilityId = parseInt(params.facilityId)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchAllCCAs())
    facilityList.length === 0 && dispatch(getFacilityList())
  }, [dispatch])

  /**
   * @returns boolean to check if form is filled, else submit button is disabled
   */
  const formIsValid = () => {
    return bookingFormName !== '' && bookingFormCCA !== '' && !(isWeeklyOn && bookingEndDate === 0)
  }

  /**
   * @returns string of the facility's name
   */
  const getFacilityName = () => {
    return facilityList.find((facility) => facility.facilityID === Number(selectedFacilityId))?.facilityName
  }

  const handleToggleWeekly = () => {
    setIsWeeklyOn(!isWeeklyOn)
    isWeeklyOn && dispatch(setBookingEndDate(0))
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    const ccaId = ccaList.find((cca) => cca.ccaName === bookingFormCCA)?.ccaID

    history.replace(PATHS.VIEW_ALL_FACILITIES)
    history.push(`${PATHS.VIEW_FACILITY}/${selectedFacilityId}`)
    dispatch(
      handleCreateNewBooking(
        Number(params.facilityId),
        bookingFormName,
        bookingStartTime,
        bookingEndTime,
        bookingEndDate === 0 ? bookingEndTime : bookingEndDate,
        ccaId,
        bookingFormDescription,
      ),
    )
    dispatch(resetBookingFormInfo())
  }

  /** when user goes back, reset user's time selections */
  const reselectBothDates = () => {
    dispatch(resetTimeSelectorSelection())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}/reselect`)
  }

  /** currently the same as reselectBothDates */
  const reselectStartDate = () => {
    reselectBothDates()
  }

  /**  reselect end date only */
  const reselectEndDate = () => {
    dispatch(setSelectedEndTime(0))
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}/reselect`)
  }

  /** similar to reselectBothDates, but without the reselect in the url path to prevent infinite loop */
  const goBack = () => {
    dispatch(resetTimeSelectorSelection())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`)
  }

  const onLeftClick = () => {
    dispatch(resetBookingFormInfo())
    searchMode === SearchMode.BY_TIME ? history.push(PATHS.SEARCH_BY_TIME_BOOKING_RESULTS) : goBack()
  }

  return (
    <Background>
      <TopNavBar title={`Book ${getFacilityName() ?? ''}`} onLeftClick={onLeftClick} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Form>
          <InputField
            title="Event Name"
            placeholder="Event Name"
            value={bookingFormName}
            required
            onChange={(e) => dispatch(setBookingFormName(e.target.value))}
          />
          <SelectableField
            title="Start"
            value={unixToFullDateTime(bookingStartTime)}
            onClick={reselectStartDate}
            isCompulsory
          />
          <SelectableField
            title="End"
            value={unixToFullDateTime(bookingEndTime)}
            onClick={reselectEndDate}
            isCompulsory
          />
          <Container>
            <StyledTitle>CCA</StyledTitle>
            <CCAInput
              options={ccaList.concat({ ccaID: 0, ccaName: 'Personal', category: 'Personal' }).map((cca) => ({
                value: cca.ccaName,
              }))}
              value={bookingFormCCA}
              placeholder="CCA"
              onChange={(value) => dispatch(setBookingFormCCA(value))}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              notFoundContent="No Matching CCAs"
              allowClear
            />
          </Container>
          <InputField
            title="Description"
            placeholder="Tell us what your booking is for!"
            value={bookingFormDescription}
            textArea
            onChange={(e) => dispatch(setBookingFormDescription(e.target.value))}
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
          <ButtonComponent state="primary" text="Submit" type="submit" disabled={!formIsValid()} onClick={onSubmit} />
        </Form>
      )}
    </Background>
  )
}
