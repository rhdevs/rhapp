import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Button from '../../../components/Button'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import {
  fetchFacilityNameFromID,
  resetBooking,
  setIsLoading,
  setSelectedFacility,
  resetNewBooking,
  setDailyViewDatesRowStartDate,
} from '../../../store/facilityBooking/action'
import { onRefresh } from '../../../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

const MainContainer = styled.div`
  width: 100%;
  height: 90vh;
  background-color: #fafaf4;
`

export default function ViewFacility() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityID: string }>()
  const { selectedFacilityName, selectedFacilityId } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(resetBooking())
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityID)))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityID)))
    }
  }, [])

  const MyBookingButton = (
    <Button
      state="primary"
      text="Bookings"
      type="button"
      size="small"
      onClick={() => {
        history.push(`${PATHS.VIEW_MY_BOOKINGS_USERID}/${localStorage.getItem('userID')}`)
      }}
    />
  )

  const getDateRowStartDate = (fullDate: Date) => {
    const date = fullDate.getDate()
    const day = fullDate.getDay()

    if (day === 6) return date // if saturday chosen, start row on saturday instead of sunday

    if (date - day < 0) {
      // if date is on the new week of the month that doesn't start on sunday
      const year = fullDate.getFullYear()
      const month = fullDate.getMonth() // month index (0 = January)
      const maxDatePrevMonth = new Date(year, month, 0).getDate() // max date of PREVIOUS month
      return maxDatePrevMonth - (day - date) // get previous month's last sunday
    }

    return date - day // by default, date row start on sunday
  }

  const onClickDate = (date: Date) => {
    const dateRowStartDate = getDateRowStartDate(date)
    dispatch(setDailyViewDatesRowStartDate(dateRowStartDate))

    history.push({
      pathname: PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW + params.facilityID,
      state: {
        dateRowStartDate: dateRowStartDate,
      },
    })
  }

  return (
    <>
      <TopNavBarRevamp
        title={selectedFacilityName}
        rightComponent={MyBookingButton}
        onLeftClick={() => history.push(`${PATHS.FACILITY_BOOKING_MAIN}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <Calendar selectedFacilityId={parseInt(params.facilityID)} onClickDate={onClickDate} />
          <BottomNavBar />
        </MainContainer>
      </PullToRefresh>
    </>
  )
}
