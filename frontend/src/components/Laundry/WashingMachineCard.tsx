import React from 'react'
import styled from 'styled-components'
import washingMachineIcon from '../../assets/washingMachineIcon.svg'
import reserveIcon from '../../assets/reserveIcon.svg'
import notifyBellIcon from '../../assets/notifyBellIcon.svg'
import collectIcon from '../../assets/collectIcon.svg'
import rightArrowIcon from '../../assets/rightArrowIcon.svg'
import { useHistory } from 'react-router-dom'
import tickIcon from '../../assets/tickIcon.svg'
import { WashingMachine, WMStatus } from '../../store/laundry/types'
import { PATHS } from '../../routes/Routes'

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
  color: ${(inputColor) => (inputColor ? 'white' : 'palevioletred')};
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
  text-align: center;
`
export default function WashingMachineCard(props: { washingMachine: WashingMachine }) {
  const history = useHistory()
  let label
  let iconSrc
  const cardPrimaryColor =
    props.washingMachine.job === WMStatus.UNCOLLECTED || props.washingMachine.job === WMStatus.COMPLETED
      ? '#EB5757'
      : '#002642'
  let rightAction

  switch (props.washingMachine.job) {
    case WMStatus.AVAIL:
      label = 'Reserve'
      iconSrc = reserveIcon
      rightAction = () => {
        console.log('reserve!')
      }
      break
    case WMStatus.COMPLETED:
      label = 'Collect'
      iconSrc = collectIcon
      rightAction = () => {
        console.log('collect!')
      }
      break
    case WMStatus.RESERVED:
      label = '14:39 remaining'
      iconSrc = tickIcon
      rightAction = () => {
        history.push(PATHS.VIEW_WASHING_MACHINE)
      }
      break
    case WMStatus.INUSE:
      label = '14:39 remaining'
      break
    case WMStatus.UNCOLLECTED:
      label = 'Notify'
      iconSrc = notifyBellIcon
      rightAction = () => {
        console.log('notify!')
      }
      break
    default:
      label = 'In Use'
  }

  return (
    <CardContainer>
      <WashingMachineAvatar src={washingMachineIcon} onClick={() => history.push(PATHS.VIEW_WASHING_MACHINE)} />
      <Labels onClick={() => history.push(PATHS.VIEW_WASHING_MACHINE)}>
        <Header style={{ color: cardPrimaryColor }}>{props.washingMachine.job}</Header>
        <SubHeader style={{ color: cardPrimaryColor }}>S/N{props.washingMachine.machineId}</SubHeader>
      </Labels>
      <RightActionGroups onClick={rightAction}>
        <ActionButton src={iconSrc} style={{ color: cardPrimaryColor }} />
        {props.washingMachine.job === WMStatus.RESERVED && (
          <ActionButton style={{ fill: cardPrimaryColor }} src={rightArrowIcon} />
        )}
        <ActionButtonLabel style={{ color: cardPrimaryColor + '!important' }}>{label}</ActionButtonLabel>
      </RightActionGroups>
    </CardContainer>
  )
}
