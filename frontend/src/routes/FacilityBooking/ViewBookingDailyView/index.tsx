import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import { updateDailyView } from '../../../store/facilityBooking/action'

import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import ButtonComponent from '../../../components/Button'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'
import ViewScheduleBlock from '../../../components/FacilityBooking/ViewScheduleBlock'

const HEADER_HEIGHT = '70px'

const Background = styled.div`
  background-color: #fff;
  height: calc(100vh - ${HEADER_HEIGHT});
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 36px;
  overflow: hidden;
`

const ViewSectionDiv = styled.div`
  width: 100%;
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
  overflow: hidden;
  text-overflow: ellipsis;
`

export default function ViewBookingDailyView() {
  const history = useHistory()
  const dispatch = useDispatch()
  const params = useParams<{ facilityId: string }>()
  const { clickedDate } = useSelector((state: RootState) => state.calendar)
  const { isLoading, selectedFacilityName } = useSelector((state: RootState) => state.facilityBooking)

  const selectedFacilityId = parseInt(params.facilityId)

  useEffect(() => {
    dispatch(updateDailyView(clickedDate, selectedFacilityId))
  }, [clickedDate])

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={() => history.push(`${PATHS.VIEW_FACILITY}/${selectedFacilityId}`)}
        centerComponent={<TitleText>{selectedFacilityName}</TitleText>}
        rightComponent={
          <ButtonComponent
            state="primary"
            text="Book Facility"
            onClick={() => history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`)}
            size="small"
          />
        }
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <DailyViewDatesRow selectedDate={clickedDate} selectedFacilityId={selectedFacilityId} />
          <ViewSectionDiv>
            <ViewScheduleBlock />
          </ViewSectionDiv>
        </Background>
      )}
    </>
  )
}
