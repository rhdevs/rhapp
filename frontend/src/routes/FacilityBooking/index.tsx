import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import bookingsIcon from '../../assets/bookingsIcon.svg'
import { useDispatch } from 'react-redux'
import dummyAvatar from '../../assets/dummyAvatar.svg'
// import { RootState } from '../../store/types'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`
const FacilityCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  max-width: 337px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const FacilityAvatar = styled.img`
  padding: 20px;
`

const FacilityHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
`

const FacilitySubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
`

const FacilityLabels = styled.div`
  align-self: center;
`

function FacilityBooking() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  const navigateToMyBookings = () => {
    console.log('My bookings')
  }

  const handleSelectFacility = () => {
    console.log('Selected facility')
  }

  const MyBookingIcon = <img src={bookingsIcon} onClick={navigateToMyBookings} />
  const DummyFacilities = [{ name: 'Conference Room', location: 'Upper Lounge' }]

  return (
    <>
      <TopNavBar title={'Facilities'} rightComponent={MyBookingIcon} />
      <MainContainer>
        <FacilityCard onClick={handleSelectFacility}>
          <FacilityAvatar src={dummyAvatar} />
          <FacilityLabels>
            <FacilityHeader>Conference Room</FacilityHeader>
            <FacilitySubHeader>Upper Lounge</FacilitySubHeader>
          </FacilityLabels>
        </FacilityCard>
        <FacilityCard onClick={handleSelectFacility}>
          <FacilityAvatar src={dummyAvatar} />
          <FacilityLabels>
            <FacilityHeader>Conference Room</FacilityHeader>
            <FacilitySubHeader>Upper Lounge</FacilitySubHeader>
          </FacilityLabels>
        </FacilityCard>
      </MainContainer>
    </>
  )
}

export default FacilityBooking
