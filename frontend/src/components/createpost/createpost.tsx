import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import '../../assets/fonts.css'
import { Switch, Button } from 'antd'
import { FileImageFilled } from '@ant-design/icons'
import 'antd/dist/antd.css'
import TopNavBar from '../Mobile/TopNavBar'
import ConfirmationModal from '../../components/Mobile/ConfirmationModal'
import { PostImage } from './postimage'

//styling
const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`

const NavContainer = styled.div``

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

const WarningDiv = styled.div`
  position: absolute;
  bottom: 140px;
  background-color: #fff;
  width: 324px;
  height: 70px;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 1000;
`
const Warning = styled.p`
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 50px;
  color: grey;
  margin-left: 15px;
  margin-top: 6px;
`

const CreatePost = ({ status }: { status: string }) => {
  const history = useHistory()

  function setStatus(status: string) {
    if (status === 'create') {
      setBody({
        ...body,
        navTitle: 'Create Post',
        button: 'Post!',
      })
      setModal({
        ...modal,
        buttonModalCaption: 'Create Post?',
        buttonModalChoice: 'Post',
      })
    } else if (status === 'edit') {
      setBody({
        ...body,
        navTitle: 'Edit Post',
        button: 'Save Changes',
      })
      setModal({
        ...modal,
        buttonModalCaption: 'Save changes?',
        buttonModalChoice: 'Edit',
      })
    } else if (status === 'leadercreate') {
      setBody({
        ...body,
        navTitle: 'Create Post',
        button: 'Post!',
        setOfficial: true,
      })
      setModal({
        ...modal,
        buttonModalCaption: 'Create Post?',
      })
    }
  }

  useEffect(() => {
    setStatus(status)
  }, [])

  const [body, setBody] = useState({
    title: '',
    caption: '',
    navTitle: '',
    button: '',
    setOfficial: false,
  })

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setBody({
      ...body,
      [e.target.name]: e.target.value,
    })
  }

  function onSubmit(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault()
    console.log(body.title)
    console.log(body.caption)
    //dispatch
    setBody({
      ...body,
      title: '',
      caption: '',
    })
    history.push(PATHS.EVENT_LIST_PAGE)
    //history.push(PATHS.LAUNDRY_PAGE)
  }

  const [modal, setModal] = useState({
    navModal: false,
    photoModal: false,
    buttonModal: false,
    buttonModalCaption: 'Create Post?',
    buttonModalChoice: 'Post',
  })

  //image
  interface ImageData {
    file: File | null
    imagePreviewUrl: Array<string>
  }

  const [image, setImage] = useState<ImageData>({ file: null, imagePreviewUrl: [] })

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()

    const reader = new FileReader()
    const files = e.target.files ?? []
    const file = files.length > 0 ? files[0] : null
    if (!file) {
      setShowWarning({ shown: true, warning: 'No file selected!' })
      setTimeout(() => setShowWarning({ ...showWarning, shown: false }), 2000)
    } else if (!file.type.match('image.*')) {
      setShowWarning({ shown: true, warning: 'File is not a photo!' })
      setTimeout(() => setShowWarning({ ...showWarning, shown: false }), 2000)
    } else {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (image.imagePreviewUrl.length > 2) {
          setShowWarning({ shown: true, warning: 'The limit is 3 photos!' })
          setTimeout(() => setShowWarning({ ...showWarning, shown: false }), 2000)
        }
        setImage({
          file: file,
          imagePreviewUrl:
            reader.result && !(reader.result instanceof ArrayBuffer) && image.imagePreviewUrl.length < 3
              ? [...image.imagePreviewUrl, reader.result]
              : image.imagePreviewUrl,
        })
      }
    }
  }

  function deleteImage(source: string) {
    const newArray = image.imagePreviewUrl.filter((word) => word !== source)
    if (image.imagePreviewUrl.length - newArray.length > 1) {
      setImage({
        ...image,
        imagePreviewUrl: [...newArray, source],
      })
    } else {
      setImage({
        ...image,
        imagePreviewUrl: newArray,
      })
    }
  }

  const ImageDiv = styled.div`
    margin-top: 0px;
    display: flex;
    text-align: center;
    margin-left: ${image.imagePreviewUrl.length === 1
      ? '119.395px'
      : image.imagePreviewUrl.length === 2
      ? '74.79px'
      : '30.185px'};
  `

  const [showWarning, setShowWarning] = useState({ shown: false, warning: 'The limit is 3 photos!' })

  return (
    <>
      <MainContainer>
        {modal.navModal && (
          <ConfirmationModal
            title={'Discard Changes?'}
            hasLeftButton={true}
            leftButtonText={'Delete'}
            onLeftButtonClick={() => history.push(PATHS.EVENT_LIST_PAGE)} //change paths in future
            rightButtonText={'Cancel'}
            onRightButtonClick={() => setModal({ ...modal, navModal: false })}
          />
        )}
        {modal.buttonModal && (
          <ConfirmationModal
            title={modal.buttonModalCaption}
            hasLeftButton={true}
            leftButtonText={modal.buttonModalChoice}
            onLeftButtonClick={(e) => onSubmit(e)} //change paths in future
            rightButtonText={'Cancel'}
            onRightButtonClick={() => setModal({ ...modal, buttonModal: false })}
          />
        )}
        <div onClick={() => setModal({ ...modal, navModal: true })}>
          <NavContainer style={{ pointerEvents: 'none' }}>
            <TopNavBar title={body.navTitle} />
          </NavContainer>
        </div>
        <PostContainer>
          <form>
            <Card>
              <Header>
                <Title
                  type="text"
                  name="title"
                  value={body.title}
                  onChange={(e) => onChange(e)}
                  placeholder="Title"
                  required
                />
              </Header>
              <Content>
                <Caption
                  name="caption"
                  value={body.caption}
                  onChange={(e) => onChange(e)}
                  placeholder="Tap to type your caption..."
                  required
                />
              </Content>
              <Footer>
                <InputFile type="file" name="file" id="file" onChange={(e) => handleImageChange(e)} />
                <InputLabel htmlFor="file">
                  <FileImageFilled style={{ fontSize: '20px' }} />
                </InputLabel>
              </Footer>
            </Card>
            {showWarning.shown && (
              <WarningDiv>
                <Warning>{showWarning.warning}</Warning>
              </WarningDiv>
            )}
            {body.setOfficial && (
              <Announcement>
                <p>Official</p>
                <SwitchContainer>
                  <Switch defaultChecked onChange={() => console.log('hello')} />
                </SwitchContainer>
              </Announcement>
            )}{' '}
            <ImageDiv>
              {image.imagePreviewUrl.map((url) => (
                <div key={url}>
                  <PostImage card={url} deleteFunc={deleteImage} />
                </div>
              ))}
            </ImageDiv>
            <PostButton>
              <Button type="primary" onClick={() => setModal({ ...modal, buttonModal: true })}>
                {body.button}
              </Button>
            </PostButton>
          </form>
        </PostContainer>
      </MainContainer>
    </>
  )
}

export { CreatePost }
