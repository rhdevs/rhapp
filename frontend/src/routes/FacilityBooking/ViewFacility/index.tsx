import React, { useEffect } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import bookingsIcon from '../../../assets/bookingsIcon.svg'
import messageIcon from '../../../assets/messageIcon.svg'
import adminIcon from '../../../assets/adminIcon.svg'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import Button from '../../../components/Mobile/Button'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Alert } from 'antd'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import {
  createNewBookingFromFacility,
  fetchFacilityNameFromID,
  getAllBookingsForFacility,
  SetIsLoading,
  setViewDates,
  setSelectedFacility,
} from '../../../store/facilityBooking/action'
import { months } from '../../../common/dates'
import LoadingSpin from '../../../components/LoadingSpin'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'
import { onRefresh } from '../../../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'
import dayjs from 'dayjs'
// import Calendar from 'react-calendar'
import './calendar.css'
import BookingCard from '../../../components/BookingCard'
import ConflictAlert from '../../../components/ConflictAlert'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

const MainContainer = styled.div`
  width: 100%;
  height: 90vh;
  background-color: #fafaf4;
`

const StyledButton = styled(Button)`
  .ant-btn {
    border-radius: 25px;
  }
`

const DateDisplayText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  text-align: left;
  padding: 10px 0px 0px 23px;
`

const Icon = styled.img`
  padding: 20px;
`

const ActionButtonGroup = styled.div`
  justify-content: space-between;
  display: flex;
  padding: 16px 23px 0px 23px;
  float: right;
`

const EventsGroup = styled.div``

const EventCard = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  padding: 15px;
`

const AlertGroup = styled.div`
  padding: 3px 23px 3px 23px;
`

export default function ViewFacility() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityID: string }>()
  const {
    ViewStartDate,
    ViewEndDate,
    createSuccess,
    createFailure,
    selectedFacilityName,
    selectedFacilityId,
  } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityID)))
    dispatch(getAllBookingsForFacility(ViewStartDate, ViewEndDate, parseInt(params.facilityID)))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityID)))
    }
    return () => {
      dispatch(setViewDates(new Date(), parseInt(params.facilityID)))
    }
  }, [])

  const MyBookingIcon = (
    <img
      src={bookingsIcon}
      onClick={() => {
        history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
      }}
    />
  )

  const AlertSection = (
    <AlertGroup>
      {createSuccess && createFailure && (
        <Alert message="Successful" description="Yay yippe doodles" type="success" closable showIcon />
      )}
      {createFailure && !createSuccess && <Alert message="Not Successful Boohoo :-(" type="error" closable showIcon />}
    </AlertGroup>
  )

  return (
    <div style={{ backgroundColor: '#fafaf4' }}>
      <TopNavBarRevamp title={selectedFacilityName} rightComponent={MyBookingIcon} />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <>
            {AlertSection}
            <Calendar selectedFacilityId={parseInt(params.facilityID)} />
            <BottomNavBar />
          </>
        </MainContainer>
      </PullToRefresh>
    </div>
  )
}
