import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
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
import LoadingSpin from '../../../components/LoadingSpin'
import { DeleteSocialPost, GetSpecificPost } from '../../../store/social/action'
import { getInitials } from '../../../common/getInitials'

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
  // TODO: wait for endpoint that provides individual post data from postId
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const postIdFromPath = location.pathname.split('/').slice(-1)[0]

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [success] = useSnackbar('success')

  const { viewPost } = useSelector((state: RootState) => state.social)
  const { userId, createdAt, description, title, postPics, postId, name } = viewPost
  const { userID, profilePictureUrl } = useSelector((state: RootState) => state.profile.user)

  useEffect(() => {
    dispatch(GetSpecificPost(postIdFromPath))
  }, [dispatch, postIdFromPath])

  useEffect(() => {
    if (postId == postIdFromPath) {
      setIsLoading(false)
    }
  }, [postId])

  const postDate = dayjs.unix(parseInt(createdAt ?? ''))
  const isOlderThanADay = dayjs().diff(postDate, 'day') > 0
  const formattedDate = isOlderThanADay ? postDate.format('D/M/YY, h:mmA') : postDate.fromNow()

  const onMenuClick = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  const handleDeletePost = () => {
    setMenuIsOpen(false)

    if (postId) {
      dispatch(DeleteSocialPost(postId))
    }
    success('Successfully Deleted!')
    setIsDeleteModalVisible(false)
    history.goBack()
  }

  const MenuIcon =
    userId == userID ? (
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
        src={profilePictureUrl}
        userId={userId}
      >
        {name ? getInitials(name) : ''}
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
      {isLoading ? (
        <>
          <TopNavBar />
          <LoadingSpin />
        </>
      ) : (
        <>
          <TopNavBar centerComponent={Topbar} rightComponent={MenuIcon} />

          <MainContainer>
            {menuIsOpen && (
              <>
                <StyledMenuContainer style={{ boxShadow: '2px 2px lightgrey' }}>
                  <Menu.Item key="1" icon={<EditFilled />} onClick={() => history.push(PATHS.EDIT + '/' + postId)}>
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    icon={<DeleteFilled />}
                    onClick={() => {
                      setMenuIsOpen(false)
                      setIsDeleteModalVisible(true)
                    }}
                  >
                    Delete
                  </Menu.Item>
                </StyledMenuContainer>
              </>
            )}
            {postPics && renderPhotoCarousel()}
            <DescriptionText>{description}</DescriptionText>
            <BottomNavBar />
          </MainContainer>
        </>
      )}
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
