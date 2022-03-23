import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import ViewSection from '../../../components/FacilityBooking/ViewSection'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import ButtonComponent from '../../../components/Button'
import { setIsLoading, updateDailyView } from '../../../store/facilityBooking/action'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'
import { fetchFacilityNameFromID, setSelectedFacility } from '../../../store/facilityBooking/action'

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

type State = {
  dateRowStartDate: number
}

export default function ViewBookingDailyView() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { isLoading, selectedFacilityName } = useSelector((state: RootState) => state.facilityBooking)
  // const location = useLocation<State>()
  const params = useParams<{ facilityID: string }>()

  const selectedFacilityId = parseInt(params.facilityID)

  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  const location = useLocation<State>()
  const dateRowStartDate = location.state.dateRowStartDate

  const clickedDateToDateObject = (clickedDate: number) => {
    const month = Math.floor(clickedDate / 100)
    const day = clickedDate % 100
    return new Date(new Date().getFullYear(), month, day)
  }

  const date = clickedDateToDateObject(clickedDate)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(updateDailyView(date, selectedFacilityId))
  }, [])

  useEffect(() => {
    dispatch(updateDailyView(date, selectedFacilityId))
    // dispatch(fetchFacilityNameFromID(selectedFacilityId))
    // if (selectedFacilityId == 0) {
    //   dispatch(setSelectedFacility(selectedFacilityId))
    // }
  }, [clickedDate])

  return (
    <>
      <TopNavBarRevamp
        onLeftClick={() => history.push(PATHS.VIEW_FACILITY + selectedFacilityId)}
        centerComponent={<TitleText>{selectedFacilityName}</TitleText>}
        rightComponent={
          <ButtonComponent
            state="primary"
            text="Book Facility"
            onClick={() =>
              history.push({
                pathname: PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW + selectedFacilityId,
                state: {
                  dateRowStartDate: dateRowStartDate,
                },
              })
            }
            size="small"
          />
        }
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <DailyViewDatesRow
            selectedDate={date}
            selectedFacilityId={selectedFacilityId}
            redirectTo={PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW + selectedFacilityId}
            dateRowStartDate={dateRowStartDate}
          />
          <ViewSectionDiv>
            <ViewSection />
          </ViewSectionDiv>
        </Background>
      )}
    </>
  )
}
