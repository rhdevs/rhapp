import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '../../store/types'
import styled from 'styled-components'
import laundry from '../../assets/laundryicon.svg'
import bell from '../../assets/bell.svg'
import collect from '../../assets/collect.svg'
import reserve from '../../assets/reserve.svg'
import tickblack from '../../assets/tickblack.svg'
import tickred from '../../assets/tickred.svg'
import { Timer } from './timer'
import { available, using, uncollected, completed, reserved } from '../laundrypage/status'
import { addMinutes } from 'date-fns'

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
`
const FacilityDiv = styled.div`
  display: flex;
  width: 200px;
`

const FacilityAvatar = styled.img`
  padding: 20px;
`

const FacilityButton = styled.img`
  position: relative;
  top: 10%;
  right: 0%;
`

const FacilityHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
`

const FacilitySubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
`

const FacilityLabels = styled.div`
  align-self: center;
`

const FacilityBooking = ({
  status,
  serial,
  colour,
  action,
  caption,
  timer,
}: {
  status: string
  serial: string
  colour: string
  action: string
  caption: string
  timer: boolean
}) => {
  const [card, setCard] = useState({
    status: status,
    colour: colour,
    action: action,
    caption: caption,
  })

  function buttonPress(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.preventDefault()
    if (card.status === available) {
      setCard({
        ...card,
        status: reserved,
        action: tickblack,
        caption: 'remaining',
      })
    } else if (card.status === uncollected) {
      setCard({
        ...card,
        action: tickred,
        caption: 'Notified!',
      })
    } else if (card.status === completed) {
      setAvailable()
    }
  }

  function setAvailable() {
    //dispatch
    setCard({
      ...card,
      status: available,
      colour: 'black',
      action: reserve,
      caption: 'Reserve',
    })
  }

  return (
    <>
      <MainContainer>
        <FacilityCard>
          <FacilityDiv>
            <FacilityAvatar src={laundry} />
            <FacilityLabels>
              <FacilityHeader style={{ color: card.colour }}>{card.status}</FacilityHeader>
              <FacilitySubHeader style={{ color: card.colour }}>{serial}</FacilitySubHeader>
            </FacilityLabels>
          </FacilityDiv>
          <FacilityButton src={card.action} onClick={(e) => buttonPress(e)} />
          <FacilitySubHeader style={{ color: card.colour }}>
            {(card.status === using || card.status === reserved) && (
              <Timer
                destination={addMinutes(new Date(), 1)}
                activate={() => {
                  setAvailable()
                }}
              />
            )}
            {card.caption}
          </FacilitySubHeader>
        </FacilityCard>
      </MainContainer>
    </>
  )
}

//year, month, day, hour, minutes, seconds
export { FacilityBooking }
