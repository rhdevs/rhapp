import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import { resetTimeSelectorSelection, updateBookingDailyView } from '../../../store/facilityBooking/action'

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
  font-family: Lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  margin-top: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
`
/**
 * # Facility Day View
 * Path: `/facility/selectedFacility/dayView/:facilityId`
 *
 * ## Page Description
 * The user gets redirected to this page after clicking on a date on the ViewFacility page. \
 * This page shows all dates on the same week that is picked by the user, allowing them to alter their selection within that week. \
 * The user gets redirected to the `CreateBookingDailyView` page after clicking the `Book Facility` button.
 *
 * @remarks
 * <any remarks on this component type in here>
 *
 */

export default function FacilityDayView() {
  const history = useHistory()
  const dispatch = useDispatch()
  const params = useParams<{ facilityId: string }>()
  const { clickedDate } = useSelector((state: RootState) => state.facilityBooking)
  const { isLoading, selectedFacilityName } = useSelector((state: RootState) => state.facilityBooking)

  const selectedFacilityId = parseInt(params.facilityId)

  useEffect(() => {
    dispatch(updateBookingDailyView(clickedDate, selectedFacilityId))
  }, [clickedDate])

  const bookFacilityOnClick = () => {
    // reset time selection on next page
    dispatch(resetTimeSelectorSelection())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`)
  }

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={() => history.push(`${PATHS.VIEW_FACILITY}/${selectedFacilityId}`)}
        centerComponent={<TitleText>{`${selectedFacilityName} - View Booked Timeslots`}</TitleText>}
        rightComponent={
          <ButtonComponent state="primary" text="Book Facility" onClick={bookFacilityOnClick} size="small" />
        }
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <DailyViewDatesRow />
          <ViewSectionDiv>
            <ViewScheduleBlock />
          </ViewSectionDiv>
        </Background>
      )}
    </>
  )
}