import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ButtonComponent from '../../../components/Button'
import { PATHS } from '../../Routes'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Icon } from 'antd-mobile'
import TopNavBar from '../../../components/Mobile/TopNavBar'

export default function FacilityLandingPage({ onLeftClick }: { onLeftClick?: () => void }) {
  const history = useHistory()
  const TopBar = styled.div`
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    width: 100%;
    height: 50px;
    background-color: #de5f4c;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 0px 0px 10px 10px;
    z-index: 999;
  `

  return (
    <>
      <TopNavBar title="Faclility Booking" />
      <ButtonComponent
        state="primary"
        text="Search by facility"
        width="129px"
        height="104px"
        fontSize="20px"
        onClick={() => {
          history.push(PATHS.FACILITY_BOOKING_MAIN)
        }}
      />
      <ButtonComponent
        state="primary"
        text="Search by Date/Time"
        width="129px"
        height="104px"
        fontSize="20px"
        onClick={() => {
          history.push(PATHS.FACILITY_BOOKING_MAIN)
        }}
      />
      <ButtonComponent
        state="primary"
        text="View my Bookings"
        width="297px"
        height="80px"
        fontSize="20px"
        onClick={() => {
          history.push(PATHS.VIEW_MY_BOOKINGS_ID)
        }}
      />
      <BottomNavBar />
    </>
  )
}
