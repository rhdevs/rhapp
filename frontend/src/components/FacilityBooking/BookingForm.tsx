import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { AutoComplete } from 'antd'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../routes/Routes'
import { unixToFullDate } from '../../common/unixToFullDate'
import { unixToFullDateTime } from '../../common/unixToFullDateTime'

import { RootState } from '../../store/types'
import {
  fetchAllCCAs,
  getFacilityList,
  setBookingEndDate,
  setBookingFormCCA,
  setBookingFormDescription,
  setBookingFormName,
  setIsLoading,
} from '../../store/facilityBooking/action'

import InputField from '../../components/Mobile/InputField'
import { Switch } from '../../components/Switch'
import SelectableField from '../../components/SelectableField'
import ButtonComponent from '../../components/Button'

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

type Props = {
  facilityId: number
  startDateOnClick: () => void
  endDateOnClick: () => void
  submitOnClick: MouseEventHandler<HTMLButtonElement>
  isEditBooking?: boolean
  // weeklyRecurrenceSelector?: boolean
  // disableNameInput?: boolean
}

// TODO docs
const BookingForm = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    ccaList,
    bookingStartTime,
    bookingEndTime,
    bookingEndDate,
    bookingFormName,
    bookingFormCCA,
    bookingFormDescription,
    facilityList,
  } = useSelector((state: RootState) => state.facilityBooking)
  const [isWeeklyOn, setIsWeeklyOn] = useState<boolean>(bookingEndDate !== 0)

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
    return facilityList.find((facility) => facility.facilityID === props.facilityId)?.facilityName
  }

  const handleToggleWeekly = () => {
    setIsWeeklyOn(!isWeeklyOn)
    isWeeklyOn && dispatch(setBookingEndDate(0))
  }

  return (
    <Form>
      <InputField
        title="Event Name"
        placeholder="Event Name"
        value={bookingFormName}
        required
        onChange={(e) => dispatch(setBookingFormName(e.target.value))}
        disabled={props.isEditBooking}
      />
      <SelectableField
        title="Start"
        value={unixToFullDateTime(bookingStartTime)}
        onClick={props.startDateOnClick}
        isCompulsory
      />
      <SelectableField
        title="End"
        value={unixToFullDateTime(bookingEndTime)}
        onClick={props.endDateOnClick}
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
          filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
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
      {!props.isEditBooking && (
        <WeeklyRecurrenceRow>
          <StyledTitle>Weekly Recurrence</StyledTitle>
          <Switch isOn={isWeeklyOn} handleToggle={() => handleToggleWeekly()} switchSize={50} />
        </WeeklyRecurrenceRow>
      )}
      {isWeeklyOn && (
        <SelectableField
          title="End Date"
          value={bookingEndDate === 0 ? '' : unixToFullDate(bookingEndDate)}
          isCompulsory
          onClick={() => history.push(`${PATHS.SELECT_RECURRING_BOOKING_END_DATE}/${props.facilityId}`)}
        />
      )}
      <div style={{ width: '100%', height: '30px' }} />
      <ButtonComponent
        state="primary"
        text="Submit"
        type="submit"
        disabled={!formIsValid()}
        onClick={props.submitOnClick}
      />
    </Form>
  )
}

export default BookingForm
