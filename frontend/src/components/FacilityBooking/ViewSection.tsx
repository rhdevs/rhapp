import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import ViewBlock from './ViewBlock'
import { RootState } from '../../store/types'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { setIsLoading, updateDailyView } from '../../store/facilityBooking/action'

const ViewScheduleBlock = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const { clickedDate } = useSelector((state: RootState) => state.calendar)
  const dispatch = useDispatch()
  const defaultTimePosition = 16 //4pm (can range from 0 to 23 - length of timeBlocks)

  // useEffect(() => {
  //   dispatch(getTimeBlocks(clickedDate))
  // }, [])

  return (
    <MainContainer>
      <CurrentTimeLine />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <ViewBlock
            key={index}
            entry={entry}
            // if day selected is not current, scroll to defaultTimePosition
            scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
          />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default ViewScheduleBlock
