import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { PATHS } from '../../routes/Routes'
import { setSelectedEvent } from '../../store/scheduling/action'
import { TimetableEvent } from '../../store/scheduling/types'

const TitleText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 14px;
  line-height: 14px;
  font-weight: 600;
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
  font-weight: 200;
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
  eventStartTime: string
  eventEndTime: string
  eventTitle?: string
  eventLocation?: string
  eventCellColor?: string
  numberOfHours?: number
  onlyShowEventName?: boolean
  eventType?: string
  isSingleEvent?: boolean
  event: TimetableEvent
  isLastRow?: boolean
}

function EventCell(props: Props) {
  const MODULE_EVENT = 'mods'
  const PUBLIC_EVENT = 'public'
  const PRIVATE_EVENT = 'private'
  const FRIENDS_EVENT = 'friends'
  const CCA_EVENT = 'CCA'

  const MODULE_EVENT_COLOUR = '#de5f4c' // red
  const PUBLIC_EVENT_COLOUR = '#002642' // blue
  const PRIVATE_EVENT_COLOUR = '#fafaf4' // cream
  const FRIENDS_EVENT_COLOUR = '#73d13d' // green
  const CCA_EVENT_COLOUR = '#722ed1' // purple

  const DEFAULT_EVENT_CELL_COLOUR = '#fafaf4'
  const EVENT_CELL_COLOUR =
    props.eventType === MODULE_EVENT
      ? MODULE_EVENT_COLOUR
      : props.eventType === PUBLIC_EVENT
      ? PUBLIC_EVENT_COLOUR
      : props.eventType === PRIVATE_EVENT
      ? PRIVATE_EVENT_COLOUR
      : props.eventType === FRIENDS_EVENT
      ? FRIENDS_EVENT_COLOUR
      : props.eventType === CCA_EVENT
      ? CCA_EVENT_COLOUR
      : DEFAULT_EVENT_CELL_COLOUR

  const DEFAULT_EVENT_CELL_WORDS_COLOUR = 'black'
  const EVENT_CELL_WORDS_COLOUR =
    props.eventType === MODULE_EVENT
      ? 'white'
      : props.eventType === PUBLIC_EVENT
      ? 'white'
      : props.eventType === PRIVATE_EVENT
      ? 'black'
      : props.eventType === CCA_EVENT
      ? 'white'
      : DEFAULT_EVENT_CELL_WORDS_COLOUR

  const onlyShowEventName = props.onlyShowEventName || !(props.isSingleEvent ?? true)

  const getEventHeight = () => {
    if (props.eventHeight) {
      return props.eventHeight
    } else if (onlyShowEventName) {
      return Number(props.oneDayMinHeight.replace('rem', '')) / 2 + 'rem'
    } else if (!props.isLastRow) {
      return Number(props.oneDayMinHeight.replace('rem', '')) - 0.0625 * 3 + 'rem'
    } else {
      return props.oneDayMinHeight
    }
  }

  const EVENT_HEIGHT = getEventHeight()

  const eventStartTimeHour = Number(props.eventStartTime.substring(0, 2))
  const eventStartTimeMinute = Number(props.eventStartTime.substring(2, 4))
  const eventEndTimeHour = Number(props.eventEndTime.substring(0, 2))
  const eventEndTimeMinute = Number(props.eventEndTime.substring(2, 4))
  const width =
    (((eventEndTimeHour - eventStartTimeHour) * 60 + (eventEndTimeMinute - eventStartTimeMinute)) / 60) *
      Number(props.oneHourWidth.replace('rem', '')) -
    0.0625 +
    'rem'

  const history = useHistory()
  const dispatch = useDispatch()

  return (
    <EventContainer
      onClick={() => {
        if (props.eventType !== FRIENDS_EVENT && props.eventType !== CCA_EVENT) {
          dispatch(setSelectedEvent(props.event, null))
          history.push(PATHS.VIEW_EVENT + `/${props.event.eventID}`)
        }
      }}
      style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
    >
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
