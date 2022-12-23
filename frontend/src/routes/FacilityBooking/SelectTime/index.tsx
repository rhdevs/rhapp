import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import styled from 'styled-components'
import { FormOutlined } from '@ant-design/icons'

import { onRefresh } from '../../../common/reloadPage'
import { PATHS } from '../../Routes'
import { setIsLoading } from '../../../store/facilityBooking/action'

import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import { setClickedDate } from '../../../store/facilityBooking/action'
import ConflictBookingModal from '../ViewConflicts/ConflictBookingModal'

// TODO abstract this cos is repeated 3 times
const MainContainer = styled.div`
  width: 100%;
  height: 90vh;
  background-color: #fafaf4;
`

/**
 * # Select Time Page
 * Path: `/facility/selectTime`
 *
 * ## Page Description
 * Select Time Page is accessable through the Facilities Landing Page. On Select Time Page,
 * // TODO
 *
 * @remarks
 */
export default function selectTime() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(setIsLoading(true))
  }, [])

  const MyBookingsIcon = (
    <FormOutlined
      style={{ color: 'black', fontSize: '150%' }}
      onClick={() => {
        history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
      }}
    />
  )

  const onDateClick = (newClickedDate: Date) => {
    dispatch(setClickedDate(newClickedDate))
  }

  return (
    <>
      <TopNavBarRevamp
        title="Select Starting Date to Book"
        rightComponent={MyBookingsIcon}
        onLeftClick={() => history.push(`${PATHS.SELECT_FACILITY}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <Calendar onDateClick={onDateClick} />
          <BottomNavBar />
        </MainContainer>
      </PullToRefresh>
      <ConflictBookingModal modalOpen={modalIsOpen} setModalOpen={setModalIsOpen} />
    </>
  )
}
