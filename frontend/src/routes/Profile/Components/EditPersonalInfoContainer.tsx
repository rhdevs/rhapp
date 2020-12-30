import React from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'antd'
import 'antd/dist/antd.css'
import ProfilePicture from '../../../assets/profilePicture.png'

const MainContainer = styled.div`
  padding-left: 10vw;
  width: 75vw;
`

const BlockParagraph = styled.p`
  font-size: 15px;
  font-weight: 300;
`

const AvatarSpan = styled.span`
  display: inline-block;
  height: 27vh;
  width: 10vw;
  vertical-align: middle;
`

const PersonalInfoSpan = styled.span`
  display: inline-block;
  height: 27vh;
  width: 50vw;
  vertical-align: middle;
  padding-left: 15vw;
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

const LongButton = {
  size: 'large',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  width: '80vw',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
}

const EditPersonalInfoMainContainer = () => {
  return (
    <EditPersonalInfoSecondaryContainer
      name={personalInfo.name}
      telegram={personalInfo.telegram}
      block={personalInfo.block}
      bio={personalInfo.bio}
    ></EditPersonalInfoSecondaryContainer>
  )
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}

const EditPersonalInfoSecondaryContainer: React.FC<PersonalInfo> = (personalInfo: PersonalInfo) => {
  const Demo = () => {
    const onFinish = (values: string) => {
      console.log(values)
    }

    return (
      <>
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <AvatarSpan>
            <img alt="logo" style={{ width: 80 }} src={String(ProfilePicture)} />
          </AvatarSpan>
          <PersonalInfoSpan>
            <Form.Item name={['user', 'name']} style={{ width: '55vw' }}>
              <Input placeholder={personalInfo.name} />
            </Form.Item>
            <Form.Item name={['user', 'email']} style={{ width: '55vw' }}>
              <Input placeholder={personalInfo.telegram} />
            </Form.Item>
            <BlockParagraph>{personalInfo.block}</BlockParagraph>
          </PersonalInfoSpan>
          <Form.Item name={['user', 'introduction']} style={{ width: '80vw' }}>
            <Input.TextArea placeholder={personalInfo.bio} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={LongButton}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }

  return (
    <MainContainer>
      <Demo />
    </MainContainer>
  )
}

export default EditPersonalInfoMainContainer
