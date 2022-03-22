import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import LoadingSpin from '../../../components/LoadingSpin'
import BookingSection from '../../../components/FacilityBooking/BookingSection'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'
import { RootState } from '../../../store/types'
import { setIsLoading, updateDailyView } from '../../../store/facilityBooking/action'
import { PATHS } from '../../Routes'

const HEADER_HEIGHT = '70px'

const Background = styled.div`
  background-color: #fff;
  height: calc(100vh - ${HEADER_HEIGHT});
  width: (100vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 36px;
  overflow: hidden;
`

const BookingSectionDiv = styled.div`
  width: 100vw;
  height: 100%;
  overflow-y: scroll;

  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

const TitleText = styled.h2`
  font-family: lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  margin-top: 0.7rem;
`

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

type State = {
  date: Date
  facilityId: number
}

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation<State>()
  const { selectedFacilityName, isLoading } = useSelector((state: RootState) => state.facilityBooking)
  const { clickedDate } = useSelector((state: RootState) => state.calendar)
  const params = useParams<{ facilityID: string }>()

  const selectedFacilityId = parseInt(params.facilityID)
  const date = location.state.date
  //TODO saturday date row is limit
  // useEffect(() => {
  //   // dispatch(setIsLoading(true))
  //   console.log('update dv onload')
  //   dispatch(updateDailyView(date, selectedFacilityId))
  // }, [])

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(updateDailyView(date, selectedFacilityId))
  }, [date])

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={() =>
          history.push({
            pathname: PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW + selectedFacilityId,
            state: {
              date: date,
            },
          })
        }
        centerComponent={<TitleText>Book {selectedFacilityName}</TitleText>}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <h2>Choose starting time slot</h2>
          <DailyViewDatesRow
            date={date}
            selectedFacilityId={selectedFacilityId}
            redirectTo={PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}
          />
          <BookingSectionDiv>
            <BookingSection redirectPath={PATHS.CREATE_FACILITY_BOOKING} facilityId={selectedFacilityId} date={date} />
          </BookingSectionDiv>
        </Background>
      )}
    </>
  )
}
