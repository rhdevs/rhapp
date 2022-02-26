import React, { useEffect } from 'react'
import styled from 'styled-components'
import bookingsIcon from '../../../assets/bookingsIcon.svg'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import Button from '../../../components/Button'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import { fetchFacilityNameFromID, SetIsLoading, setSelectedFacility } from '../../../store/facilityBooking/action'
import { onRefresh } from '../../../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'
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

export default function ViewFacility() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityID: string }>()
  const { selectedFacilityName, selectedFacilityId } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityID)))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityID)))
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

  const MyBookingButton = (
    <Button
      state="primary"
      text="My Bookings"
      type="button"
      onClick={() => {
        history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
      }}
    />
  )

  return (
    <div style={{ backgroundColor: '#fafaf4' }}>
      <TopNavBarRevamp title={selectedFacilityName} rightComponent={MyBookingButton} />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <>
            <Calendar selectedFacilityId={parseInt(params.facilityID)} />
            <BottomNavBar />
          </>
        </MainContainer>
      </PullToRefresh>
    </div>
  )
}
