import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import ViewBlock from './ViewBlock'
import { RootState } from '../../store/types'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { getTimeBlocks } from '../../store/facilityBooking/action'
import { ViewBookingCard } from './ViewBookingCard'
import { myBookingsStub } from '../../store/stubs'

const ViewScheduleBlock = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const dispatch = useDispatch()
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false)
  const defaultTimePosition = 16 //4pm (can range from 0 to 23 - length of timeBlocks)

  useEffect(() => {
    dispatch(getTimeBlocks())
  }, [])

  console.log(timeBlocks)

  return (
    <>
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
    </>
  )
}
export default ViewScheduleBlock
