import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import bookingsIcon from '../../assets/bookingsIcon.svg'
import { useDispatch } from 'react-redux'
import dummyAvatar from '../../assets/dummyAvatar.svg'
import { redirect } from '../../store/route/action'
import { PATHS } from '../Routes'
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
  max-width: 337px;a
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

export default function FacilityBooking() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  const navigateToMyBookings = () => {
    console.log('My bookings')
  }

  const handleSelectFacility = (facility: FacilityType) => {
    console.log('Selected facility ' + facility.name)
    dispatch(redirect(PATHS.HOME_PAGE))
  }

  const MyBookingIcon = <img src={bookingsIcon} onClick={navigateToMyBookings} />

  // To change up when backend is up
  interface FacilityType {
    name: string
    location: string
  }
  const DummyFacilities = [
    { name: 'Conference Room', location: 'Upper Lounge' },
    { name: 'Alumni Room', location: 'Upper Lounge' },
  ]

  return (
    <>
      <TopNavBar title={'Facilities'} rightComponent={MyBookingIcon} />
      <MainContainer>
        {DummyFacilities.map((facility) => (
          <FacilityCard
            key={facility.name}
            onClick={() => {
              handleSelectFacility(facility)
            }}
          >
            <FacilityAvatar src={dummyAvatar} />
            <FacilityLabels>
              <FacilityHeader>{facility.name}</FacilityHeader>
              <FacilitySubHeader>{facility.location}</FacilitySubHeader>
            </FacilityLabels>
          </FacilityCard>
        ))}
      </MainContainer>
    </>
  )
}
