import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { PATHS } from '../Routes'
import ButtonComponent from '../../components/Button'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'

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
 * Path: `/facility`
 *
 * ## Page Description
 * Facility Landing Page is accessable through the `Facilities` button on main page as well as
 * `Facilities` button in the botton nav bar. On FacilitiesBooking page, users will be given the option to
 * search for a facility to book by either searching for a facility `Search by Facility`, or
 * by searching for a specific date/time to book `Search by Date/Time`
 *
 * @remarks
 */
export default function FacilityLandingPage() {
  const history = useHistory()

  return (
    <>
      <TopNavBar title="Faclility Booking" />
      <LandingPageContainer>
        <SearchContainer>
          <ButtonComponent
            state="primary"
            text="Search by facility"
            width="129px"
            height="104px"
            fontSize="20px"
            size="small"
            lineHeight="20px"
            onClick={() => {
              history.push(PATHS.SELECT_FACILITY)
            }}
          />
          <ButtonComponent
            state="primary"
            text="Search by Date/Time"
            width="129px"
            height="104px"
            fontSize="20px"
            size="small"
            lineHeight="20px"
            onClick={() => {
              history.push(PATHS.SELECT_TIME)
            }}
          />
        </SearchContainer>
        <ButtonComponent
          state="primary"
          text="View my Bookings"
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
