import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import { handleCreateBooking } from '../../../store/facilityBooking/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import BookingSection from '../../../components/FacilityBooking/BookingSection'
import { DateRows } from '../../../components/Calendar/DateRows'
import TimetableRow from '../../../components/timetable/TimetableRow'

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

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    newBooking,
    newBookingCCA,
    newBookingDescription,
    newBookingFacilityName,
    newBookingFromDate,
    facilityList,
    isLoading,
    createBookingError,
  } = useSelector((state: RootState) => state.facilityBooking)

  const CheckIcon = (createBookingError: string) => {
    if (
      createBookingError === '' &&
      newBookingCCA !== '' &&
      newBookingDescription !== '' &&
      newBookingFacilityName !== ''
    ) {
      return (
        <div
          onClick={() => {
            dispatch(handleCreateBooking(newBooking?.bookingID ? true : false))
          }}
        >
          <CheckOutlined style={{ color: 'green' }} />
        </div>
      )
    } else {
      // if (newBookingCCA !== '' || newBookingDescription !== '' || newBookingFacilityName !== '') {
      //   dispatch(SetCreateBookingError('All fields are compulsary!'))
      // }
      return <CheckOutlined style={{ color: '#0000004d' }} />
    }
  }

  /* 
  TODO: There are two places that are called conference room, 1 in kuok and 1 in UL. The name has to deconflict.
  Used to be there are two Main Area also but since name is short, they are now Main Area (UL) and Main Area (Hall)
  */
  const locationOptions = facilityList
    .filter((facility) => facility.facilityName !== 'Conference Room')
    .map((facility) => ({
      value: facility.facilityName,
    }))

  locationOptions.push({ value: 'Conference Room' })

  return (
    <div>
      <TopNavBar title={`Book ${newBookingFacilityName}`} rightComponent={CheckIcon(createBookingError)} />
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <Background>
          <h2>Choose starting time slot</h2>
          <em>&lt;Date Selector here&gt;</em>
          <h2>
            The Date: Day {newBookingFromDate.getDate()} of Month {newBookingFromDate.getMonth() + 1} of Year&nbsp;
            {newBookingFromDate.getFullYear()}
          </h2>
          <BookingSectionDiv>
            <BookingSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
