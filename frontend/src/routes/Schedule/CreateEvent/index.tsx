import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import enUs from 'antd-mobile/lib/date-picker/locale/en_US'

import styled from 'styled-components'
import { Select, Switch } from 'antd'
import { DatePicker } from 'antd-mobile'
import { LeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { RootState } from '../../../store/types'
import {
  editEventFromDate,
  handleSubmitCreateEvent,
  getHallEventTypes,
  editEventToDate,
  getTargetAudienceList,
} from '../../../store/scheduling/action'
import { PATHS } from '../../Routes'

import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

const { Option } = Select

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
`

const BottomContainer = styled.div`
  background-color: #fafaf4;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
  align-items: center;
  justify-content: space-between;
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
`

const ErrorText = styled.p`
  margin: -15px 0 10px 0;
  color: #ff837a;
  width: 100%;
  text-align: end;
`

const DateTimeErrorText = styled.p`
  margin: -10px 0 15px 0;
  color: #ff837a;
  width: 100%;
  text-align: end;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: baseline;
`

const EventInput = styled.input`
  width: 100%;
  border-radius: 30px;
  padding: 5px 10px;
  margin: 0 0 20px 0;
  height: 35px;
`

const RedText = styled.text`
  color: red;
`

const StyledSelect = styled(Select)<{ border: string; color: string }>`
  &.ant-select {
    width: 100%;
  }
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid ${(props) => props.border};
    background: ${(props) => props.color};
  }
