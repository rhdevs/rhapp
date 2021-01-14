import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
// import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import 'antd/dist/antd.css'
import useSnackbar from '../../../hooks/useSnackbar'
import dayjs from 'dayjs'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import StyledCarousel from '../../../components/Mobile/StyledCarousel'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Menu } from 'antd'
import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import Avatar from '../../../components/Mobile/Avatar'

import { GetPosts, DeletePost, SetPostUser } from '../../../store/social/action'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
`

const CenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
`
const MenuContainer = styled.div`
  position: relative;
  display: flex;
  margin-left: 10px;
`
const StyledMenuContainer = styled(Menu)`
  position: absolute;
  right: 2px;
  top: 50px;
  font-family: Inter;
  z-index: 3;
  border-radius: 5px;
`

const StyledImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  z-index: 2;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`

const TitleText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TimeDateText = styled.text`
  color: grey;
  font-family: Inter;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DescriptionText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 14px;
  display: -webkit-box;
  padding: 20px;
`
export default function ViewPost() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [success] = useSnackbar()

  // const { postId } = useParams<{ postId: string }>()
  const postId = '123456789' // To uncomment above line
  const { posts, postUser } = useSelector((state: RootState) => state.social)
  let post

  useEffect(() => {
    dispatch(GetPosts())
    post = posts.find((post) => {
      return post.postId == parseInt(postId)
    })
    dispatch(SetPostUser(post?.ownerId))
  }, [dispatch])

  const title = post?.title
  const ownerId = post?.ownerId
  const date = post?.date
  const description = post?.description
  const postPics = post?.postPics

  const formattedDate = date ? dayjs(date).format('D/M/YY, h:mmA') : dayjs().format('D/M/YY, h:mmA')

  const avatar = postUser?.avatar
  const initials = postUser?.initials
  const name = postUser?.name

  const onMenuClick = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  const onDeleteClick = () => {
    setMenuIsOpen(false)
    setIsDeleteModalVisible(true)
  }

  const handleDeletePost = () => {
    // TODO: Call delete post endpoint
    if (postId) {
      dispatch(DeletePost(parseInt(postId)))
    }
    success('Successfully Deleted!')
    setIsDeleteModalVisible(false)
  }

  // TODO: change to ownerId == userId
  const MenuIcon =
    ownerId == 1 ? (
      <MenuContainer>
        <div onClick={onMenuClick}>
          <EllipsisOutlined rotate={90} style={{ fontSize: '16px' }} />
        </div>
      </MenuContainer>
    ) : (
      <></>
    )

  const Topbar = (
    <CenterContainer>
      <Avatar
        size={{ xs: 40, sm: 64, md: 80, lg: 100, xl: 100, xxl: 100 }}
        style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        src={avatar}
      >
        {initials}
      </Avatar>
      <TextContainer>
        <TitleText>{title}</TitleText>
        <TimeDateText>
          {name}, {formattedDate}
        </TimeDateText>
      </TextContainer>
    </CenterContainer>
  )

  const renderPhotoCarousel = () => (
    <StyledCarousel>{postPics && postPics.map((pic) => <StyledImg src={pic} key={pic} />)}</StyledCarousel>
  )

  return (
    <>
      <TopNavBar centerComponent={Topbar} rightComponent={MenuIcon} />

      <MainContainer>
        {menuIsOpen && (
          <>
            <StyledMenuContainer style={{ boxShadow: '2px 2px lightgrey' }}>
              <Menu.Item key="1" icon={<EditFilled />} onClick={() => history.push(PATHS.EDIT + '/' + postId)}>
                Edit
              </Menu.Item>
              <Menu.Item key="2" icon={<DeleteFilled />} onClick={onDeleteClick}>
                Delete
              </Menu.Item>
            </StyledMenuContainer>
          </>
        )}
        {postPics && renderPhotoCarousel()}
        <DescriptionText>{description}</DescriptionText>
        <BottomNavBar />
      </MainContainer>

      {isDeleteModalVisible && (
        <ConfirmationModal
          title="Discard Changes?"
          hasLeftButton
          leftButtonText="Delete"
          onLeftButtonClick={handleDeletePost}
          rightButtonText="Cancel"
          onRightButtonClick={() => setIsDeleteModalVisible(false)}
        />
      )}
    </>
  )
}
