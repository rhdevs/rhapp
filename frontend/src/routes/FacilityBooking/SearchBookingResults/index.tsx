import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { Radio } from 'antd'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import JCRCBlockOutModal from '../../../components/Mobile/JCRCBlockOutModal'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import MyBookingsIcon from '../../../components/FacilityBooking/MyBookingsIcon'

import {
  changeTab,
  getFacilityList,
  setIsLoading,
  setSelectedFacility,
  SetBlockOutIsOpen,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedStartTime,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

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
 * Path: ``
 *
 * ## Page Description
 * // TODO
 *
 * @remarks
 */
export default function SearchBookingResults() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { facilityList, locationList, selectedTab, isLoading, blockOutIsOpen } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(getFacilityList())
    return () => {
      dispatch(changeTab('All'))
    }
  }, [dispatch])

  const onChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTab(e.target.value))
  }

  const goBack = () => {
    dispatch(setSelectedBlockTimestamp(0))
    dispatch(setSelectedStartTime(0))
    dispatch(setSelectedEndTime(0))
    history.push(PATHS.SEARCH_BOOKING_TIME)
  }

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={goBack}
        centerComponent={<TitleText>Search Results [WIP]</TitleText>}
        rightComponent={MyBookingsIcon()}
      />

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
