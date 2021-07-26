import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Alert } from 'antd'

import 'antd/dist/antd.css'
import { Facility } from '../../store/facilityBooking/types'
import { SetBlockOutIsOpen } from '../../store/facilityBooking/action'
import { useDispatch } from 'react-redux'
import { DOMAIN_URL, ENDPOINTS } from '../../store/endpoints'

const AlertGroup = styled.div`
  padding: 3px 23px 3px 23px;
`

const LoadingText = styled.div`
  font-size: 40px;
  text-align: center;
  color: red;
`

const OverlayContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
  display: block;
`

const MainContainer = styled.div`
  position: fixed;
  top: 10%;
  background-color: #fff;
  width: 90vw;
  height: min-content;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px;
  box-shadow: 0px 2px 5px 1px #888888;
  z-index: 3;
`

const TitleTextContainer = styled.div`
  justify-content: center;
  display: flex;
  margin-button: 10px;
`

const TitleText = styled.text`
  font-family: Inter;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 50px;
`
const VenueSelectionContainer = styled.div`
  margin-right: 20px;
  display: flex;
  justify-content: space-around;
  max-height 90px; 
  margin-bottom: 10px;
`

const VenueSelection = styled.div`
  border: 0.1px ridge rgb(0, 0, 0);
  display: flex;
  flex-direction: column;
  width: 60%;
  max-height 90px; 
  overflow: scroll;
  padding: 12px;
  padding-top: 5px; 
  border-radius: 10px;
`

const VenueOptions = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Venueinput = styled.input`
  display: flex;
  justify-content: space-around;
  filter: invert(4%) sepia(0%) saturate(0%) hue-rotate(153deg) brightness(95%) contrast(88%);
`

const TimeSelectionContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 10px;
`

const TimeSelectionToFrom = styled.text`
  margin-left: 20px;
  width: 20%;
  self-align: left;
`

const TimeSelectionInput = styled.input`
  width: 80%;
  self-align: right;
`

