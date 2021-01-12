import React, { useEffect } from 'react'
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
  handleCreateEditPost,
  PopWarning,
  ResetPostDetails,
} from '../../../store/social/action'
import { PostImage } from './Components/postImage'
import { PATHS } from '../../Routes'
import LoadingSpin from '../../../components/LoadingSpin'

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
  margin: 35px 0px 0px 31px;
  font-family: Inter;
  font-size: 21px;
  font-style: bold;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
`
const SwitchContainer = styled.div`
  position: relative;
  transform: translate(330%, 0%);
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
  margin-top: 0px;
  display: flex;
  text-align: center;
  margin-left: 100px;
`

export default function CreateEditPost() {
  const params = useParams<{ editPostId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { newPostTitle, newPostBody, newPostImages, newPostOfficial, warnings, isUploading } = useSelector(
    (state: RootState) => state.social,
  )

  useEffect(() => {
    if (window.location.href.includes('/post/edit')) {
      dispatch(GetPostDetailsToEdit(params.editPostId))
    } else {
      dispatch(ResetPostDetails())
    }
  }, [dispatch])

  const deleteImage = (source: string) => {
    dispatch(DeleteImage(source))
  }

  return (
    <MainContainer>
      <TopNavBar title={window.location.href.includes('/post/edit') ? 'Edit Post' : 'Create Post'} />
      {/* {modal.navModal && (
          <ConfirmationModal
            title={"Discard Changes?"}
            hasLeftButton={true}
            leftButtonText={"Delete"}
            onLeftButtonClick={() => history.push(PATHS.EVENT_LIST_PAGE)} //change paths in future
            rightButtonText={"Cancel"}
            onRightButtonClick={() => setModal({ ...modal, navModal: false })}
          />
        )} */}
      {/* {modal.buttonModal && (
        <ConfirmationModal
          title={modal.buttonModalCaption}
          hasLeftButton={true}
          leftButtonText={modal.buttonModalChoice}
          onLeftButtonClick={(e) => onSubmit(e)} //change paths in future
          rightButtonText={'Cancel'}
          onRightButtonClick={() => setModal({ ...modal, buttonModal: false })}
        />
      )} */}
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
                onChange={(e) => dispatch(EditPostDetail('title', e.target.value))}
                placeholder="Title"
                required
              />
            </Header>
            <Content>
              <Caption
                name="caption"
                value={newPostBody}
                onChange={(e) => dispatch(EditPostDetail('body', e.target.value))}
                placeholder="Tap to type your caption..."
                required
              />
            </Content>
            {isUploading && <LoadingSpin />}
            {!isUploading && (
              <Footer>
                <InputFile type="file" name="file" id="file" onChange={(e) => dispatch(AddImage(e))} />
                <InputLabel htmlFor="file">
                  <FileImageFilled style={{ fontSize: '20px' }} />
                </InputLabel>
              </Footer>
            )}
          </Card>
          {true && (
            <Announcement>
              <p>Official</p>
              <SwitchContainer>
                <Switch checked={newPostOfficial} onChange={() => dispatch(EditPostDetail('official', 'null'))} />
              </SwitchContainer>
            </Announcement>
          )}
          <ImageDiv>
            {newPostImages.map((url) => (
              <div key={url}>
                <PostImage card={url} deleteFunc={deleteImage} />
              </div>
            ))}
          </ImageDiv>
          <PostButton>
            <Button
              type="primary"
              onClick={() => {
                dispatch(handleCreateEditPost())
                history.push(PATHS.HOME_PAGE)
              }}
            >
              {window.location.href.includes('/post/edit') ? 'Save Changes' : 'Create Post'}
            </Button>
          </PostButton>
        </form>
      </PostContainer>
    </MainContainer>
  )
}
