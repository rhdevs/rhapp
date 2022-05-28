import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import styled from 'styled-components'
import { FormOutlined } from '@ant-design/icons'

import { onRefresh } from '../../../common/reloadPage'
import { PATHS } from '../../Routes'
import {
  fetchFacilityNameFromID,
  resetBooking,
  setIsLoading,
  setSelectedFacility,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

const MainContainer = styled.div`
  width: 100%;
  height: 90vh;
  background-color: #fafaf4;
`

export default function SelectRecurringDatePage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const { selectedFacilityName, selectedFacilityId } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(resetBooking()) // TODO what is this
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityId)))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityId)))
    }
  }, [])

  const onDateClick = (date: Date) => {
    const reccuringdate = date.getTime() / 1000
    if (Date.now() / 1000 <= reccuringdate) {
      history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${params.facilityId}`)
    }
  }

  return (
    <>
      <TopNavBarRevamp
        title="Select Weekly Booking End Date"
        onLeftClick={() => history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${params.facilityId}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <Calendar selectedFacilityId={parseInt(params.facilityId)} onDateClick={onDateClick} />
        </MainContainer>
      </PullToRefresh>
    </>
  )
}
