import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import bookingsIcon from '../../../assets/bookingsIcon.svg'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`

export default function ViewFacility() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  const params = useParams<{ facilityName: string }>()

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  // const DummyFacilities = [
  //   { name: 'Conference Room', location: 'Upper Lounge' },
  //   { name: 'Alumni Room', location: 'Upper Lounge' },
  // ]

  const MyBookingIcon = <img src={bookingsIcon} />

  return (
    <>
      <TopNavBar title={params.facilityName} rightComponent={MyBookingIcon} />
      <MainContainer>
        <DateRange
          editableDateInputs={true}
          color="#DE5F4C"
          // onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          // ranges={state}
        />
        <ActionButtonGroup>
          {' '}
          <Button></Button>
        </ActionButtonGroup>
      </MainContainer>
    </>
  )
}
