import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
import DropDownBar from '../../components/DropdownBar'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import SocialPostCard from '../../components/Mobile/SocialPostCard'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`

export default function Home() {
  const dispatch = useDispatch()
  const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    //do smth @ the start
  }, [dispatch])

  const leftIcon = <button>Hello</button>

  const onButtonClick = () => {
    dispatch(getUpdateMockString())
  }

  return (
    <MainContainer>
      <DropDownBar menuTitle={'Choose your block'} menuArray={['level', 'floor', 'block']} />
      <TopNavBar title={'NavBarTitle'} leftIconComponent={leftIcon} />
      <button onClick={onButtonClick}>{sampleStateText}</button>
      <SocialPostCard
        title={'Hello'}
        dateTime={'Zhou Gou Gou, 8h ago'}
        description={
          'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!'
        }
      />
      <BottomNavBar />
    </MainContainer>
  )
}
