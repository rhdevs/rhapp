import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import bookingsIcon from '../../assets/bookingsIcon.svg'
import dummyAvatar from '../../assets/dummyAvatar.svg'
import { PATHS } from '../Routes'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../store/types'
import { Radio } from 'antd'
import 'antd/dist/antd.css'
import { changeTab, getFacilityList, SetIsLoading, setSelectedFacility } from '../../store/facilityBooking/action'
import LoadingSpin from '../../components/LoadingSpin'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
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

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: red;
  }
  .ant-radio-button-wrapper {
    font-family: Inter;
  }
`

const StyledRadioGroupDiv = styled.div`
  overflow: auto;
  white-space: nowrap;
  margin-left: 23px;
`

export default function FacilityBooking() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { facilityList, locationList, selectedTab, isLoading } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(getFacilityList())
  }, [dispatch])

  const MyBookingIcon = (
    <img
      src={bookingsIcon}
      onClick={() => {
        history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
      }}
    />
  )

  const onChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTab(e.target.value))
  }

  return (
    <>
      <TopNavBar title={'Facilities'} leftIcon={true} rightComponent={MyBookingIcon} />
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
            {facilityList.map((facility) => {
              if (facility.facilityLocation === selectedTab || selectedTab === '' || selectedTab === 'All')
                return (
                  <FacilityCard
                    key={facility.facilityID}
                    onClick={() => {
                      history.push('/facility/view/' + facility.facilityID)
                      dispatch(setSelectedFacility(facility.facilityID))
                    }}
                  >
                    <FacilityAvatar src={dummyAvatar} />
                    <FacilityLabels>
                      <FacilityHeader>{facility.facilityName}</FacilityHeader>
                      <FacilitySubHeader>{facility.facilityLocation}</FacilitySubHeader>
                    </FacilityLabels>
                  </FacilityCard>
                )
            })}
          </>
        )}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
