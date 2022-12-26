import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import {
  resetTimeSelectorSelection,
  setBookingEndTime,
  setBookingStartTime,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedStartTime,
  setTimeBlocks,
  updateSearchDailyView,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import TimeSelector from '../../../components/FacilityBooking/TimeSelector'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'
import { TimeBlock, TimeBlockType } from '../../../store/facilityBooking/types'

const HEADER_HEIGHT = '70px'

const Background = styled.div`
  background-color: #fff;
  height: calc(100vh - ${HEADER_HEIGHT});
  width: (100vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 36px;
  overflow: hidden;
`

const BookingSectionDiv = styled.div`
  width: 100vw;
  height: 100%;
  overflow-y: scroll;

  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

const TitleText = styled.h2`
  font-family: Lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  margin-top: 0.7rem;
`

/**
 * # Search Booking Time Page
 * Path: `/facility/selectDate/selectTime`
 *
 * ## Page Description
 * This page is accesed when the user searches facilities by Date/Time, after they selected a date.
 * This page allows them to select the timeslot which they wish to search for an available facility to book.
 * @remarks
 *
 */
export default function SearchBookingTime() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { clickedDate, timeBlocks, selectedBlockTimestamp, selectedStartTime, selectedEndTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(updateSearchDailyView(clickedDate))
  }, [clickedDate])

  const onLeftClick = () => {
    // reset user selection
    dispatch(resetTimeSelectorSelection())
    history.push(PATHS.SEARCH_BOOKING_DATE)
  }

  useEffect(() => {
    updateTimeBlocks()
  }, [selectedBlockTimestamp])

  const assignType = (entry: TimeBlock): TimeBlockType => {
    if (entry.timestamp === selectedBlockTimestamp) return TimeBlockType.SELECTED
    if (entry.timestamp < selectedBlockTimestamp)
      return entry.type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : entry.type
    return entry.type
  }

  const updateTimeBlocks = () => {
    if (selectedStartTime === 0) return
    const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
      const type = assignType(entry)
      return { ...entry, type }
    })
    dispatch(setTimeBlocks(newTimeblocks))
  }

  const setSelectedBlock = (selectedTimestamp: number) => {
    dispatch(setSelectedBlockTimestamp(selectedTimestamp))
    if (selectedStartTime === 0) {
      if (selectedEndTime === 0) {
        // selecting start time first before selecting end time
        dispatch(setSelectedStartTime(selectedTimestamp))
      } else {
        return // (reselect start time only without reselecting end time) disallowed for now
      }
    } else {
      // select end time (after start time is selected), then go to booking page
      const selectedEndTime = selectedTimestamp + 3600 // Add 1 hour to selected block as end time

      // TODO sus why is selected end time set twice
      dispatch(setSelectedEndTime(selectedTimestamp))
      dispatch(setBookingStartTime(selectedStartTime))
      dispatch(setBookingEndTime(selectedEndTime))
      dispatch(resetTimeSelectorSelection())
      history.push(PATHS.SEARCH_BOOKING_RESULTS)
    }
  }

  return (
    <>
      <TopNavBarRevamp onLeftClick={onLeftClick} centerComponent={<TitleText>Select Timeslot</TitleText>} />
      <Background>
        <h2>Choose {selectedStartTime ? 'ending' : 'starting'} time slot</h2>
        <DailyViewDatesRow />
        <BookingSectionDiv>
          <TimeSelector timeBlocks={timeBlocks} bookingBlockOnClick={setSelectedBlock} />
        </BookingSectionDiv>
      </Background>
    </>
  )
}
