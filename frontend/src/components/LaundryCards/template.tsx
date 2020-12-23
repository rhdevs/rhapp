import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '../../store/types'
import styled from 'styled-components'
// import TopNavBar from '../../components/Mobile/TopNavBar'
// import { useDispatch } from 'react-redux'
import washing from '../../assets/washingMachineIcon.svg'
// import { Button } from 'antd'

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

const FacilityAvatar = styled.img`
  padding: 20px;
`
//const FacilityButton = styled.img`
//  right: 10%;
//`

const Notify = styled.img`
  position: relative;
  right: -35%;
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
  display: flex;
`

const FacilityAvatarContainer = styled.div`
  align-self: center;
`
const FacilityLabelsContainer = styled.div`
  align-self: center;
`

const FacilityBooking = ({ title, subtitle, colour }: { title: string; subtitle: string; colour: string }) => {
  return (
    <>
      <MainContainer>
        <FacilityCard>
          <FacilityLabels>
            <FacilityAvatarContainer>
              <FacilityAvatar src={washing} />
            </FacilityAvatarContainer>
            <FacilityLabelsContainer>
              <FacilityHeader style={{ color: colour }}>{title}</FacilityHeader>
              <FacilitySubHeader style={{ color: colour }}>{subtitle}</FacilitySubHeader>
            </FacilityLabelsContainer>
          </FacilityLabels>
          <Notify src={washing} />
        </FacilityCard>
      </MainContainer>
    </>
  )
}

export { FacilityBooking }