`

export default function CreateEvent() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, errors, control, watch } = useForm()

  const [selectColor, setSelectColor] = useState('')
  const [selectBorder, setSelectBorder] = useState('#d9d9d9')
  const [onClickStatus, setOnClickStatus] = useState(false)
  const [creatorIsAttending, setCreatorIsAttending] = useState(true)

  const RedAsterisk = <RedText>*</RedText>

  useEffect(() => {
    dispatch(getHallEventTypes())
    dispatch(getTargetAudienceList())
    setOnClickStatus(false)
  }, [dispatch])

  const BackIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px 0 0' }}
      onClick={() => {
        history.goBack()
      }}
    />
  )

  const { targetAudienceList, newEventFromDate, newEventToDate, createdEventID } = useSelector(
    (state: RootState) => state.scheduling,
  )

  // if there is a createdEventID, go to viewevent page
  useEffect(() => {
    if (createdEventID !== null) {
      history.replace(PATHS.SCHEDULE_PAGE)
      history.push(PATHS.VIEW_EVENT + `/${createdEventID}`)
    }
  }, [createdEventID])

  // reset select event target audience colour when value is valid
  useEffect(() => {
    if (watch('eventTargetAudience') !== 'Select') {
      setSelectBorder('#d9d9d9')
      setSelectColor('')
    }
  }, [watch('eventTargetAudience')])

  /** Incomplete functionality for Uploading Image */
  // const [uploadLoading, setUploadLoading] = useState(false)
  // const [imageUrl, setImageUrl] = useState('')

  // function getBase64(img, callback) {
  //   const reader = new FileReader()
  //   reader.addEventListener('load', () => callback(reader.result))
  //   reader.readAsDataURL(img)
  // }

  // const handleUpload = (info) => {
  //   if (info.file.status === 'uploading') {
  //     setUploadLoading(true)
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (imageUrl: string) => {
  //       setImageUrl(imageUrl)
  //       setUploadLoading(false)
  //     })
  //   }
  // }

  const handleFromDateChange = (newDate: Date) => {
    if (newEventToDate < newDate) {
      editEventToDate(dayjs(newDate).add(1, 'hour').toDate())
    }
    dispatch(editEventFromDate(newDate))
  }

  const handleToDateChange = (newDate: Date) => {
    if (newEventFromDate > newDate) {
      editEventFromDate(dayjs(newDate).subtract(1, 'hour').toDate())
    }

    dispatch(editEventToDate(newDate))
  }

  const toCustomDateFormat = (date: Date) => {
    return `${dayjs(date).format('ddd, MMM D, YYYY, h:mm A')}`
  }

  const onClick = () => {
    if (watch('eventTargetAudience') === 'Select') {
      setSelectBorder('red')
      setSelectColor('#ffd1d1')
    }
    setOnClickStatus(true)

    handleSubmit(onSubmit)()
  }

  const onSubmit = (data: {
    eventName: string
    eventTargetAudience: string
    eventLocation: string
    eventDescription: string
  }) => {
    console.log(errors)
    if (
      !errors.length &&
      watch('eventTargetAudience') !== 'Select' &&
      Number(dayjs(newEventToDate).diff(dayjs(newEventFromDate), 'hour', true).toFixed(1)) > 0
    ) {
      dispatch(
        handleSubmitCreateEvent(
          data.eventName,
          data.eventLocation,
          data.eventDescription,
          data.eventTargetAudience,
          data.eventTargetAudience === 'Personal' ? true : creatorIsAttending,
        ),
      )
    }
  }

  return (
    <Background>
      <form>
        <TopNavBar
          title={`Event Details`}
          leftIcon
          leftIconComponent={BackIcon}
          rightComponent={<CheckOutlined style={{ color: 'black' }} onClick={onClick} />}
        />
        <BottomContainer>
          <InputContainer>
            <StyledTitle style={{ marginRight: '10px' }}>Event Name{RedAsterisk}</StyledTitle>
            <EventInput
              type="text"
              placeholder="Event Name"
              name="eventName"
              ref={register({ required: true, validate: (input) => input.trim().length !== 0 })}
              style={{
                border: errors.eventName ? '1px solid red' : '1px solid #d9d9d9',
                background: errors.eventName && '#ffd1d1',
              }}
            />
          </InputContainer>
          {errors.eventName && errors.eventName?.type !== 'validate' && <ErrorText>Event Name Required!</ErrorText>}
          {errors.eventName?.type === 'validate' && <ErrorText>Invalid Event Name!</ErrorText>}

          <div style={{ width: '100%' }}>
            <DatePicker mode="datetime" locale={enUs} value={newEventFromDate} onChange={handleFromDateChange}>
              <DatePickerRow>
                <StyledTitle>From{RedAsterisk}</StyledTitle>
                <span>{`${toCustomDateFormat(newEventFromDate)}`}</span>
              </DatePickerRow>
            </DatePicker>

            <DatePicker mode="datetime" locale={enUs} value={newEventToDate} onChange={handleToDateChange}>
              <DatePickerRow>
                <StyledTitle>To{RedAsterisk}</StyledTitle>
                <span>{`${toCustomDateFormat(newEventToDate)}`}</span>
              </DatePickerRow>
            </DatePicker>

            <div
              style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, marginTop: -10 }}
            >{`Duration: ${dayjs(newEventToDate).diff(dayjs(newEventFromDate), 'hour', true).toFixed(1)} hours`}</div>
          </div>

          {Number(dayjs(newEventToDate).diff(dayjs(newEventFromDate), 'hour', true).toFixed(1)) < 0.5 &&
            Number(dayjs(newEventToDate).diff(dayjs(newEventFromDate), 'hour', true).toFixed(1)) > 0 &&
            onClickStatus && <DateTimeErrorText>Event duration should be at least 30 minutes!</DateTimeErrorText>}
          {Number(dayjs(newEventToDate).diff(dayjs(newEventFromDate), 'hour', true).toFixed(1)) <= 0 &&
            onClickStatus && <DateTimeErrorText>Invalid Duration!</DateTimeErrorText>}

          <InputContainer>
            <StyledTitle>Location{RedAsterisk}</StyledTitle>
            <EventInput
              type="text"
              placeholder="Event Location"
              name="eventLocation"
              ref={register({ required: true, validate: (input) => input.trim().length !== 0 })}
              style={{
                border: errors.eventLocation ? '1px solid red' : '1px solid #d9d9d9',
                background: errors.eventLocation && '#ffd1d1',
              }}
            />
          </InputContainer>
          {errors.eventLocation && errors.eventLocation?.type !== 'validate' && (
            <ErrorText>Event Location Required!</ErrorText>
          )}
          {errors.eventLocation?.type === 'validate' && <ErrorText>Invalid Location!</ErrorText>}

          <Row>
            <StyledTitle>For who{RedAsterisk}</StyledTitle>
            <Controller
              as={
                <StyledSelect border={selectBorder} color={selectColor}>
                  <Option key={1} value={'Personal'}>
                    Personal
                  </Option>
                  {targetAudienceList.map((cca, index) => (
                    <Option key={index} value={cca.ccaID}>
                      {cca.ccaName}
                    </Option>
                  ))}
                </StyledSelect>
              }
              name="eventTargetAudience"
              control={control}
              defaultValue="Select"
            />
          </Row>

          <Controller
            name="eventDescription"
            control={control}
            render={({ onChange, value }) => (
              <InputRow
                title="Description"
                placeholder="Tell us what your event is about!"
                textarea
                value={value}
                onChange={onChange}
              />
            )}
            defaultValue={null}
          />

          {/* {(newTargetAudience === '' || newTargetAudience !== 'Personal') && (
          <Row>
            <StyledTitle>Event Type</StyledTitle>
            <StyledSelect defaultValue="Select" onChange={(value) => dispatch(editHallEventType(value.toString()))}>
              {hallEventTypes.map((eventTypes, index) => (
                <Option key={index} value={eventTypes}>
                  {eventTypes}
                </Option>
              ))}
            </StyledSelect>
          </Row>
        )} */}
          {watch('eventTargetAudience') !== 'Personal' && (
            <Row>
              <StyledTitle>Are you attending this event? </StyledTitle>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                onClick={() => setCreatorIsAttending(!creatorIsAttending)}
              />
            </Row>
          )}
        </BottomContainer>
      </form>
    </Background>
  )
}
