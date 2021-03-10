import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { LeftOutlined } from '@ant-design/icons'
import { getHallEventTypes, setCreatedEventID, setSelectedEvent } from '../../../store/scheduling/action'
import { RootState } from '../../../store/types'
import { DAY_STRING_TO_NUMBER } from '../../../store/scheduling/types'
import ViewEventDetailCard from '../../../components/Scheduling/ViewEventDetailCard'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import NotFound from '../../ErrorPages/NotFound'

import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fafaf4;
`

const BottomContentContainer = styled.div`
  background-color: #fafaf4;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px;
`

export default function CreateEvent() {
  const history = useHistory()
  const dispatch = useDispatch()

  const eventIdFromPath = location.pathname.split('/').slice(-1)[0]

  const { selectedEvent } = useSelector((state: RootState) => state.scheduling)

  useEffect(() => {
    dispatch(getHallEventTypes())
    dispatch(setSelectedEvent(null, eventIdFromPath))
    dispatch(setCreatedEventID(null))
  }, [dispatch])

  const BackIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px 0 0' }}
      onClick={() => {
        dispatch(setSelectedEvent(null, null))
        history.goBack()
      }}
    />
  )

  const isNusModsEvent = selectedEvent?.eventType === 'mods' ? true : false

  const EditIcon = undefined //isNusModsEvent ? undefined : <EditOutlined style={{ color: 'black', fontSize: '30px' }} />

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

  const eventType = (eventType: string) => {
    if (eventType === 'private') {
      return 'Private'
    } else if (eventType === 'public') {
      return 'Public'
    } else if (eventType === 'mods') {
      return 'NUSMods'
    } else if (eventType === 'friends') {
      return 'Friends Event'
    } else if (eventType === 'CCA') {
      return 'CCA Event'
    } else {
      return eventType
    }
  }

  const getEventTime = (eventTime: string) => {
    const eventHour = eventTime.substr(0, 2)
    const eventMinutes = eventTime.substr(2, 4)
    const timeString = eventHour + ':' + eventMinutes
    if (Number(eventHour) < 12) {
      return timeString + ' AM'
    } else {
      return timeString + ' PM'
    }
  }

  const getEventDate = (eventDay: string) => {
    const today = new Date()
    const eventDate = new Date(today)
    const numberOfdaysSinceToday = DAY_STRING_TO_NUMBER[eventDay] - today.getDay()
    eventDate.setDate(eventDate.getDate() + numberOfdaysSinceToday)
    return eventDate.toLocaleDateString()
  }

  const renderContent = () => {
    if (selectedEvent) {
      return (
        <ViewEventDetailCard
          eventID={selectedEvent.eventID}
          eventName={selectedEvent.eventName}
          eventCreatedBy={
            selectedEvent.userID === localStorage.getItem('userID')
              ? 'You'
              : isNusModsEvent
              ? 'NUSMods'
              : selectedEvent.userID
          }
          startDateAndTime={isNusModsEvent ? undefined : selectedEvent.startDateTime}
          endDateAndTime={isNusModsEvent ? undefined : selectedEvent.endDateTime}
          eventLocation={selectedEvent.location}
          eventCca={
            isNusModsEvent ? undefined : selectedEvent.CCADetails ? selectedEvent.CCADetails.ccaName : undefined
          }
          eventDescription={selectedEvent.description}
          eventType={eventType(selectedEvent.eventType)}
          startTime={isNusModsEvent ? getEventTime(selectedEvent.startTime) : undefined} //e.g '01:37 AM'
          endTime={isNusModsEvent ? getEventTime(selectedEvent.endTime) : undefined}
          day={isNusModsEvent ? selectedEvent.day : undefined} //e.g 'Thu'
          date={isNusModsEvent ? getEventDate(selectedEvent.day) : undefined} //e.g '01/28/21
        />
      )
    }
    if (selectedEvent === undefined) {
      return <NotFound />
    } else {
      return <LoadingSpin />
    }
  }

  return (
    <MainContainer>
      <TopNavBar title={`Event Details`} leftIcon leftIconComponent={BackIcon} rightComponent={EditIcon} />
      <BottomContentContainer>{renderContent()}</BottomContentContainer>
    </MainContainer>
  )
}
