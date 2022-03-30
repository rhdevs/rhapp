import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Ellipse = styled.div<{ isOpen: boolean }>`
  background: ${(props) => (props.isOpen ? `rgba(88, 185, 148, 1)` : `rgba(243, 117, 98, 1)`)};
  height: 16px;
  width: 16px;
  border-radius: 50%;
`

const Status = styled.div<{ isOpen: boolean }>`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 26px;
  padding-left: 8px;

  background: ${(props) =>
    props.isOpen ? `linear-gradient(90.67deg, #58b994 30.89%, #72ba75 68.41%)` : `rgba(243, 117, 98, 1)`};
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

interface Props {
  isOpen: boolean | null
}

function GymStatus(props: Props) {
  if (props.isOpen == null) {
    return <></>
  }
  return (
    <Container>
      <Ellipse isOpen={props.isOpen} />
      <Status isOpen={props.isOpen}>{props.isOpen ? 'Gym is Open' : 'Gym is Closed'}</Status>
    </Container>
  )
}

export default GymStatus
