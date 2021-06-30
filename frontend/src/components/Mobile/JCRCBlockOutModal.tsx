import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

import 'antd/dist/antd.css'

const OverlayContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
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
  z-index: 1000;
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
  // border: 0.1px ridge rgb(0, 0, 0);
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
  // border: 0.1px ridge rgb(0, 0, 0);
  align-items: center;
`

const Venueinput = styled.input`
  display: flex;
  justify-content: space-around;
`

const TimeSelectionContainer = styled.div`
  // border: 0.1px ridge rgb(0, 0, 0);
  width: 100%;
  display: flex;
  margin-bottom: 10px;
`

const TimeSelectionToFrom = styled.text`
  margin-left: 20px;
  width: 20%;
  // border: 0.1px ridge rgb(0, 0, 0);
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
  onLeftButtonClick,
  rightButtonText,
  rightButtonTextColor,
  rightButtonColor,
  onRightButtonClick,
  onOverlayClick,
  top,
  bottom,
  right,
  left,
}: {
  title: string
  hasLeftButton?: boolean
  leftButtonText: string
  leftButtonTextColor?: string
  leftButtonColor?: string
  onLeftButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  rightButtonText: string
  rightButtonTextColor?: string
  rightButtonColor?: string
  onRightButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onOverlayClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  top?: number
  bottom?: number
  right?: number
  left?: number
}) {
  const defaultLeftButtonColor = leftButtonColor ?? '#DE5F4C'
  const defaultLeftButtonTextColor = leftButtonTextColor ?? '#FFFFFF'
  const defaultRightButtonColor = rightButtonColor ?? '#FAFAF4'
  const defaultRightButtonTextColor = rightButtonTextColor ?? '#000000'

  return (
    <>
      <OverlayContainer onClick={onOverlayClick} />
      <MainContainer style={{ bottom: bottom ?? '50%', right: right ?? 0, left: left ?? 0, top: top }}>
        <TitleTextContainer>
          <TitleText>{title}</TitleText>
        </TitleTextContainer>
        <VenueSelectionContainer>
          <h3>Venue</h3>
          <VenueSelection>
            <VenueOptions>
              Select all
              <Venueinput type="checkbox"></Venueinput>
            </VenueOptions>

            <VenueOptions>
              Band Room
              <input type="checkbox"></input>
            </VenueOptions>

            <VenueOptions>
              Conference Room
              <input type="checkbox"></input>
            </VenueOptions>

            <VenueOptions>
              Lounge
              <input type="checkbox"></input>
            </VenueOptions>

            <VenueOptions>
              Hardcourt
              <input type="checkbox"></input>
            </VenueOptions>

            <VenueOptions>
              Main Area
              <input type="checkbox"></input>
            </VenueOptions>
          </VenueSelection>
        </VenueSelectionContainer>
        <TimeSelectionContainer>
          <TimeSelectionToFrom>
            <h3>From</h3>
          </TimeSelectionToFrom>
          <TimeSelectionInput type="datetime-local" value="2018-06-12T19:30" />
        </TimeSelectionContainer>
        <TimeSelectionContainer>
          <TimeSelectionToFrom>
            <h3>To</h3>
          </TimeSelectionToFrom>
          <TimeSelectionInput type="datetime-local" value="2018-06-12T19:30" />
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
              onClick={onLeftButtonClick}
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
            onClick={onRightButtonClick}
          >
            {rightButtonText}
          </Button>
        </ButtonContainer>
      </MainContainer>
    </>
  )
}

export default JCRCBlockOutModal
