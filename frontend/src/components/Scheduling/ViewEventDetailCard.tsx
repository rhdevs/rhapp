import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
  align-items: center;
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
  margin-right: 20px;
  white-space: nowrap;
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

const RowDescription = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
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
  margin: 0px 15px;
  color: #666666;
`

const RemoveRow = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
  justify-content: center;
`

const RemoveEvent = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  text-decoration-line: underline;
  color: #1890ff;
`

function ViewEventDetailCard({
  eventName,
  eventCreatedBy,
  startDateAndTime,
  endDateAndTime,
  eventLocation,
  eventCca,
  eventDescription,
  eventType,
}: {
  eventName: string
  eventCreatedBy: string
  startDateAndTime: number
  endDateAndTime: number
  eventLocation: string
  eventCca: string
  eventDescription: string
  eventType: string
}) {
  // Converts a unix string into date format and returns the day in string
  const getDayStringFromUNIX = (unixDate: number) => {
    const dayInInt = new Date(unixDate * 1000).getDay()
    switch (dayInInt) {
      case 0:
        return 'Sun'
      case 1:
        return 'Mon'
      case 2:
        return 'Tue'
      case 3:
        return 'Wed'
      case 4:
        return 'Thu'
      case 5:
        return 'Fri'
      default:
        return 'Sat'
    }
  }

  const formatDate = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    return format(date, 'MM/dd/yy hh:mm a')
  }

  return (
    <div>
      <HeaderGroup>
        <MainHeader>{eventName}</MainHeader>
        <HeaderSubtitle>Event Created by {eventCreatedBy}</HeaderSubtitle>
      </HeaderGroup>

      <Background>
        <Row>
          <StyledTitle>From</StyledTitle>
          <FetchedDetails>
            {getDayStringFromUNIX(startDateAndTime) + ', ' + formatDate(startDateAndTime)}
          </FetchedDetails>
        </Row>
        <Row>
          <StyledTitle>To</StyledTitle>
          <FetchedDetails>{getDayStringFromUNIX(endDateAndTime) + ', ' + formatDate(endDateAndTime)}</FetchedDetails>
        </Row>
        <Row>
          <StyledTitle>Location</StyledTitle>
          <FetchedDetails>{eventLocation}</FetchedDetails>
        </Row>
        <Row>
          <StyledTitle>CCA</StyledTitle>
          <FetchedDetails>{eventCca}</FetchedDetails>
        </Row>
        <Row>
          <Row>
            <StyledTitle>Description</StyledTitle>
          </Row>
        </Row>
        <RowDescription>
          <FetchedDescriptionDetails>{eventDescription}</FetchedDescriptionDetails>
        </RowDescription>
        <Row>
          <StyledTitle>Event Type</StyledTitle>
          <FetchedDetails>{eventType}</FetchedDetails>
        </Row>
        <RemoveRow>
          <RemoveEvent>Remove from timetable</RemoveEvent>
        </RemoveRow>
      </Background>
    </div>
  )
}

export default ViewEventDetailCard
