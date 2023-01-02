import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { PATHS } from '../Routes'
import ButtonComponent from '../../components/Button'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { setSearchMode } from '../../store/facilityBooking/action'
import { useDispatch } from 'react-redux'
import { SearchMode } from '../../store/facilityBooking/types'

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 154px;
  width: 297px;
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
        <SearchContainer>
          <ButtonComponent
            state="primary"
            text="Select Facility"
            width="129px"
            height="104px"
            fontSize="20px"
            size="small"
            lineHeight="20px"
            onClick={selectFacilityOnClick}
          />
          <ButtonComponent
            state="primary"
            text="Search by Time"
            width="129px"
            height="104px"
            fontSize="20px"
            size="small"
            lineHeight="20px"
            onClick={searchByTimeOnClick}
          />
        </SearchContainer>
        <ButtonComponent
          state="primary"
          text="View My Bookings"
          width="297px"
          height="80px"
          fontSize="20px"
          onClick={() => {
            history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
          }}
        />
      </LandingPageContainer>
      <BottomNavBar />
    </>
  )
}
