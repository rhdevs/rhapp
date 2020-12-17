import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
<<<<<<< HEAD
import DropDownBar from '../../components/DropdownBar'
=======
>>>>>>> d909cd34 (DropDownBar in components but not used in index.)
import { FacilityBooking } from '../../components/LaundryCards/template'
import Selector from '../../components/Selector'

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
      <Selector SelectedValue={'Choose your block'} ValueArray={['1', '2', '3', '4']} />
      <TopNavBar title={'NavBarTitle'} leftIconComponent={leftIcon} />
      <button onClick={onButtonClick}>{sampleStateText}</button>
      <FacilityBooking title={'In Use'} subtitle={'123'} colour={'red'} />
    </MainContainer>
  )
}
