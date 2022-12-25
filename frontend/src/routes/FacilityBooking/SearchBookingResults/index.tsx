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
  getFacilityList,
  resetTimeSelectorSelection,
  setIsLoading,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedFacility,
  setSelectedStartTime,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import { MainContainer } from '../FacilityBooking.styled'
import { unixToFullDateTime } from '../../../common/unixToFullDateTime'

// TODO abstract
const TitleText = styled.h2`
  font-family: Lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  margin-top: 0.7rem;
`

/**
 * # View Search Results
 * Path: `/facility/searchResults`
 *
 * ## Page Description
 * This page shows all the facilities that are available for booking during the user's selected timeslot
 *
 * @remarks
 */
export default function SearchBookingResults() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { bookingStartTime, bookingEndTime, facilityList, locationList, isLoading } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    // dispatch(setIsLoading(true))
    dispatch(getFacilityList()) // TODO replace
  }, [dispatch])

  const goBack = () => {
    resetTimeSelectorSelection()
    history.push(PATHS.SEARCH_BOOKING_TIME)
  }

  const facilityCardOnClick = (facilityId: number) => {
    history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${facilityId}`)
    dispatch(setSelectedFacility(facilityId))
  }

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={goBack}
        centerComponent={<TitleText>Search Results [WIP]</TitleText>}
        rightComponent={MyBookingsIcon()}
      />
      <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        Displaying Facilities Available on: {unixToFullDateTime(bookingStartTime)} -{' '}
        {unixToFullDateTime(bookingEndTime)}
      </h2>
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <FacilitiesList
            facilityList={facilityList}
            locationList={locationList}
            facilityCardOnClick={facilityCardOnClick}
          />
        )}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
