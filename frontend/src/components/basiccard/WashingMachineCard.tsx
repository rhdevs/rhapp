import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '../../store/types'
import styled from 'styled-components'
import laundry from '../../assets/laundryicon.svg'
import reserve from '../../assets/reserve.svg'
import tickblack from '../../assets/tickblack.svg'
import tickred from '../../assets/tickred.svg'
import { Timer } from './timer'
import { WashingMachineStatus } from '../laundrypage/status'
import { addMinutes } from 'date-fns'

import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'

//styling
const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`
const FacilityCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  max-width: 337px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  position: relative;
`

const FacilityAvatar = styled.img`
  padding: 20px;
`

const FacilityHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
  display: flex;
`

const FacilityLabels = styled.div`
  align-self: center;
`
const Actions = styled.div`
  position: absolute;
  right: 0px;
  top: 60%;
  transform: translate(-25%, -50%);
`

const FacilityButton = styled.img`
  position: relative;
  left: 15%;
`

const FacilitySubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
  display: flex;
  margin-top: 10px;
  margin-right: 10px;
`
const WashingMachineCard = ({
  status,
  serial,
  colour,
  action,
  caption,
}: {
  status: string
  serial: string
  colour: string
  action: string
  caption: string
}) => {
  const [card, setCard] = useState({
    status: status,
    colour: colour,
    action: action,
    caption: caption,
  })

  const history = useHistory()
  function buttonPress(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.preventDefault()
    if (card.status === WashingMachineStatus.available) {
      setCard({
        ...card,
        status: WashingMachineStatus.reserved,
        action: tickblack,
        caption: 'remaining',
      })
    } else if (card.status === WashingMachineStatus.uncollected) {
      setCard({
        ...card,
        action: tickred,
        caption: 'Notified!',
      })
    } else if (card.status === WashingMachineStatus.completed) {
      setAvailable()
    } else if (card.status === WashingMachineStatus.reserved) {
      history.push(PATHS.LAUNDRY_PAGE)
    }
  }

  function setAvailable() {
    //dispatch
    setCard({
      ...card,
      status: WashingMachineStatus.available,
      colour: 'black',
      action: reserve,
      caption: 'Reserve',
    })
  }

  return (
    <>
      <MainContainer>
        <FacilityCard>
          <FacilityAvatar src={laundry} />
          <FacilityLabels>
            <FacilityHeader style={{ color: card.colour }}>
              {card.status}
              {card.status === WashingMachineStatus.uncollected && (
                <Timer
                  destination={new Date()}
                  caption={false}
                  onlyMinutes={true}
                  activate={() => {
                    console.log('hello')
                  }}
                  elapsed={true}
                />
              )}
            </FacilityHeader>
            <FacilitySubHeader style={{ color: card.colour }}>{serial}</FacilitySubHeader>
          </FacilityLabels>
          <Actions>
            <FacilityButton src={card.action} onClick={(e) => buttonPress(e)} />
            <FacilitySubHeader style={{ color: card.colour }}>
              {(card.status === WashingMachineStatus.using || card.status === WashingMachineStatus.reserved) && (
                <Timer
                  destination={addMinutes(new Date(), 1)}
                  activate={() => {
                    setAvailable()
                  }}
                  caption={false}
                  onlyMinutes={false}
                  elapsed={false}
                />
              )}{' '}
              &nbsp;
              {card.caption}
            </FacilitySubHeader>
          </Actions>
        </FacilityCard>
      </MainContainer>
    </>
  )
}

//year, month, day, hour, minutes, seconds
export { WashingMachineCard }
