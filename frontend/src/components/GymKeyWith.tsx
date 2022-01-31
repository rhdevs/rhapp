import React from 'react'
import styled from 'styled-components'
import Avatar from '../assets/Avatar_4x.png'

const Header = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 20px;

  text-align: center;

  color: #000000;

  padding-bottom: 30px;
`

const InfoArea = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;

  color: #191919;
`

const Container = styled.div`
  padding-top: 20px;
`

interface Props {
  name?: string
  handle?: string
  avatar?: string
}

function GymKeyWith(props: Props) {
  return (
    <>
      <Header>Key With</Header>
      <img src={props.avatar ?? Avatar} alt="Dummy Avatar" width="25%" />
      <Container>
        <InfoArea> {props.name ?? 'Andy'} </InfoArea>
        <InfoArea> {props.handle ?? '@andy333'} </InfoArea>
      </Container>
    </>
  )
}

export default GymKeyWith
