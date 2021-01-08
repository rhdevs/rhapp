import React from 'react'
import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import 'antd/dist/antd.css'
import Button from '../../../components/Mobile/Button'
import { Slider } from 'antd'
import { WashingMachine, WMStatus } from '../../../store/laundry/types'
import washingMachineInUse from '../../../assets/washing-machines/washingmachine-inuse.gif'
import { WashingMachineListStub } from '../../../store/stubs'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`
const StyledSlider = styled(Slider)`
  padding: 23px;
  padding-bottom: 35px;
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
  font-size: 15px;
  line-height: 20px;
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

const MachineSize = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 30px;
  color: #023666;
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
  const MachineDetails = (machine: WashingMachine) => {
    let pageTitle = 'Laundry Time!'
    let actions = <></>
    let subtitle = <></>
    const imagesrc = washingMachineInUse

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

    switch (machine.job) {
      case WMStatus.AVAIL:
        subtitle = <TimeLabel>{"It's Washy Time!"}</TimeLabel>
        pageTitle = 'Laundry Time'
        break
      case WMStatus.INUSE:
        subtitle = timeLeftGroup
        pageTitle = 'In Use'
        break
      case WMStatus.COMPLETED:
        pageTitle = 'Collect Laundry'
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
        pageTitle = 'Reservation'
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
    }

    return (
      <>
        <TopNavBar title={pageTitle} />
        <WashingMachineDetails>
          <img src={imagesrc} style={{ width: '30%', height: '30%' }} />
          <WashingMachineActionGroup>
            <WashingMachineTitle>
              S/N {machine.machineId}
              <MachineSize>(70 litres)</MachineSize>
            </WashingMachineTitle>
            {subtitle}
            {actions}
          </WashingMachineActionGroup>
        </WashingMachineDetails>
      </>
    )
  }

  const UseWashineMachine = (machine: WashingMachine) => {
    const editMode = false
    if (machine.job === WMStatus.AVAIL || machine.job === WMStatus.RESERVED) {
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
    } else if (machine.job === WMStatus.INUSE) {
      return (
        <UseWashingMachineSection>
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Stop Washing'}
            defaultButtonColor="#DE5F4C"
            updatedButtonColor="#DE5F4C"
            updatedTextColor="white"
          />
        </UseWashingMachineSection>
      )
    }
  }

  return (
    <MainContainer>
      {MachineDetails(WashingMachineListStub[1])}
      {UseWashineMachine(WashingMachineListStub[1])}
      <BottomNavBar />
    </MainContainer>
  )
}
