import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import {
  resetBookingFormInfo,
  fetchFacilityNameFromID,
  resetTimeSelectorSelection,
  setBookingEndTime,
  setBookingStartTime,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedFacility,
  setSelectedStartTime,
  setTimeBlocks,
  updateBookingDailyView,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'
import { TimeBlock, TimeBlockType } from '../../../store/facilityBooking/types'

import LoadingSpin from '../../../components/LoadingSpin'
import TimeSelector from '../../../components/FacilityBooking/TimeSelector'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'

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
 * # Facility Select Time
 * Path: `/facility/selectedFacility/selectTime/:facilityId/:selectionMode?`
 *
 * ## Page Description
 * This page is accessed after the user clicks on the `Book Facility` button on the `ViewBookingDailyView` page. \
 * The user would select a starting time, followed by an ending time, on the timeline. \
 * Once the selection is done, the user would be automatically redirected to the CreateBooking page
 *
 * @remarks
 *
 */
export default function FacilitySelectTime() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string; selectionMode: 'reselect' | 'reselectExistingBooking' | undefined }>()
  const {
    clickedDate,
    isLoading,
    selectedBlockTimestamp,
    selectedBookingToEdit,
    selectedFacilityName,
    selectedStartTime,
    selectedEndTime,
    timeBlocks,
  } = useSelector((state: RootState) => state.facilityBooking)

  const { facilityId, selectionMode } = params
  const selectedFacilityId = parseInt(facilityId)
  const isReselectingTime = selectionMode === 'reselect' || selectionMode === 'reselectExistingBooking'

  /**
   * when editing booking, overwrite time blocks where the edited booking is supposed to occupy,
   * so that they show up as `AVAILABLE` instead of `OCCUPIED`
   */
  const overwriteAvailabilityOfEditingBooking =
    selectionMode === 'reselectExistingBooking' && selectedBookingToEdit
      ? Array.from(
          { length: (selectedBookingToEdit.endTime - selectedBookingToEdit.startTime) / 3600 },
          (_, index) => selectedBookingToEdit.startTime + index * 3600,
        )
      : []

  const [disabledDates, setDisabledDates] = useState<number[]>([])

  useEffect(() => {
    selectedFacilityName.length === 0 && dispatch(fetchFacilityNameFromID(parseInt(params.facilityId)))
    selectedFacilityId === 0 && dispatch(setSelectedFacility(parseInt(params.facilityId)))
  }, [])

  useEffect(() => {
    dispatch(updateBookingDailyView(clickedDate, selectedFacilityId))
  }, [clickedDate])

  useEffect(() => {
    updateDisabledDates()
  }, [selectedStartTime])

  /**
   * updates `disabledDates: number[]` hook, which is an array of date numbers passed into `DailyViewDatesRow` to indicate dates that are disabled on the date row
   * ## Use cases
   * When the user selects a starting time block on the `BookingTimeSelector`, this function would calculate the dates on the selected week that are
   * before the starting date, and dates `>=2` days after the starting date
   *
   * This ensures that the user does not book a location across `>=2` days
   * @returns void
   */
  const updateDisabledDates = () => {
    if (selectedStartTime === 0) return

    const startTimeDate = new Date(selectedStartTime * 1000)
    const year = startTimeDate.getFullYear() // year e.g. 2022
    const month = startTimeDate.getMonth() // month index e.g. 2 - March
    const date = startTimeDate.getDate() // the date e.g. 23
    const maxDateCurMonth = new Date(year, month + 1, 0).getDate() // max date of CURRENT month
    // array from 1 to maxDateCurMonth
    const newDisabledDates: number[] = Array.from({ length: maxDateCurMonth }, (_, index) => index + 1)

    if (date === maxDateCurMonth) {
      newDisabledDates.pop()
      newDisabledDates.shift()
    } else {
      newDisabledDates.splice(date - 1, 2)
    }
    setDisabledDates(newDisabledDates)
  }

  const goBackToDailyViewPage = () => {
    history.push(`${PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`)
  }

  const onLeftClick = () => {
    // reset user selection
    dispatch(resetTimeSelectorSelection())
    isReselectingTime ? history.goBack() : goBackToDailyViewPage()
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

  const goToBookingPage = () => {
    dispatch(resetBookingFormInfo())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${selectedFacilityId}`)
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
      isReselectingTime ? history.goBack() : goToBookingPage()
    }
  }

  return (
    <>
      <TopNavBarRevamp onLeftClick={onLeftClick} centerComponent={<TitleText>Book {selectedFacilityName}</TitleText>} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <h2>
            {isReselectingTime ? 'Reselect' : 'Choose'} {selectedStartTime !== 0 ? 'ending' : 'starting'} time slot
          </h2>
          <DailyViewDatesRow disabledDates={disabledDates} />
          <BookingSectionDiv>
            <TimeSelector
              timeBlocks={timeBlocks}
              bookingBlockOnClick={setSelectedBlock}
              overwriteAvailability={overwriteAvailabilityOfEditingBooking}
            />
          </BookingSectionDiv>
        </Background>
      )}
    </>
  )
}
