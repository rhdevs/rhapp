import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'

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
`

interface PersonalInfo {
  name: string
  telegram: string
  block: string
  bio: string
}

const personalInfo: PersonalInfo = {
  name: 'Zhou Maomao',
  telegram: 'Telegram: @zhoumm',
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
    <>
      <NameParagraph>{personalInfo.name}</NameParagraph>
      <TelegramParagraph>{personalInfo.telegram}</TelegramParagraph>
      <BlockParagraph>{personalInfo.block}</BlockParagraph>
      <BioParagraph>{personalInfo.bio}</BioParagraph>
    </>
  )
}

export default PersonalInfoMainContainer
