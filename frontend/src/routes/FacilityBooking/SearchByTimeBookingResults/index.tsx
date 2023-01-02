import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'

import FacilitiesList from '../../../components/FacilityBooking/FacilitiesList'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import MyBookingsIcon from '../../../components/FacilityBooking/MyBookingsIcon'

import {
  getFacilityListWithinTime,
  resetTimeSelectorSelection,
  setIsLoading,
  setSelectedFacility,
  sortFacilitiesAlphabetically,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #fafaf4;
`

const TitleText = styled.h2`
  font-family: Lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  margin-top: 0.7rem;
`

const NoFacilitiesText = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

/**
 * # Search By Time Booking Results
 * Path: `/facility/searchByTime/searchResults`
 *
 * ## Page Description
 * This page shows all the facilities that are available for booking during the user's selected timeslot \
 * Only facilities available during the entire duration of selected timeslot will be shown
 *
 * @remarks
 */
export default function SearchByTimeBookingResults() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { bookingStartTime, bookingEndTime, facilityListWithinTime, locationListWithinTime, isLoading } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(getFacilityListWithinTime(bookingStartTime, bookingEndTime))
  }, [dispatch])

  const goBack = () => {
    dispatch(resetTimeSelectorSelection())
    history.push(PATHS.SEARCH_BY_TIME_SELECT_BOOKING_TIME)
  }

  const facilityCardOnClick = (facilityId: number) => {
    history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${facilityId}`)
    dispatch(setSelectedFacility(facilityId))
  }

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={goBack}
        centerComponent={<TitleText>Available Facilities</TitleText>}
        rightComponent={MyBookingsIcon()}
      />
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : facilityListWithinTime.length === 0 ? (
          <NoFacilitiesText>No facilities available!</NoFacilitiesText>
        ) : (
          <FacilitiesList
            facilityList={sortFacilitiesAlphabetically(facilityListWithinTime)}
            locationList={locationListWithinTime}
            facilityCardOnClick={facilityCardOnClick}
            showTimeStartEnd
            showTimeStart={bookingStartTime}
            showTimeEnd={bookingEndTime}
          />
        )}
      </MainContainer>
      <BottomNavBar />
    </>
  )
}
