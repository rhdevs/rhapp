import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { PATHS } from '../Routes'
import { PRIMARY_GREEN } from '../../common/colours'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import IconButton from '../../components/IconButton'

import { setSearchMode } from '../../store/facilityBooking/action'
import { SearchMode } from '../../store/facilityBooking/types'

import doorIcon from '../../assets/door.svg'
import calenderTimeIcon from '../../assets/calendarTime.svg'

const StyledMenuTitle = styled.span`
  font-family: Lato;
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  line-height: 26px;
  letter-spacing: -0.015em;

  color: #191919;
`

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 64px;
  margin: 42px 0;

  width: 224px;
  height: 107px;
`

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 234px;
  margin-top: 63px;
`

const CurrentBookingsLink = styled.span`
  font-family: Lato;
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 20px;

  letter-spacing: 0.05em;
  text-decoration-line: underline;

  color: ${PRIMARY_GREEN};
  cursor: pointer;
`
/**
 * # Facility Landing Page
 * Path: `/facility/main`
 *
 * ## Page Description
 * Facility Landing Page is accessable through the `Facilities` button on main page as well as
 * `Facilities` button in the botton nav bar. On FacilitiesBooking page, users will be given the option to
 * search for a facility to book by either selecting a facility `Select Facility`, or
 * by searching for a specific timeframe to book `Search by Time`
 *
 * @remarks
 */
export default function FacilityLandingPage() {
  const history = useHistory()
  const dispatch = useDispatch()

  const selectFacilityOnClick = () => {
    dispatch(setSearchMode(SearchMode.BY_FACILITY))
    history.push(PATHS.VIEW_ALL_FACILITIES)
  }

  const searchByTimeOnClick = () => {
    dispatch(setSearchMode(SearchMode.BY_TIME))
    history.push(PATHS.SEARCH_BY_TIME_SELECT_BOOKING_DATE)
  }

  return (
    <>
      <TopNavBar title="Faclility Booking" />
      <LandingPageContainer>
        <StyledMenuTitle>Check Booking Availability</StyledMenuTitle>
        <SearchContainer>
          <IconButton text="By Facility" onClick={selectFacilityOnClick} icon={doorIcon} width="80px" height="80px" />
          <IconButton text="By Time" onClick={searchByTimeOnClick} icon={calenderTimeIcon} width="80px" height="80px" />
        </SearchContainer>
        <CurrentBookingsLink
          onClick={() => history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)}
        >
          View your current bookings
        </CurrentBookingsLink>
      </LandingPageContainer>
      <BottomNavBar />
    </>
  )
}
