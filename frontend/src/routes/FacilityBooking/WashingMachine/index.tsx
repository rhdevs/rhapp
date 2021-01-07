import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useDispatch } from 'react-redux'
import { BasicCard } from '../../../components/basiccard/BasicCard'
import styled from 'styled-components'
import '../../../assets/fonts.css'
import Selector from '../../../components/Selector'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
// import { RootState } from '../../store/types'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`

const Selectors = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  max-width: 337px;
  min-height: 50px;
  height: 30px;
  justify-content: space-between;
  display: flex;
`

const BlockSelector = styled.div`
  position: relative;
  left: 23px;
`

const FloorSelector = styled.div`
  position: relative;
  right: 0px;
`

export default function ViewBooking() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Laundry Time'} />
        <Selectors>
          <BlockSelector>
            <Selector SelectedValue={'Choose your block'} ValueArray={['2', '3']} />
          </BlockSelector>
          <FloorSelector>
            <Selector SelectedValue={'Choose your level'} ValueArray={['2', '3']} />
          </FloorSelector>
        </Selectors>
        <BasicCard />
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
