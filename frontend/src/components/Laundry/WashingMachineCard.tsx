import React from 'react'
import styled from 'styled-components'
import washingMachineIcon from '../../assets/washingMachineIcon.svg'
import reserveIcon from '../../assets/reserveIcon.svg'
import notifyBellIcon from '../../assets/notifyBellIcon.svg'
import collectIcon from '../../assets/collectIcon.svg'
import rightArrowIcon from '../../assets/rightArrowIcon.svg'
import tickIcon from '../../assets/tickIcon.svg'

const CardContainer = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`
const WashingMachineAvatar = styled.img`
  padding: 20px;
`

const Labels = styled.div`
  align-self: center;
`

const Header = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 14px;
  color: #eb5757;
`

const SubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #eb5757;
`

const RightActionGroups = styled.div`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(-17%, -50%);
`

const ActionButton = styled.img`
  padding: 15px;
`
const ActionButtonLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 0px;
  color: #000000;
  text-align: center;
`
type Props = {
  // {
  //   machineId: 6101,
  //   locationId: 61,
  //   userId: '1',
  //   jobId: '2312',
  //   type: 'Washing Machine',
  //   startTime: 1608723138,
  //   duration: 60,
  //   job: 'Available',
  // },
}

function WashingMachineCard(props: Props) {
  return (
    <CardContainer>
      <WashingMachineAvatar src={washingMachineIcon} />
      <Labels>
        <Header>Available</Header>
        <SubHeader>S/N111</SubHeader>
      </Labels>
      <RightActionGroups>
        <ActionButton src={collectIcon} />
        <ActionButtonLabel>14:39 remaining</ActionButtonLabel>
      </RightActionGroups>
    </CardContainer>
  )
}

export default WashingMachineCard
