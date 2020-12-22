import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import bookingsIcon from '../../assets/bookingsIcon.svg'
import dummyAvatar from '../../assets/dummyAvatar.svg'
<<<<<<< HEAD
import { PATHS } from '../Routes'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../store/types'
import { Radio } from 'antd'
import 'antd/dist/antd.css'
import { changeTab, getFacilityList } from '../../store/facilityBooking/action'
=======
// <<<<<<< HEAD
// <<<<<<< HEAD
// import { redirect } from '../../store/route/action'
// import { PATHS } from '../Routes'
// =======
// >>>>>>> 6d0a659f (Changed variable names and file names)
// =======
// >>>>>>> 6d0a659f... Changed variable names and file names
// import { RootState } from '../../store/types'
>>>>>>> de3b920e (created routing for laundry page)

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`
const FacilityCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
<<<<<<< HEAD
=======

  max-width: 337px;
>>>>>>> de3b920e (created routing for laundry page)
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

<<<<<<< HEAD
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
=======
// <<<<<<< HEAD
// <<<<<<< HEAD
// export default function FacilityBooking() {
// =======
// function FacilityBooking() {
// >>>>>>> 6d0a659f (Changed variable names and file names)
// =======
function FacilityBooking() {
  // >>>>>>> 6d0a659f... Changed variable names and file names
>>>>>>> de3b920e (created routing for laundry page)
  const dispatch = useDispatch()
  const history = useHistory()
  const { facilityList, locationList, selectedTab } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(getFacilityList())
  }, [dispatch])

<<<<<<< HEAD
  const MyBookingIcon = (
    <img
      src={bookingsIcon}
      onClick={() => {
        history.push(PATHS.VIEW_MY_BOOKINGS)
      }}
    />
  )

  const onChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTab(e.target.value))
  }

=======
  const navigateToMyBookings = () => {
    console.log('My bookings')
  }

  // <<<<<<< HEAD
  // <<<<<<< HEAD
  //   const handleSelectFacility = (facility: FacilityType) => {
  //     console.log('Selected facility ' + facility.name)
  //     dispatch(redirect(PATHS.HOME_PAGE))
  //   }

  //   const MyBookingIcon = <img src={bookingsIcon} onClick={navigateToMyBookings} />

  //   // To change up when backend is up
  //   interface FacilityType {
  //     name: string
  //     location: string
  //   }
  //   const DummyFacilities = [
  //     { name: 'Conference Room', location: 'Upper Lounge' },
  //     { name: 'Alumni Room', location: 'Upper Lounge' },
  //   ]
  // =======
  // =======
  // >>>>>>> 6d0a659f... Changed variable names and file names
  const handleSelectFacility = () => {
    console.log('Selected facility')
  }

  const MyBookingIcon = <img src={bookingsIcon} onClick={navigateToMyBookings} />
  const DummyFacilities = [{ name: 'Conference Room', location: 'Upper Lounge' }]
  // <<<<<<< HEAD
  // >>>>>>> 6d0a659f (Changed variable names and file names)
  // =======
  // >>>>>>> 6d0a659f... Changed variable names and file names

>>>>>>> de3b920e (created routing for laundry page)
  return (
    <>
      <TopNavBar title={'Facilities'} rightComponent={MyBookingIcon} />
      <MainContainer>
<<<<<<< HEAD
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
          if (facility.facilityLocation === selectedTab || selectedTab === '')
            return (
              <FacilityCard
                key={facility.facilityID}
                onClick={() => {
                  history.push('/facility/view/' + facility.facilityName)
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
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
=======
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

  // }
  // =======
}

export default FacilityBooking
// >>>>>>> b3181697... Changed variable names and file names
// =======
//       </MainContainer>
//     </>
//   )
// }

// export default FacilityBooking
//>>>>>>> 6d0a659f... Changed variable names and file names
>>>>>>> de3b920e (created routing for laundry page)
