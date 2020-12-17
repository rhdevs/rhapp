import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import ProfilePicture from '../../../assets/profilePicture.png'

const MainContainer = styled.div`
  margin-left: 10vw;
  width: 80vw;
`

const NameParagraph = styled.p`
  font-size: 24px;
  font-weight: bold;
`
const TelegramParagraph = styled.p`
  font-size: 15px;
  font-weight: 500;
`
const BlockParagraph = styled.p`
  font-size: 15px;
  font-weight: 300;
`
const BioParagraph = styled.p`
  font-size: 15px;
  margin-top: -5vh;
`

const AvatarSpan = styled.span`
  display: inline-block;
  height: 30vh;
  width: 30vw;
  vertical-align: middle;
`

const PersonalInfoSpan = styled.span`
  display: inline-block;
  height: 30vh;
  width: 50vw;
  vertical-align: middle;
  padding-left: 3vw;
`

interface PersonalInfo {
  name: string
  telegram: string
  block: string
  bio: string
}

const personalInfo: PersonalInfo = {
  name: 'Zhou Maomao',
  telegram: '@zhoumm',
  block: 'Block 8',
  bio: 'This is my bio I’m very cool please be my friend hurhur',
}

const PersonalInfoMainContainer = () => {
  return (
    <PersonalInfoSecondaryContainer
      name={personalInfo.name}
      telegram={personalInfo.telegram}
      block={personalInfo.block}
      bio={personalInfo.bio}
    ></PersonalInfoSecondaryContainer>
  )
}

const PersonalInfoSecondaryContainer: React.FC<PersonalInfo> = (personalInfo: PersonalInfo) => {
  return (
    <MainContainer>
      <AvatarSpan>
        <img alt="logo" style={{ width: 100 }} src={String(ProfilePicture)} />
      </AvatarSpan>
      <PersonalInfoSpan>
        <NameParagraph>{personalInfo.name}</NameParagraph>
        <TelegramParagraph>{personalInfo.telegram}</TelegramParagraph>
        <BlockParagraph>{personalInfo.block}</BlockParagraph>
        <p>Friends List</p>
      </PersonalInfoSpan>
      <BioParagraph>{personalInfo.bio}</BioParagraph>
    </MainContainer>
  )
}

export default PersonalInfoMainContainer
