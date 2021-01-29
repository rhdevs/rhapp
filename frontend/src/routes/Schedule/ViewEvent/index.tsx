import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ViewEventDetailCard from '../../../components/Scheduling/ViewEventDetailCard'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LeftOutlined, EditOutlined } from '@ant-design/icons'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchAllUserEvents, getHallEventTypes, setSelectedEvent } from '../../../store/scheduling/action'
import { RootState } from '../../../store/types'
import { dummyUserId } from '../../../store/stubs'
import LoadingSpin from '../../../components/LoadingSpin'

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

  const { ccaDetails, selectedEvent } = useSelector((state: RootState) => state.scheduling)

  useEffect(() => {
    dispatch(fetchAllUserEvents(dummyUserId, true))
    dispatch(getHallEventTypes())
    dispatch(setSelectedEvent(null, eventIdFromPath))
  }, [dispatch])

  const BackIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px 0 0' }}
      onClick={() => {
        history.goBack()
      }}
    />
  )

  const isNusModsEvent = selectedEvent?.eventType === 'mods' ? true : false

  const EditIcon = isNusModsEvent ? undefined : <EditOutlined style={{ color: 'black', fontSize: '30px' }} />

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

  return (
    <MainContainer>
      <TopNavBar title={`Event Details`} leftIcon leftIconComponent={BackIcon} rightComponent={EditIcon} />
      <BottomContentContainer>
        {selectedEvent ? (
          <ViewEventDetailCard
            eventName={selectedEvent.eventName}
            eventCreatedBy={selectedEvent.userID === dummyUserId ? 'You' : selectedEvent.userID || 'NUSMods'}
            startDateAndTime={selectedEvent.startDateTime}
            endDateAndTime={selectedEvent.endDateTime}
            eventLocation={selectedEvent.location}
            eventCca={isNusModsEvent ? undefined : ccaDetails?.ccaName}
            eventDescription={selectedEvent.description}
            eventType={selectedEvent.eventType}
            startTime={selectedEvent.startTime}
            endTime={selectedEvent.endTime}
            day={selectedEvent.day}
          />
        ) : (
          <LoadingSpin />
        )}
      </BottomContentContainer>
    </MainContainer>
  )
}
