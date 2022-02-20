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
import { BookingStatus } from '../../../store/facilityBooking/types'
import ConflictAlert from '../../../components/ConflictAlert'
import { unixToFullDate } from '../../../common/unixToFullDate'
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
  padding: 0px 20px;
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
  margin: 10px 0px;
`
const StyledTitle = styled.div`
  display: flex;
  font-family: Lato;
  color: black;
  font-size: 15px;
  line-height: 30px;
  font-weight: bold;
  white-space: nowrap;
  text-align: left;
`
const CCAInput = styled(AutoComplete)`
  width: 100%;
  color: black;
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 10px !important;
    border: 0;
    background-color: #f3f3f9;
  }
`

export default function CreateBooking() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const { register, handleSubmit, errors, control, watch } = useForm()
  const [isWeeklyOn, setIsWeeklyOn] = useState(false)
  const [ccaName, setCcaName] = useState<string>('')
  const { facilityList, isLoading, ccaList, booking, bookingStatus, bookingStartTime, bookingEndTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const FormData = watch()
  const ValidForm = () => {
    if (isWeeklyOn) {
      return FormData.eventName !== '' && FormData.description !== '' && ccaName !== '' && !'some booking end variable'
    }
    return FormData.eventName !== '' && FormData.description !== '' && ccaName !== ''
  }
  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(fetchAllCCAs())
    if (facilityList.length === 0) {
      dispatch(getFacilityList())
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
              <InputField title="Event Name" placeholder="Event Name" value={value} onChange={onChange} />
            )}
            control={control}
            defaultValue=""
          />
          {errors.eventName && <p>{errors.eventName?.message}</p>}
          <SelectableField
            title="Start"
            value={''}
            isCompulsory={true}
            onClick={function (): void {
              throw new Error('Function not implemented.')
            }}
          ></SelectableField>
          <SelectableField
            title="End"
            value={''}
            isCompulsory={true}
            onClick={function (): void {
              throw new Error('Function not implemented.')
            }}
          ></SelectableField>
          {/* TODO: Someone to update the CCA style to make the words have correct font color + add the Title to it */}
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
            defaultValue=""
          />
          <WeeklyRecurrenceRow>
            <StyledTitle>Weekly Recurrence</StyledTitle>
            <Switch isOn={isWeeklyOn} handleToggle={() => setIsWeeklyOn(!isWeeklyOn)} switchSize={50} />
          </WeeklyRecurrenceRow>
          {isWeeklyOn && (
            <SelectableField
              title="End Date"
              value={''}
              isCompulsory={true}
              // error={true}
              onClick={() => ValidForm()}
            ></SelectableField>
          )}
          {bookingStatus === BookingStatus.CONFLICT && <ConflictAlert errorType={'CONFLICT'} />}
          {/* TODO: Improve the green button with disabled state to be able to use properly */}
          <ButtonComponent
            state={ValidForm() ? 'primary' : 'secondary'}
            text="Submit"
            type="submit"
            disabled={!ValidForm()}
          ></ButtonComponent>
        </Form>
      )}
    </Background>
  )
}
