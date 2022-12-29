import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import FacilitiesList from '../../../components/FacilityBooking/FacilitiesList'

import {
  getFacilityList,
  setIsLoading,
  setSelectedFacility,
  SetBlockOutIsOpen,
  sortFacilitiesAlphabetically,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import bookingsIcon from '../../../assets/bookingsIcon.svg'
import JCRCBlockOutIcon from '../../../assets/JCRCBlockOut.svg'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import MyBookingsIcon from '../../../components/FacilityBooking/MyBookingsIcon'
import styled from 'styled-components'

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

/**
 * # View All Facilities Page
 * Path: `/facility/allFacilities`
 *
 * ## Page Description
 * View All Facilities Page is accessable through the Facilities Landing Page. On FacilitiesBooking page, users will be shown
 * all the facilities (venue) that can be booked for events. Upon selection of facility, user will
 * be directed to the selected facility page to select the date & timing for booking.
 *
 * @remarks
 */
export default function ViewAllFacilities() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { facilityList, locationList, isLoading, blockOutIsOpen, isJcrc } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(getFacilityList())
  }, [dispatch])

  const MyBookingIcon = (
    <img
      src={bookingsIcon}
      onClick={() => {
        history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
      }}
    />
  )

  const JCRCBlockOutButton = (
    <img
      style={{ paddingLeft: '17vw' }}
      src={JCRCBlockOutIcon}
      onClick={() => {
        // setJCRCBlockOutPopUp(true)
        dispatch(SetBlockOutIsOpen(true))
      }}
    />
  )

  const facilityCardOnClick = (facilityId: number) => {
    history.push(`${PATHS.VIEW_FACILITY}/${facilityId}`)
    dispatch(setSelectedFacility(facilityId))
  }

  const goBack = () => {
    history.push(PATHS.FACILITY_LANDING_PAGE)
  }

  return (
    <>
      {isJcrc ? (
        <TopNavBar title="Facilities" leftIcon centerComponent={JCRCBlockOutButton} rightComponent={MyBookingIcon} />
      ) : (
        <TopNavBarRevamp
          onLeftClick={goBack}
          centerComponent={<TitleText>Available Facilities</TitleText>}
          rightComponent={MyBookingsIcon()}
        />
      )}
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <FacilitiesList
            facilityList={sortFacilitiesAlphabetically(facilityList)}
            locationList={locationList}
            facilityCardOnClick={facilityCardOnClick}
            blockOutIsOpen={blockOutIsOpen}
          />
        )}
      </MainContainer>
      <BottomNavBar />
    </>
  )
}
