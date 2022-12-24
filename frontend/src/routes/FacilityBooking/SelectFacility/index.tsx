import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Radio } from 'antd'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import JCRCBlockOutModal from '../../../components/Mobile/JCRCBlockOutModal'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import LoadingSpin from '../../../components/LoadingSpin'

import {
  changeTab,
  getFacilityList,
  setIsLoading,
  setSelectedFacility,
  SetBlockOutIsOpen,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import bookingsIcon from '../../../assets/bookingsIcon.svg'
import JCRCBlockOutIcon from '../../../assets/JCRCBlockOut.svg'
import FacilityLogo from '../../../components/FacilityBooking/FacilityLogo'
import {
  MainContainer,
  StyledRadioGroupDiv,
  StyledRadioGroup,
  StyledBodyDiv,
  FacilityCard,
  FacilityLabels,
  FacilityHeader,
  FacilitySubHeader,
} from '../FacilityBooking.styled'

/**
 * # Select Facility Page
 * Path: `/facility/selectFacility`
 *
 * ## Page Description
 * Select Facility Page is accessable through the Facilities Landing Page. On FacilitiesBooking page, users will be shown
 * all the facilities (venue) that can be booked for events. Upon selection of facility, user will
 * be directed to the selected facility page to select the date & timing for booking.
 *
 * @remarks
 */
export default function SelectFacility() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { facilityList, locationList, selectedTab, isLoading, blockOutIsOpen, isJcrc } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(getFacilityList())
    return () => {
      dispatch(changeTab('All'))
    }
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

  const onChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTab(e.target.value))
  }

  return (
    <>
      {isJcrc ? (
        <TopNavBar
          title="Facilities"
          leftIcon={true}
          centerComponent={JCRCBlockOutButton}
          rightComponent={MyBookingIcon}
        />
      ) : (
        <TopNavBar title="Facilities" leftIcon={true} rightComponent={MyBookingIcon} />
      )}
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            <StyledRadioGroupDiv onChange={onChangeTab}>
              <StyledRadioGroup defaultValue={locationList[0]}>
                {locationList.map((location, idx) => (
                  <Radio.Button key={idx} value={location}>
                    {location}
                  </Radio.Button>
                ))}
              </StyledRadioGroup>
            </StyledRadioGroupDiv>
            <StyledBodyDiv>
              {blockOutIsOpen && (
                <JCRCBlockOutModal
                  title="Facilities Blocking"
                  hasLeftButton={true}
                  leftButtonText="Confirm"
                  rightButtonText="Close"
                  facilities={facilityList}
                />
              )}
              {facilityList.map((facility) => {
                if (facility.facilityLocation === selectedTab || selectedTab === '' || selectedTab === 'All')
                  return (
                    <FacilityCard
                      key={facility.facilityID}
                      onClick={() => {
                        history.push(`${PATHS.VIEW_FACILITY}/${facility.facilityID}`)
                        dispatch(setSelectedFacility(facility.facilityID))
                      }}
                    >
                      <FacilityLogo key={facility.facilityID} facilityId={facility.facilityID} />
                      <FacilityLabels>
                        <FacilityHeader>{facility.facilityName}</FacilityHeader>
                        <FacilitySubHeader>{facility.facilityLocation}</FacilitySubHeader>
                      </FacilityLabels>
                    </FacilityCard>
                  )
              })}
            </StyledBodyDiv>
          </>
        )}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
