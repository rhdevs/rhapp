import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { DayHeaders } from './DayHeaders'
import { MonthlyContainer } from './MonthlyContainer'
import { eventDays, processedDates } from './../../store/stubs'
import { getAllBookingsForFacility, SetIsLoading } from '../../store/calendar/actions'
import LoadingSpin from '../LoadingSpin'

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: min-content;
  margin-right: auto;
  margin-left: auto;
`

const YearContainer = styled.div`
  width: calc(47.14px * 7);
  font-weight: 600;
  color: #58b994;
  text-align: center;
  padding-top: 10px;
`

const MonthContainer = styled.div`
  padding-bottom: 5px;
`

const MonthsHeaderContainer = styled.div`
  width: 93px;
  color: #58b994;
  margin-top: 10px;
  margin-left: 10px;
  padding-bottom: 20px;
  font-weight: 600;
`

const DatesGridContainer = styled.div`
  display: grid;
  grid-template-columns: 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px;
`

// this component takes in an array of events or an array of dates that has events
export const Calendar = (props: { selectedFacilityId: number }) => {
  const dispatch = useDispatch()
  const { CalendarViewFacilityStartDate, facilityBookings, processedDates, isLoading } = useSelector(
    (state: RootState) => state.calendar,
  )

  useEffect(() => {
    // set to 1 for easier debugging. 1 for UL Main Area
    dispatch(SetIsLoading(true))
    dispatch(getAllBookingsForFacility(CalendarViewFacilityStartDate, props.selectedFacilityId))
  }, [])

  const today = new Date()
  let startingMonth = 0
  const currentYear = today.getFullYear()

  const monthList = [0, 1, 2, 3, 4].map((x) => new Date(today.getFullYear(), today.getMonth() + x, 1))

  return (
    <>
      {!isLoading && (
        <CalenderContainer>
          <YearContainer>{currentYear}</YearContainer>
          <MonthContainer>
            <MonthsHeaderContainer>{monthList[0].toLocaleString('default', { month: 'long' })}</MonthsHeaderContainer>
            <DatesGridContainer>
              <DayHeaders />
              <MonthlyContainer nthMonth={startingMonth++} />
            </DatesGridContainer>
          </MonthContainer>
          <>
            {monthList.slice(1).map((month) => {
              if (month.getMonth() === 0) {
                // Note: 0 stands for Jan
                return (
                  <>
                    <YearContainer>{currentYear + 1}</YearContainer>
                    <MonthContainer key={startingMonth++}>
                      <MonthsHeaderContainer>
                        {month.toLocaleString('default', { month: 'long' })}
                      </MonthsHeaderContainer>
                      <DatesGridContainer>
                        <DayHeaders />
                        <MonthlyContainer key={startingMonth} nthMonth={startingMonth} />
                      </DatesGridContainer>
                    </MonthContainer>
                  </>
                )
              }
              return (
                <MonthContainer key={startingMonth++}>
                  <MonthsHeaderContainer>{month.toLocaleString('default', { month: 'long' })}</MonthsHeaderContainer>
                  <DatesGridContainer>
                    <DayHeaders />
                    <MonthlyContainer key={startingMonth} nthMonth={startingMonth} />
                  </DatesGridContainer>
                </MonthContainer>
              )
            })}
          </>
        </CalenderContainer>
      )}
      ){isLoading && <LoadingSpin />}
    </>
  )
}
