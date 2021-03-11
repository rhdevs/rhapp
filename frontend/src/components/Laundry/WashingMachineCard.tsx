import React, { useEffect } from 'react'
import styled from 'styled-components'
import reserveIcon from '../../assets/reserveIcon.svg'
import collectIcon from '../../assets/collectIcon.svg'
import rightArrowIcon from '../../assets/rightArrowIcon.svg'
import { useHistory } from 'react-router-dom'
import tickIcon from '../../assets/tickIcon.svg'
import { WashingMachine, WMStatus } from '../../store/laundry/types'
import { fetchTelegram, SetSelectedMachine, updateMachine, SetBlockLevelSelections } from '../../store/laundry/action'
import { PATHS } from '../../routes/Routes'
import { useDispatch, useSelector } from 'react-redux'
import wm_inuse from '../../assets/washing-machines/wm_inuse.gif'
import wm_available from '../../assets/washing-machines/wm_available.svg'
import wm_reserved from '../../assets/washing-machines/wm_reserved.svg'
import wm_uncollected from '../../assets/washing-machines/wm_uncollected.svg'
import { RootState } from '../../store/types'

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
  width: 30%;
  max-width: 135px;
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
  const dispatch = useDispatch()
  const { selectedLevel, selectedBlock, telegramHandle } = useSelector((state: RootState) => state.laundry)

  useEffect(() => {
    dispatch(fetchTelegram(props.washingMachine))
  }, [dispatch])

  let label = ''
  let iconSrc = ''
  let washingMachineIcon = ''
  let rightAction

  const cardPrimaryColor =
    props.washingMachine.job === WMStatus.UNCOLLECTED || props.washingMachine.job === WMStatus.COMPLETED
      ? '#EB5757'
      : '#002642'

  const goToTelegramHandle = (selectedMachine: WashingMachine) => {
    dispatch(fetchTelegram(selectedMachine))
    const site = 'https://telegram.me/' + telegramHandle
    window.open(site)
  }

  const calculateRemainingTime = (startUNIX: number, duration: number) => {
    const endDateTime = new Date((startUNIX + duration) * 1000)
    const timeNowDateTime = new Date()

    const durationLeftInMiliSeconds: number = Math.abs(timeNowDateTime.getTime() - endDateTime.getTime())

    if (durationLeftInMiliSeconds < 0) {
      dispatch(updateMachine(WMStatus.AVAIL, props.washingMachine?.machineID as string))
      dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
      return ''
    } else {
      const timeDiffInSeconds = durationLeftInMiliSeconds / 1000
      const minutesLeft: string = Math.floor(timeDiffInSeconds / 60).toFixed(0)
      return `${minutesLeft} mins left`
    }
  }

  switch (props.washingMachine.job) {
    case WMStatus.AVAIL:
      label = 'Reserve'
      iconSrc = reserveIcon
      washingMachineIcon = wm_available
      rightAction = () => {
        dispatch(updateMachine(WMStatus.RESERVED, props.washingMachine.machineID))
        dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
      }
      break
    case WMStatus.COMPLETED:
      label = 'Collect'
      iconSrc = collectIcon
      washingMachineIcon = wm_uncollected
      rightAction = () => {
        dispatch(SetSelectedMachine(props.washingMachine))
        history.push(PATHS.VIEW_WASHING_MACHINE)
      }
      break
    case WMStatus.RESERVED:
      label = calculateRemainingTime(props.washingMachine.startTime, props.washingMachine.duration)
      iconSrc = tickIcon
      washingMachineIcon = wm_reserved
      rightAction = () => {
        dispatch(SetSelectedMachine(props.washingMachine))
        history.push(PATHS.VIEW_WASHING_MACHINE)
      }
      break
    case WMStatus.UNCOLLECTED:
      label = 'Notify'
      iconSrc = props.washingMachine.userImage
        ? props.washingMachine.userImage
        : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' //initials here
      washingMachineIcon = wm_uncollected
      rightAction = () => {
        goToTelegramHandle(props.washingMachine)
      }
      break
    case WMStatus.INUSE:
      label = calculateRemainingTime(props.washingMachine.startTime, props.washingMachine.duration)
      washingMachineIcon = wm_inuse
      iconSrc = props.washingMachine.userImage
        ? props.washingMachine.userImage
        : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
      rightAction = () => {
        dispatch(SetSelectedMachine(props.washingMachine))
        history.push(PATHS.VIEW_WASHING_MACHINE)
      }
      break
    case WMStatus.ALERTED:
      label = 'Notified!'
      iconSrc = tickIcon
      washingMachineIcon = wm_uncollected
      break
    default:
      label = 'In Use'
  }

  return (
    <CardContainer>
      <WashingMachineAvatar
        src={washingMachineIcon}
        onClick={() => {
          dispatch(SetSelectedMachine(props.washingMachine))
          if (props.washingMachine.job != WMStatus.AVAIL)
            history.push(PATHS.VIEW_MACHINE + '/' + props.washingMachine.machineID)
        }}
      />
      <Labels
        onClick={() => {
          dispatch(SetSelectedMachine(props.washingMachine))
          if (props.washingMachine.job != WMStatus.AVAIL)
            history.push(PATHS.VIEW_MACHINE + '/' + props.washingMachine.machineID)
        }}
      >
        <Header style={{ color: cardPrimaryColor }}>{props.washingMachine.job}</Header>
        <SubHeader style={{ color: cardPrimaryColor }}>
          S/N{props.washingMachine.machineID} ({props.washingMachine.capacity} kg)
        </SubHeader>
      </Labels>
      <RightActionGroups onClick={rightAction}>
        <ActionButton
          src={iconSrc}
          style={
            props.washingMachine.job === WMStatus.INUSE || props.washingMachine.job === WMStatus.UNCOLLECTED
              ? { height: '70px', width: '70px', borderRadius: '40px' }
              : { color: cardPrimaryColor }
          }
        />
        {(props.washingMachine.job === WMStatus.RESERVED || props.washingMachine.job === WMStatus.INUSE) && (
          <ActionButton style={{ fill: cardPrimaryColor }} src={rightArrowIcon} />
        )}
        <ActionButtonLabel style={{ color: cardPrimaryColor + '!important' }}>{label}</ActionButtonLabel>
      </RightActionGroups>
    </CardContainer>
  )
}
