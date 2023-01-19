import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import io from 'socket.io-client'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { CrowdLevel } from '../../components/Crowd/CrowdLevel'
import CommHallIcon from '../../assets/facilitiesLogos/MainAreaCommHall.svg'

const socket = io('https://crowd.api.rhapp.lol')

const CrowdIcon = styled.img`
  width: 60px;
  height: 60px;
`

const CrowdMainContainer = styled.div`
  background-color: #fff;
  height: 100vh;
  margin: 23px;
`

export default function Crowd() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [crowdLevelCH, setCrowdLevelCH] = useState(null)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('crowd-level:ch', (data) => {
      setCrowdLevelCH(data.level)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('crowd-level:ch')
    }
  }, [])

  return (
    <>
      <CrowdMainContainer>
        <h1>Crowd Levels</h1>
        <CrowdLevel name="Comm Hall" level={crowdLevelCH} icon={<CrowdIcon src={CommHallIcon} />} />
      </CrowdMainContainer>
      <BottomNavBar />
    </>
  )
}
