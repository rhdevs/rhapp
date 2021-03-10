import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { FileImageFilled } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { Button, Switch } from 'antd'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useParams } from 'react-router-dom'
import { Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import {
  AddImage,
  DeleteImage,
  EditPostDetail,
  GetPostDetailsToEdit,
  handleEditPost,
  handleCreatePost,
  PopWarning,
  ResetPostDetails,
  SetPostId,
} from '../../../store/social/action'
import { fetchUserCCAs } from '../../../store/profile/action'
import { PostImage } from './Components/postImage'
import { PATHS } from '../../Routes'
import LoadingSpin from '../../../components/LoadingSpin'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import DropDownSelector from '../../../components/Mobile/DropDownSelector'

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #fafaf4;
`
const PostContainer = styled.div`
  width: 328px;
  margin: 0 auto;
`

const Title = styled.input`
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  border: 0px none;
  margin: 8px 15px 5px 15px;
  width: 295px;
  height: 25px;
  color: FFFFFF;
  ::placeholder {
    color: black;
  }
  &:focus {
    outline: none;
  }
`

const Caption = styled.textarea`
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 50px;
  margin: 15px 15px 5px 15px;
  height: 140px;
  width: 297px;
  text-align: left;
  resize: none;
  color: grey;
  border: 0px none;
  ::placeholder {
    color: grey;
    font-weight: 50px;
    font-style: normal;
  }
  &:focus {
    outline: none;
  }
`

const Card = styled.div`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 328px;
  height: 271px;
  background-color: white;
  border-radius: 13px 13px 13px 13px;
  margin: 0px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  height: 15%;
  border-radius: 13px 13px 0px 0px;
  border-bottom: 1.5px solid #e5e5e5;
`
const Content = styled.div`
  height: 60%;
`

const Footer = styled.div`
  height: 30%;
  text-align: center;
`
const InputFile = styled.input`
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  overflow: hidden;
  z-index: -1;
  position: absolute;
  cursor: pointer;
`

const InputLabel = styled.label`
  cursor: pointer;
  background-color: #f5f5f5;
  display: block;
  position: relative;
  width: 115px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #484848;
  left: 106.5px;
`

const Announcement = styled.div`
  display: flex;
  margin: 35px 20px 0px 20px;
  font-family: Inter;
  font-size: 21px;
  font-style: bold;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
  justify-content: space-between;
`
const SwitchContainer = styled.div`
  position: relative;
  .ant-switch {
    background-color: #002642;
  }
  .ant-switch-checked {
    background-color: #de5f4c;
  }
`

const PostButton = styled.div`
  margin-top: 20px;
  text-align: center;
  .ant-btn-primary {
    background-color: #de5f4c;
    border-color: #de5f4c;
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 72;
    height: 33px;
    border-radius: 8px;
    margin-top: 10px;
  }
  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    background-color: #de5f4c;
    border-color: #de5f4c;
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 72;
    height: 33px;
    border-radius: 8px;
    margin-top: 10px;
  }
`

const AlertGroup = styled.div`
  margin-bottom: 23px;
  margin-top: 23px; !important
`

const ImageDiv = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
`
export default function CreateEditPost() {
  const params = useParams<{ postId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const [hasChanges, setHasChanges] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const { newPostTitle, newPostBody, newPostImages, newPostOfficial, warnings, isUploading } = useSelector(
    (state: RootState) => state.social,
  )
  const { ccas } = useSelector((state: RootState) => state.profile)
  const getCcaNames = ccas.map((cca) => cca.ccaName)

  const isCreatePost = !window.location.href.includes('/post/edit')

  useEffect(() => {
    dispatch(fetchUserCCAs(localStorage.getItem('userID')))
    if (window.location.href.includes('/post/edit')) {
      dispatch(SetPostId(params.postId))
      dispatch(GetPostDetailsToEdit())
    } else {
      dispatch(ResetPostDetails())
    }
  }, [dispatch])

  const deleteImage = (source: string) => {
    dispatch(DeleteImage(source))
  }

  return (
    <MainContainer>
      <TopNavBar
        title={isCreatePost ? 'Create Post' : 'Edit Post'}
        onLeftClick={() => {
          hasChanges ? setShowConfirmationModal(true) : history.goBack()
        }}
      />
      {showConfirmationModal && (
        <ConfirmationModal
          title={'Discard Changes?'}
          hasLeftButton={true}
          leftButtonText={'Delete'}
          onLeftButtonClick={() => history.goBack()}
          rightButtonText={'Cancel'}
          onRightButtonClick={() => setShowConfirmationModal(false)}
        />
      )}
      <PostContainer>
        {warnings.length !== 0 &&
          warnings.map((warning, idx) => (
            <AlertGroup key={idx}>
              <Alert
                message="Error :-( "
                description={warning}
                type="error"
                closable
                showIcon
                onClose={() => dispatch(PopWarning())}
              />
            </AlertGroup>
          ))}
        <form>
          <Card>
            <Header>
              <Title
                type="text"
                name="title"
                value={newPostTitle}
                onChange={(e) => {
                  setHasChanges(true)
                  dispatch(EditPostDetail('title', e.target.value))
                }}
                placeholder="Title"
                required
                maxLength={30}
              />
            </Header>
            <Content>
              <Caption
                name="caption"
                value={newPostBody}
                onChange={(e) => {
                  setHasChanges(true)
                  dispatch(EditPostDetail('body', e.target.value))
                }}
                placeholder="Tap to type your caption!"
                required
                maxLength={200}
              />
            </Content>
            {isUploading && <LoadingSpin />}
            {!isUploading && newPostImages.length < 3 && (
              <Footer>
                <InputFile
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => {
                    setHasChanges(true)
                    dispatch(AddImage(e))
                  }}
                />
                <InputLabel htmlFor="file">
                  <FileImageFilled style={{ fontSize: '20px' }} />
                </InputLabel>
              </Footer>
            )}
          </Card>
          {/* TODO: check if user has a role*/}
          {true && (
            <Announcement>
              <p>Official</p>
              <SwitchContainer>
                <Switch
                  checked={newPostOfficial}
                  onChange={() => {
                    setHasChanges(true)
                    dispatch(EditPostDetail('official', 'null'))
                  }}
                />
              </SwitchContainer>
            </Announcement>
          )}
          {newPostOfficial && (
            <Announcement>
              <p>CCA</p>
              <DropDownSelector
                SelectedValue={getCcaNames.length === 0 ? '' : getCcaNames[0].toString()}
                ValueArray={getCcaNames}
                handleChange={(cca) => dispatch(EditPostDetail('cca', cca))}
              />
            </Announcement>
          )}

          <ImageDiv>
            {newPostImages.map((url) => (
              <PostImage card={url} key={url} deleteFunc={deleteImage} />
            ))}
          </ImageDiv>

          <PostButton>
            <Button
              type="primary"
              onClick={() => {
                const handleFunction = isCreatePost ? handleCreatePost : handleEditPost
                dispatch(handleFunction())
                history.push(PATHS.HOME_PAGE)
              }}
            >
              {isCreatePost ? 'Create Post' : 'Save Changes'}
            </Button>
          </PostButton>
        </form>
      </PostContainer>
    </MainContainer>
  )
}
