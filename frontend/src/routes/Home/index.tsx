import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
import DropDownBar from '../../components/dropdown'
import picture from '../../assets/trial.svg'
import tree from '../../assets/tree.svg'
import { BasicCard } from '../../components/basiccard/test2'
import { LaundryPage } from '../../components/laundrypage/test'

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
      <Reddropdownbar menutitle={'Choose your level'} menuarray={['Level 1', 'Level 2', 'Level 3']} />
      <Reddropdownbar menutitle={'Choose your block'} menuarray={['Blk 2', 'Blk 3', 'Blk 4']} />
      <TopNavBar title={'NavBarTitle'} leftIconComponent={leftIcon} />
      <button onClick={onButtonClick}>{sampleStateText}</button>
      <LaundryPage />
      <BasicCard />
    </MainContainer>
  )
}
