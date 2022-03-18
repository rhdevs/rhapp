import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import ViewSection from '../../../components/FacilityBooking/ViewSection'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import { updateDailyView } from '../../../store/facilityBooking/action'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'
import { fetchFacilityNameFromID, setSelectedFacility } from '../../../store/facilityBooking/action'
import { UnorderedListOutlined } from '@ant-design/icons'

const HEADER_HEIGHT = '70px'

const Background = styled.div`
  background-color: #fff;
  height: calc(100vh - ${HEADER_HEIGHT});
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BookingSectionDiv = styled.div`
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
  date: Date
  facilityId: number
}

export default function ViewBookingDailyView() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { isLoading, selectedFacilityName } = useSelector((state: RootState) => state.facilityBooking)
  const location = useLocation<State>()
  const selectedFacilityId = location.state.facilityId
  const date = location.state.date

  useEffect(() => {
    dispatch(updateDailyView(date, selectedFacilityId))
    dispatch(fetchFacilityNameFromID(selectedFacilityId))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(selectedFacilityId))
    }
  }, [date])

  const bookingFacilityIcon = (
    <UnorderedListOutlined
      style={{ color: 'black', fontSize: '150%' }}
      onClick={() => console.log('link to booking page')}
    />
  )

  return (
    <div>
      <TopNavBarRevamp
        onLeftClick={() => history.push(`${PATHS.VIEW_FACILITY}/${selectedFacilityId}`)}
        centerComponent={<TitleText>{selectedFacilityName}</TitleText>}
        rightComponent={bookingFacilityIcon}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <DailyViewDatesRow date={date} selectedFacilityId={selectedFacilityId} />
          <BookingSectionDiv>
            <ViewSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
