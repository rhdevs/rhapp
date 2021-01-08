import React from 'react'
import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import 'antd/dist/antd.css'
import Button from '../../../components/Mobile/Button'
import washingMachineGraphic from '../../../assets/washingMachineGraphic.svg'
import { Slider } from 'antd'
import { WMStatus } from '../../../store/laundry/types'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`
const StyledSlider = styled(Slider)`
  padding: 23px;
`
const WashingMachineDetails = styled.div`
  padding: 23px;
  display: flex;
`
const WashingMachineActionGroup = styled.div`
  padding: 23px;
`
const TimeLeft = styled.div`
  display: flex;
`
const TimeLeftText = styled.p`
  font-weight: bold;
  font-size: 26px;
  color: #002642;
  text-align: center;
  line-height: 0px;
  padding: 0px 10px 0px 10px;
`
const WashingMachineTitle = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 25px;
  color: #002642;
`

const UseWashingMachineSection = styled.div`
  padding: 23px;
  text-align: center;
`

const TimeLabel = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  padding: 0px 10px 0px 10px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #023666;
`

const TimeUnit = styled.div``

const UnderLineButton = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 18px;
  line-height: 14px;
  text-align: center;
  text-decoration-line: underline;
  padding-left: 20px;
  color: #de5f4c;
`
/**
 * PageTitle can be: Reservation | Laundry Time | Collect Laundry | Edit Duration
 * SubTitle can be: "xx mins left", "It's Washy Time!", "Donezo!", or
 * DEPENDANT ON washingmachine.status : 
 * export enum WMStatus {
  AVAIL = 'Available',
  INUSE = 'In Use',
  UNCOLLECTED = 'Uncollected',
  COMPLETED = 'Completed',
  RESERVED = 'Reserved',
}
 */
export default function ViewWashingMachine() {
  const MachineDetails = (machineStatus: string) => {
    let actions
    let subtitle

    const timeLeftGroup = (
      <TimeLeft>
        <TimeUnit>
          <TimeLeftText>34 </TimeLeftText> <TimeLabel>minutes</TimeLabel>
        </TimeUnit>
        <TimeLeftText> : </TimeLeftText>
        <TimeUnit>
          <TimeLeftText> 59 </TimeLeftText> <TimeLabel>seconds</TimeLabel>
        </TimeUnit>
        <UnderLineButton>Edit</UnderLineButton>
      </TimeLeft>
    )

    switch (machineStatus) {
      case WMStatus.AVAIL:
        subtitle = <TimeLabel>{"It's Washy Time!"}</TimeLabel>
        actions = <></>
        break
      case WMStatus.INUSE:
        subtitle = timeLeftGroup
        actions = <></>
        break
      case WMStatus.COMPLETED:
        subtitle = <></>
        actions = (
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Collect Laundry'}
            defaultButtonColor="#002642DD"
            updatedButtonColor="#002642DD"
            updatedTextColor="white"
          />
        )
        break
      case WMStatus.RESERVED:
        subtitle = timeLeftGroup
        actions = (
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Cancel Reservation'}
            defaultButtonColor="#002642DD"
            updatedButtonColor="#002642DD"
            updatedTextColor="white"
          />
        )
        break
      default:
      // contents = <TimeLabel></TimeLabel>
    }

    return (
      <WashingMachineDetails>
        <img src={washingMachineGraphic} />
        <WashingMachineActionGroup>
          <WashingMachineTitle>S/N 1 (70 litres)</WashingMachineTitle>
          {subtitle}
          {actions}
        </WashingMachineActionGroup>
      </WashingMachineDetails>
    )
  }

  const UseWashineMachine = (machineStatus: string) => {
    const editMode = false
    if (machineStatus === WMStatus.AVAIL || machineStatus === WMStatus.RESERVED) {
      // or In editmode
      return (
        <UseWashingMachineSection>
          <StyledSlider
            min={1}
            max={120}
            tooltipVisible
            // onChange={onChange}
            // value={typeof time.inputValue === 'number' ? time.inputValue : 0}
            defaultValue={30}
            trackStyle={{ backgroundColor: '#023666' }}
            handleStyle={{ borderColor: '#023666', height: '15px', width: '15px' }}
          />
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={editMode ? 'Update Duration' : 'Use Washing Machine'}
            defaultButtonColor="#DE5F4C"
            updatedButtonColor="#DE5F4C"
            updatedTextColor="white"
          />
        </UseWashingMachineSection>
      )
    } else if (machineStatus === WMStatus.INUSE) {
      return (
        <Button
          hasSuccessMessage={false}
          stopPropagation={false}
          defaultButtonDescription={'Stop Washing'}
          defaultButtonColor="#DE5F4C"
          updatedButtonColor="#DE5F4C"
          updatedTextColor="white"
        />
      )
    }
  }

  return (
    <MainContainer>
      <TopNavBar title={'Washing Machine'} />
      {MachineDetails('Available')}
      {UseWashineMachine('Available')}
      <BottomNavBar />
    </MainContainer>
  )
}
