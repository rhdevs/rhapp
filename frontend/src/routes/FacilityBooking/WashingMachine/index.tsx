import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useDispatch } from 'react-redux'
import { BasicCard } from '../../../components/basiccard/test2'
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

const FirstSelector = styled.div`
  position: relative;
  left: 23px;
`

const SecondSelector = styled.div`
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
          <FirstSelector>
            <Selector SelectedValue={'Choose your block'} ValueArray={['2', '3']} />
          </FirstSelector>
          <SecondSelector>
            <Selector SelectedValue={'Choose your level'} ValueArray={['2', '3']} />
          </SecondSelector>
        </Selectors>
        <BasicCard />
        <BottomNavBar />
      </MainContainer>
    </>
  )
}