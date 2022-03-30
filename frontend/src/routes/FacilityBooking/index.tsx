import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import bookingsIcon from '../../assets/bookingsIcon.svg'
import JCRCBlockOutIcon from '../../assets/JCRCBlockOut.svg'
import { PATHS } from '../Routes'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../store/types'
import { Radio } from 'antd'
import 'antd/dist/antd.css'
import {
  changeTab,
  getFacilityList,
  setIsLoading,
  setSelectedFacility,
  SetBlockOutIsOpen,
} from '../../store/facilityBooking/action'
import LoadingSpin from '../../components/LoadingSpin'
import AlumniRoom from '../../assets/facilitiesLogos/AlumniRoom.svg'
import BandRoom from '../../assets/facilitiesLogos/BandRoom.svg'
import BasketballCourt from '../../assets/facilitiesLogos/BasketballCourt.svg'
import ConferenceRoomKFH from '../../assets/facilitiesLogos/ConferenceRoomKFH.svg'
import ConferenceRoomUL from '../../assets/facilitiesLogos/ConferenceRoomUL.svg'
import DanceStudio from '../../assets/facilitiesLogos/DanceStudio.svg'
import Foyer from '../../assets/facilitiesLogos/Foyer.svg'
import Gym from '../../assets/facilitiesLogos/Gym.svg'
import HardCourt from '../../assets/facilitiesLogos/HardCourt.svg'
import MainAreaCommHall from '../../assets/facilitiesLogos/MainAreaCommHall.svg'
import MainAreaUL from '../../assets/facilitiesLogos/MainAreaUL.svg'
import MeetingRoomLL from '../../assets/facilitiesLogos/MeetingRoomLL.svg'
import PoolAreaLL from '../../assets/facilitiesLogos/PoolAreaLL.svg'
import Stage from '../../assets/facilitiesLogos/Stage.svg'
import TVRoom from '../../assets/facilitiesLogos/TVRoom.svg'
import DummyAvatar from '../../assets/dummyAvatar.svg'
import JCRCBlockOutModal from '../../components/Mobile/JCRCBlockOutModal'

const MainContainer = styled.div`
  width: 100%;
  background-color: #fafaf4;
  height: 88vh;
`
const FacilityCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const FacilityAvatar = styled.img`
  padding: 10px;
  width: 30%;
  max-height 70px;
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
  margin-top: 14px;
`

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper:hover {
    color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: #de5f4c;
    border-left-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover:before {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper {
    font-family: Inter;
  }
`

const StyledRadioGroupDiv = styled.div`
  overflow: auto;
  white-space: nowrap;
  margin: 0 21px;
  position: sticky;
  left: 0;
  top: 4.4rem;
  padding-bottom: 10px;
  background: #fafaf4;
`

const StyledBodyDiv = styled.div`
  background-color: #fafaf4;
  height: 90vh;
  overflow: scroll;
`

export default function FacilityBooking() {
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
        history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
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

  function FacilityLogo(props: { facilityId: number }) {
    switch (props.facilityId) {
      case 1:
        return <FacilityAvatar src={MainAreaUL} />
      case 2:
        return <FacilityAvatar src={ConferenceRoomUL} />
      case 3:
        return <FacilityAvatar src={AlumniRoom} />
      case 4:
        return <FacilityAvatar src={Foyer} />
      case 5:
        return <FacilityAvatar src={Stage} />
      case 6:
        return <FacilityAvatar src={MainAreaCommHall} />
      case 7:
        return <FacilityAvatar src={BandRoom} />
      case 8:
        return <FacilityAvatar src={PoolAreaLL} />
      case 9:
        return <FacilityAvatar src={TVRoom} />
      case 10:
        return <FacilityAvatar src={MeetingRoomLL} />
      case 11:
        return <FacilityAvatar src={ConferenceRoomKFH} />
      case 12:
        return <FacilityAvatar src={HardCourt} />
      case 13:
        return <FacilityAvatar src={BasketballCourt} />
      case 14:
        return <FacilityAvatar src={Gym} />
      case 15:
        return <FacilityAvatar src={DanceStudio} />
      case 16:
        return <FacilityAvatar src={MainAreaCommHall} />
      default:
        return <FacilityAvatar src={DummyAvatar} />
    }
  }

  return (
    <>
      {isJcrc ? (
        <TopNavBar
          title={'Facilities'}
          leftIcon={true}
          centerComponent={JCRCBlockOutButton}
          rightComponent={MyBookingIcon}
        />
      ) : (
        <TopNavBar title={'Facilities'} leftIcon={true} rightComponent={MyBookingIcon} />
      )}
      <MainContainer>
        {isLoading && <LoadingSpin />}
        {!isLoading && (
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
                  title={'Facilities Blocking'}
                  hasLeftButton={true}
                  leftButtonText={'Confirm'}
                  rightButtonText={'Close'}
                  facilities={facilityList}
                />
              )}
              {facilityList.map((facility) => {
                if (facility.facilityLocation === selectedTab || selectedTab === '' || selectedTab === 'All')
                  return (
                    <FacilityCard
                      key={facility.facilityID}
                      onClick={() => {
                        history.push(`${PATHS.VIEW_FACILITY}/${facility.facilityID}/0`)
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
