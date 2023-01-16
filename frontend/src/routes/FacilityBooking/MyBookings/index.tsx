import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import PullToRefresh from 'pull-to-refresh-react'

import { onRefresh } from '../../../common/reloadPage'
import { getMyBookings, setIsLoading } from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BookingCard from '../../../components/FacilityBooking/BookingCard'

import catIcon from '../../../assets/catMagnifyGlass.svg'
import { useParams } from 'react-router-dom'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
  position: fixed;
  top: 70px;
  overflow: scroll;
  padding-bottom: 50px;
`

const NoBookingsFound = styled.div`
  text-align: center;
  font-size: 20px;
  align-self: center;
  margin-top: 40px;
`

/**
 * # ViewMyBookings
 *
 * Path: `/facility/booking/user/:userId`
 *
 * ##Page Description
 * The page that contains all of the user's bookings. The user can click on each booking to view it in detail,
 * or use the right action buttons to edit or delete the booking respectively
 *
 * @remarks
 * <any remarks>
 *
 */
export default function ViewMyBookings() {
  const dispatch = useDispatch()
  const params = useParams<{ userId: string }>()
  const { myBookings, isLoading } = useSelector((state: RootState) => state.facilityBooking)

  const userId = params.userId

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(getMyBookings(userId))
  }, [dispatch])

  return (
    <>
      <PullToRefresh onRefresh={onRefresh}>
        <TopNavBar title="My Bookings" />
        <MainContainer>
          {isLoading ? (
            <LoadingSpin />
          ) : (
            <>
              {myBookings.length === 0 && <NoBookingsFound>You have not made any bookings.</NoBookingsFound>}
              {myBookings?.map((booking, idx) => {
                const isOver = booking.endTime < parseInt((new Date().getTime() / 1000).toFixed(0))
                if (!isOver) return <BookingCard key={idx} booking={booking} />
              })}
              {myBookings?.length === 0 && !myBookings && (
                <div>
                  <img src={catIcon} /> <h1>You have no Bookings yet!</h1>
                </div>
              )}
            </>
          )}
        </MainContainer>
      </PullToRefresh>
    </>
  )
}
