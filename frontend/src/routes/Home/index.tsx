import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
import DropDownBar from '../../components/dropdown'

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

  const Reddropdownbar = styled(DropDownBar)`
    .ant-btn {
      background.background-color: red;
    }
  `

  return (
    <MainContainer>
      <Reddropdownbar menutitle={'Choose your block'} menuarray={['level', 'floor', 'block']} />
      <TopNavBar title={'NavBarTitle'} leftIconComponent={leftIcon} />
      <button onClick={onButtonClick}>{sampleStateText}</button>
      <BottomNavBar />
    </MainContainer>
  )
}
