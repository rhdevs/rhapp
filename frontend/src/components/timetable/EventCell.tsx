import React from 'react'
import styled from 'styled-components'

// from nusmods: style="margin-left: calc(50% + 1px); width: calc(37.5% - 1px);"
const TitleText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 16px;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :first-letter {
    text-transform: capitalize;
  }
`

const DescriptionText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :first-letter {
    text-transform: capitalize;
  }
`

const EventContainer = styled.div`
  margin-bottom: 1px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-height: 3.8rem;
`

const BottomLineContainer = styled.div`
  filter: brightness(70%);
  height: 4px;
`

type Props = {
  eventStartTime?: number
  eventEndTime?: number
  eventTitle: string
  eventDescription: string
  eventCellColor?: string
  numberOfHours?: number
}

function EventCell(props: Props) {
  const width = (props.numberOfHours ?? 1) * 8 + 'rem'
  return (
    <EventContainer>
      <ContentContainer style={{ backgroundColor: props.eventCellColor ?? '#ffe0b2', width: width }}>
        <TitleText>{props.eventTitle}</TitleText>
        <DescriptionText>{props.eventDescription}</DescriptionText>
      </ContentContainer>
      <BottomLineContainer
        style={{ backgroundColor: props.eventCellColor ?? '#ffe0b2', width: width }}
      ></BottomLineContainer>
    </EventContainer>
  )
}

export default EventCell
