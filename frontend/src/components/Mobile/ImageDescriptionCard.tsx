import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import profilePicture from '../../assets/profilePicture.png'

const CardContainer = styled.div`
  width: 85vw;
  min-height: 3vh;
  margin: 0 auto 10px;
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  transition-duration: 0.25s;
`

const ContentContainer = styled.div`
  display: flex;
`

const TitleText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 16px;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ExpandTitle = styled.text`
  color: black;
  font-family: Inter;
  font-size: 16px;
  line-height: 22px;
`

const DateTimeText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
`

const ExpandDateTimeText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 14px;
  text-transform: uppercase;
`

const DescriptionText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ExpandDescriptionText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 14px;
`

const TextContainer = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  width: 68vw;
`

const BottomElementContainer = styled.div`
  margin: 0 auto;
  z-index: 10;
  padding-top: 10px;
`

const ImageContainer = styled.div`
  width: 43px;
  height: 43px;
`

type Props = {
  avatar?: string
  title: string
  dateTime?: string
  description: string
  bottomElement?: ReactElement
}

function ImageDescriptionCard(props: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const expandCard = () => {
    setIsExpanded(!isExpanded)
    console.log(isExpanded)
  }

  return (
    <CardContainer onClick={expandCard}>
      <ContentContainer>
        <ImageContainer>
          <img
            src={props.avatar ?? profilePicture}
            alt="logo"
            style={{ width: '43px', height: '43px', objectFit: 'scale-down' }}
          />
        </ImageContainer>
        <TextContainer>
          {!isExpanded ? (
            <>
              <TitleText>{props.title}</TitleText>
              <DateTimeText>{props.dateTime}</DateTimeText>
              <DescriptionText>{props.description}</DescriptionText>
            </>
          ) : (
            <>
              <ExpandTitle>{props.title}</ExpandTitle>
              <ExpandDateTimeText>{props.dateTime}</ExpandDateTimeText>
              <ExpandDescriptionText>{props.description}</ExpandDescriptionText>
            </>
          )}
        </TextContainer>
      </ContentContainer>
      <BottomElementContainer>{isExpanded && props.bottomElement}</BottomElementContainer>
    </CardContainer>
  )
}

export default ImageDescriptionCard
