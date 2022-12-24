import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import {
  setBookingEndTime,
  setBookingStartTime,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedStartTime,
  setTimeBlocks,
  updateDailyView,
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
 * // TODO
 * @remarks
 *
 */

export default function SearchBookingTime() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    timeBlocks,
    selectedBlockTimestamp,
    selectedFacilityName,
    isLoading,
    selectedStartTime,
    selectedEndTime,
  } = useSelector((state: RootState) => state.facilityBooking)
  const { clickedDate } = useSelector((state: RootState) => state.facilityBooking)

  const [disabledDates, setDisabledDates] = useState<number[]>([])

  const goBackToDailyViewPage = () => {
    // history.push(`${PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`)
  }

  const onLeftClick = () => {
    history.push(PATHS.SEARCH_BOOKING_DATE)
    // // reset user selection
    // // TODO you don't want to do this if you're just reselecting date from booking page
    dispatch(setSelectedBlockTimestamp(0))
    dispatch(setSelectedStartTime(0))
    dispatch(setSelectedEndTime(0))
    // goBackToDailyViewPage()
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

  // const goToBookingPage = () => {
  //   history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${selectedFacilityId}`)
  // }

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

      dispatch(setSelectedEndTime(selectedTimestamp))
      dispatch(setBookingStartTime(selectedStartTime))
      dispatch(setBookingEndTime(selectedEndTime))
      // goToBookingPage()
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