function JCRCBlockOutModal({
  title,
  hasLeftButton,
  leftButtonText,
  leftButtonTextColor,
  leftButtonColor,
  rightButtonText,
  rightButtonTextColor,
  rightButtonColor,
  onOverlayClick,
  top,
  bottom,
  right,
  left,
  facilities,
}: {
  title: string
  hasLeftButton?: boolean
  leftButtonText: string
  leftButtonTextColor?: string
  leftButtonColor?: string
  rightButtonText: string
  rightButtonTextColor?: string
  rightButtonColor?: string
  onOverlayClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  top?: number
  bottom?: number
  right?: number
  left?: number
  facilities: Facility[]
}) {
  const defaultLeftButtonColor = leftButtonColor ?? '#DE5F4C'
  const defaultLeftButtonTextColor = leftButtonTextColor ?? '#FFFFFF'
  const defaultRightButtonColor = rightButtonColor ?? '#FAFAF4'
  const defaultRightButtonTextColor = rightButtonTextColor ?? '#000000'
  const [facilityList, setFacilityList] = useState<Facility[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [startDateTime, setStartDateTime] = useState(new Date())
  const [endDateTime, setEndDateTime] = useState(new Date())
  const [blockoutSuccess, setBlockoutSuccess] = useState(false)
  const [blockoutFailure, setBlockoutFailure] = useState(false)
  const [blockoutLoading, setBlockoutLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const dispatch = useDispatch()

  const AlertSection = (
    <AlertGroup>
      {blockoutSuccess && !blockoutFailure && <Alert message={alertMsg} type="success" showIcon />}
      {blockoutFailure && !blockoutSuccess && <Alert message={alertMsg} type="error" showIcon />}
      {blockoutLoading && <LoadingText>Loading...</LoadingText>}
    </AlertGroup>
  )

  const handleSelectOne = async (facilityID: number) => {
    if (selectedFacilities.includes(facilityID)) {
      setSelectedFacilities(selectedFacilities.filter((id) => id !== facilityID))
      setSelectAll(false)
    } else {
      setSelectedFacilities(selectedFacilities.concat(facilityID))
    }
  }

  const handleSelectAll = async () => {
    if (selectAll) {
      setSelectedFacilities([])
      setSelectAll(false)
    } else {
      setSelectedFacilities(facilityList.map((facility) => facility.facilityID))
      setSelectAll(true)
    }
  }

  const handleStartDateChange = (newStartDate: string) => {
    setStartDateTime(new Date(newStartDate))
  }

  const handleEndDateChange = (newEndDate: string) => {
    setEndDateTime(new Date(newEndDate))
  }

  const submitBlockOut = async () => {
    const requestBody = {
      startTime: parseInt((startDateTime.getTime() / 1000).toFixed(0)),
      endTime: parseInt((endDateTime.getTime() / 1000).toFixed(0)),
      facilities: selectedFacilities,
    }
    if (selectedFacilities === []) {
      setBlockoutFailure(true)
      setBlockoutSuccess(false)
      setAlertMsg('You have not chosen any facilities.')
    } else if (new Date().getTime() > startDateTime.getTime()) {
      setBlockoutFailure(true)
      setBlockoutSuccess(false)
      setAlertMsg('You cannot create a booking on a date that is in the past.')
    } else if (startDateTime.getTime() > endDateTime.getTime()) {
      setBlockoutFailure(true)
      setBlockoutSuccess(false)
      setAlertMsg('Start time is later than end time.')
    } else {
      setBlockoutLoading(true)
      setBlockoutFailure(false)
      setBlockoutSuccess(false)
      const response = await fetch(
        DOMAIN_URL.FACILITY +
          ENDPOINTS.JCRC_BLOCKOUT +
          '?token=' +
          localStorage.getItem('token') +
          '&userID=' +
          localStorage.getItem('userID'),
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      )

      setBlockoutLoading(false)
      if (response.status >= 400) {
        const body = await response.json()
        setBlockoutFailure(true)
        setBlockoutSuccess(false)
        setAlertMsg('Something went wrong, please try again.')
      } else {
        setBlockoutSuccess(true)
        setBlockoutFailure(false)
        setAlertMsg('Successful')
      }
    }
  }

  const onCancelClick = () => {
    dispatch(SetBlockOutIsOpen(false))
  }

  useEffect(() => {
    setFacilityList(facilities)
  }, [])

  return (
    <>
      <OverlayContainer onClick={onOverlayClick} />
      <MainContainer style={{ bottom: bottom ?? '50%', right: right ?? 0, left: left ?? 0, top: top }}>
        {AlertSection}
        <TitleTextContainer>
          <TitleText>{title}</TitleText>
        </TitleTextContainer>
        <VenueSelectionContainer>
          <h3>Venue</h3>
          <VenueSelection>
            <VenueOptions>
              Select all
              <Venueinput id="0" type="checkbox" onClick={() => handleSelectAll()} checked={selectAll}></Venueinput>
            </VenueOptions>
            {facilityList.map((facility) => {
              if (facility.facilityLocation)
                return (
                  <VenueOptions>
                    {facility.facilityName}
                    <Venueinput
                      id={String(facility.facilityID)}
                      type="checkbox"
                      checked={selectedFacilities.includes(facility.facilityID)}
                      onClick={() => handleSelectOne(facility.facilityID)}
                    ></Venueinput>
                  </VenueOptions>
                )
            })}
          </VenueSelection>
        </VenueSelectionContainer>
        <TimeSelectionContainer>
          <TimeSelectionToFrom>
            <h3>From</h3>
          </TimeSelectionToFrom>
          <TimeSelectionInput
            id="startTime"
            type="datetime-local"
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </TimeSelectionContainer>
        <TimeSelectionContainer>
          <TimeSelectionToFrom>
            <h3>To</h3>
          </TimeSelectionToFrom>
          <TimeSelectionInput
            id="endTime"
            type="datetime-local"
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </TimeSelectionContainer>
        <ButtonContainer>
          {hasLeftButton && (
            <Button
              style={{
                background: defaultLeftButtonColor,
                color: defaultLeftButtonTextColor,
                borderRadius: '5px',
                border: defaultLeftButtonColor,
                width: '80px',
              }}
              onClick={submitBlockOut}
            >
              {leftButtonText}
            </Button>
          )}
          <Button
            style={{
              background: defaultRightButtonColor,
              color: defaultRightButtonTextColor,
              borderRadius: '5px',
              marginLeft: '10px',
              width: '80px',
            }}
            onClick={onCancelClick}
          >
            {rightButtonText}
          </Button>
        </ButtonContainer>
      </MainContainer>
    </>
  )
}

export default JCRCBlockOutModal
