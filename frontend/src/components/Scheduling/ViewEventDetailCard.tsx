import React, { useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import ConfirmationModal from '../Mobile/ConfirmationModal'
import {
  deleteSingleNusModsEvent,
  deleteSelectedEvent,
  editUserEvents,
  getDayStringFromUNIX,
} from '../../store/scheduling/action'
import { PATHS } from '../../routes/Routes'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from 'antd'

const Background = styled.div`
  background-color: #fafaf4;
  width: 100vw;
  padding: 0px 20px;
`

const HeaderGroup = styled.div`
  background-color: #fafaf4;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 0px 20px;
`

const MainHeader = styled.div`
  font-family: Inter;
  color: black;
  font-size: 30px;
  font-weight: 700;
  line-height: 30px;
  margin-bottom: 10px;
`
const HeaderSubtitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 14px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
  align-items: center;
  justify-content: space-between;
`

const DescriptionTextContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const RowDescription = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
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

const FetchedDetails = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 17px;
  text-align: right;
  color: #666666;
`

const FetchedDescriptionDetails = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 17px;
  line-height: 22px;
  margin: 0px 10px;
  color: #666666;
  max-height: 110px;
  overflow: scroll;
`

const RemoveRow = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
  justify-content: center;
  flex-direction: column;
`

const RemoveEvent = styled.button`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 18px;
  text-decoration-line: underline;
  color: #1890ff;
  background: none;
  border: none;
  margin-top: 15px;
`

const LongButton = {
  fontFamily: 'Inter',
  margin: '35px auto auto',
  height: '40px',
  fontSize: '17px',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  borderRadius: '5px',
  width: 'clamp(8rem, 60vw, 16rem)',
}

function ViewEventDetailCard({
  eventID,
  eventName,
  eventCreatedBy,
  startDateAndTime,
  endDateAndTime,
  startTime,
  endTime,
  day,
  date,
  eventLocation,
  eventCca,
  eventDescription,
  eventType,
}: {
  eventID: string
  eventName: string
  eventCreatedBy?: string
  startDateAndTime?: number
  endDateAndTime?: number
  startTime?: string
  endTime?: string
  day?: string
  date?: string
  eventLocation: string
  eventCca?: string
  eventDescription?: string
  eventType: string
}) {
  const history = useHistory()
  const dispatch = useDispatch()

  const [removeModal, setRemoveModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const formatDate = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    return format(date, 'MM/dd/yy hh:mm a')
  }

  return (
    <>
      <HeaderGroup>
        <MainHeader>{eventName}</MainHeader>
        {eventCreatedBy && <HeaderSubtitle>Event Created by {eventCreatedBy}</HeaderSubtitle>}
      </HeaderGroup>
      <Background>
        {removeModal && (
          <ConfirmationModal
            title={'Confirm Remove?'}
            hasLeftButton={true}
            leftButtonText={'Remove'}
            onLeftButtonClick={() => {
              dispatch(editUserEvents('remove', eventID, localStorage.getItem('userID')))
              history.push(PATHS.SCHEDULE_PAGE)
            }}
            rightButtonText={'Cancel'}
            onRightButtonClick={() => {
              setRemoveModal(false)
            }}
          />
        )}
        {deleteModal && (
          <ConfirmationModal
            title={'Confirm Delete?'}
            hasLeftButton={true}
            leftButtonText={'Delete'}
            onLeftButtonClick={() => {
              if (eventType === 'NUSMods') {
                deleteSingleNusModsEvent(localStorage.getItem('userID'), eventID)
              } else {
                dispatch(deleteSelectedEvent(eventID))
              }
              history.push(PATHS.SCHEDULE_PAGE)
            }}
            rightButtonText={'Cancel'}
            onRightButtonClick={() => {
              setDeleteModal(false)
            }}
          />
        )}
        <Row>
          <StyledTitle>From</StyledTitle>
          <FetchedDetails>
            {startDateAndTime
              ? getDayStringFromUNIX(startDateAndTime) + ', ' + formatDate(startDateAndTime)
              : day + ', ' + date + ' ' + startTime}
          </FetchedDetails>
        </Row>
        <Row>
          <StyledTitle>To</StyledTitle>
          <FetchedDetails>
            {endDateAndTime
              ? getDayStringFromUNIX(endDateAndTime) + ', ' + formatDate(endDateAndTime)
              : day + ', ' + date + ' ' + endTime}
          </FetchedDetails>
        </Row>
        <Row>
          <StyledTitle>Location</StyledTitle>
          <FetchedDetails>{eventLocation}</FetchedDetails>
        </Row>
        {eventCca && (
          <Row>
            <StyledTitle>CCA</StyledTitle>
            <FetchedDetails>{eventCca}</FetchedDetails>
          </Row>
        )}
        {eventDescription && (
          <DescriptionTextContainer>
            <StyledTitle>Description</StyledTitle>
            <RowDescription>
              <FetchedDescriptionDetails>{eventDescription}</FetchedDescriptionDetails>
            </RowDescription>
          </DescriptionTextContainer>
        )}
        <Row>
          <StyledTitle>Event Type</StyledTitle>
          <FetchedDetails>{eventType}</FetchedDetails>
        </Row>
        <RemoveRow>
          {eventCreatedBy !== 'NUSMods' && (
            <RemoveEvent
              onClick={() => {
                setRemoveModal(!removeModal)
              }}
            >
              Remove event from timetable
            </RemoveEvent>
          )}
          {(eventCreatedBy === 'You' || eventCreatedBy === 'NUSMods') && (
            <Button type="primary" danger style={LongButton} onClick={() => setDeleteModal(!deleteModal)}>
              Delete Event
            </Button>
          )}
        </RemoveRow>
      </Background>
    </>
  )
}

export default ViewEventDetailCard
