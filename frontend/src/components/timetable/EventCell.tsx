import React from 'react'
import styled from 'styled-components'

const TitleText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 14px;
  line-height: 14px;
  font-weight: 200;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :first-letter {
    text-transform: capitalize;
  }
`

const LocationText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :first-letter {
    text-transform: capitalize;
  }
`

const EventContainer = styled.div`
  border-radius: 5px;
  overflow: hidden;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: space-evenly;
`

type Props = {
  oneHourWidth: string
  eventHeight?: string
  oneDayMinHeight: string
  eventStartTime?: string
  eventEndTime?: string
  eventTitle?: string
  eventLocation?: string
  eventCellColor?: string
  numberOfHours?: number
  onlyShowEventName?: boolean
  eventType?: string
  isSingleEvent?: boolean
}

function EventCell(props: Props) {
  const MODULE_EVENT = 'mods'
  const HALL_EVENT = 'hall events'
  const FRIENDS_EVENT = 'friends'

  const DEFAULT_EVENT_CELL_COLOUR = '#fafaf4'
  const EVENT_CELL_COLOUR =
    props.eventType === MODULE_EVENT
      ? '#DE5F4C' // red
      : props.eventType === HALL_EVENT
      ? '#002642' // blue
      : props.eventType === FRIENDS_EVENT
      ? '#fafaf4' // cream
      : DEFAULT_EVENT_CELL_COLOUR

  const DEFAULT_EVENT_CELL_WORDS_COLOUR = '#000000'
  const EVENT_CELL_WORDS_COLOUR =
    props.eventType === MODULE_EVENT
      ? '#FFFFFF'
      : props.eventType === HALL_EVENT
      ? '#FFFFFF'
      : props.eventType === FRIENDS_EVENT
      ? '#000000'
      : DEFAULT_EVENT_CELL_WORDS_COLOUR

  const onlyShowEventName = props.onlyShowEventName
    ? props.onlyShowEventName
    : (props.isSingleEvent ?? true) === true
    ? false
    : true

  const EVENT_HEIGHT = props.eventHeight
    ? props.eventHeight
    : onlyShowEventName
    ? Number(props.oneDayMinHeight.replace('rem', '')) / 2 + 'rem'
    : EVENT_CELL_COLOUR === '#fafaf4'
    ? Number(props.oneDayMinHeight.replace('rem', '')) - 0.0625 * 3 + 'rem'
    : props.oneDayMinHeight

  const width =
    (props.numberOfHours ?? (Number(props.eventEndTime) - Number(props.eventStartTime)) / 100 ?? 1) *
      Number(props.oneHourWidth.replace('rem', '')) -
    0.0625 +
    'rem'

  console.log(onlyShowEventName)
  return (
    <EventContainer style={{ border: EVENT_CELL_COLOUR === '#fafaf4' ? '1px #000000 solid' : '' }}>
      <ContentContainer
        style={{
          backgroundColor: props.eventCellColor ?? EVENT_CELL_COLOUR,
          width: width,
          height: EVENT_HEIGHT,
        }}
      >
        <TitleText style={{ color: EVENT_CELL_WORDS_COLOUR }}>{props.eventTitle}</TitleText>
        {!onlyShowEventName && (
          <LocationText style={{ color: EVENT_CELL_WORDS_COLOUR }}>{props.eventLocation}</LocationText>
        )}
      </ContentContainer>
    </EventContainer>
  )
}

export default EventCell
