import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'antd'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { handleEditProfileDetails, handleNewProfilePicture, setHasChanged } from '../../../store/profile/action'

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
  height: 150px;
  width: 20vw;
  // padding-right: 15vw;
  vertical-align: middle;
`

const PersonalInfoSpan = styled.span`
  display: inline-block;
  height: 150px;
  width: 45vw;
  vertical-align: middle;
  padding-left: 5vw;
`

const LongButton = {
  size: 'large',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  width: '80vw',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
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

const EditPersonalInfoContainer = () => {
  const { newDisplayName, newTelegramHandle, newBio, user, userProfilePictureBase64 } = useSelector(
    (state: RootState) => state.profile,
  )
  const dispatch = useDispatch()
  const oldBio = newBio

  useEffect(() => {
    if (newBio !== oldBio) {
      dispatch(setHasChanged(true))
    }
    dispatch(handleNewProfilePicture(user.profilePictureUrl))
  }, [dispatch])

  const onFinish = (values: { user: { bio: string; displayName: string; telegramHandle: string } }) => {
    // ACTION: "SENDS A POST REQUEST"
    dispatch(handleEditProfileDetails(values.user.bio, values.user.displayName, values.user.telegramHandle))
  }

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    // console.log('file to upload: ' + event.target.files[0])
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = handleReaderLoad
      reader.readAsBinaryString(file)
    }
  }

  const handleReaderLoad = (readerEvt) => {
    const binaryString = readerEvt.target.result
    // console.log('binary string: ' + btoa(binaryString))
    dispatch(handleNewProfilePicture(btoa(binaryString)))
    dispatch(setHasChanged(true))
  }

  const EditProfileImage = () => {
    return (
      <>
        <div className="image-upload">
          <label htmlFor="file-input">
            <img
              src={'data:image/png;base64,' + userProfilePictureBase64}
              style={{ height: 75, width: 75, objectFit: 'cover', borderRadius: 100 / 2 }}
            />
          </label>

          <input id="file-input" type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
        </div>
      </>
    )
  }

  return (
    <MainContainer>
      <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
        <AvatarSpan>
          <EditProfileImage />
        </AvatarSpan>
        <PersonalInfoSpan>
          <Form.Item name={['user', 'displayName']} style={{ width: '55vw' }}>
            <Input
              defaultValue={newDisplayName}
              placeholder={newDisplayName}
              onChange={() => dispatch(setHasChanged(true))}
            />
          </Form.Item>
          <Form.Item name={['user', 'telegramHandle']} style={{ width: '55vw' }}>
            <Input
              defaultValue={'@' + newTelegramHandle}
              placeholder={'@' + newTelegramHandle}
              onChange={() => dispatch(setHasChanged(true))}
            />
          </Form.Item>
          <BlockParagraph>Block {user.block}</BlockParagraph>
        </PersonalInfoSpan>
        <Form.Item name={['user', 'bio']} style={{ width: '80vw' }}>
          <Input.TextArea defaultValue={newBio} placeholder={newBio} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={LongButton}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </MainContainer>
  )
}

export default EditPersonalInfoContainer
