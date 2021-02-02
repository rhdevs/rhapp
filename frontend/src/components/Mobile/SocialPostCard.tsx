import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Menu } from 'antd'
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons'
import ConfirmationModal from './ConfirmationModal'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import { DeletePost } from '../../store/social/action'
import Avatar from '../../components/Mobile/Avatar'
import { getInitials } from '../../common/getInitials'
import PostTag from '../Mobile/PostTag'

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 3vh;
  margin: 0 auto 10px;
  background-color: white;
  padding: 20px 20px;
  transition-duration: 0.25s;
`
const CenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
`

const TextContainer = styled.div`
  flex-direction: column;
  margin: 0px 10px;
  width: 75%;
`
const MenuContainer = styled.div`
  position: relative;
  display: flex;
  margin-left: 10px;
`
const StyledMenuContainer = styled(Menu)`
  position: absolute;
  right: 2px;
  top: 20px;
  font-family: Inter;
  z-index: 3;
  border-radius: 5px;
`

const ImageContainer = styled.div`
  width: 75px;
  height: 75px;
  margin: auto 0;
  position: relative;
  object-fit: cover;
`
const StyledImg = styled.img`
  width: 75px;
  height: 75px;
  top: -3px;
  left: -3px;
  position: relative;
  z-index: 2;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  background-color: white;
`

const StyledImgShadow = styled.div`
  background-color: #c4c4c4;
  width: 75px;
  height: 75px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 1;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`
const StyledImgShadowTwo = styled.div`
  background-color: #c4c4c4;
  width: 75px;
  height: 75px;
  position: absolute;
  top: 3px;
  bottom: -3px;
  left: 3px;
  right: -3px;
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
  display: block;
`
const DescriptionText = styled.text`
  color: black;
  font-family: Inter;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

type socialPostCardProps = {
  isOwner: boolean
  avatar: string
  name: string
  title: string
  dateTime: string
  description: string
  postId: string
  postPics?: string[]
  tag?: string
}

function SocialPostCard(props: socialPostCardProps) {
  const history = useHistory()
  const dispatch = useDispatch()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const { isOwner, avatar, name, title, dateTime, description, postId, postPics, tag } = props

  const initials = getInitials(props.name)

  const onExpandClick = () => {
    history.push({
      pathname: `${PATHS.VIEW_POST}${props.postId}`,
    })
  }

  const onMenuClick = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  const onDeleteClick = () => {
    setMenuIsOpen(false)
    setDeleteConfirmation(!deleteConfirmation)
  }

  const onConfirmDeleteClick = () => {
    setMenuIsOpen(false)
    setDeleteConfirmation(!deleteConfirmation)
    dispatch(DeletePost(postId))
  }

  return (
    <>
      <CardContainer>
        <div>
          <Avatar
            size={{ xs: 40, sm: 64, md: 80, lg: 100, xl: 100, xxl: 100 }}
            style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            src={avatar}
          >
            {initials}
          </Avatar>
        </div>
        <CenterContainer onClick={onExpandClick}>
          <TextContainer>
            <TitleText>{title}</TitleText>
            <TimeDateText>
              {name}, {dateTime}
            </TimeDateText>
            {tag && <PostTag position={tag} />}
            <DescriptionText>{description}</DescriptionText>
          </TextContainer>
          {postPics && postPics.length > 0 && (
            <>
              <ImageContainer>
                <StyledImg src={postPics[0]} />
                {postPics.length > 1 && (
                  <>
                    <StyledImgShadow />
                    <StyledImgShadowTwo />
                  </>
                )}
              </ImageContainer>
            </>
          )}
        </CenterContainer>

        <MenuContainer>
          <div style={{ width: 16 }}>
            {isOwner && <EllipsisOutlined rotate={90} style={{ fontSize: '16px' }} onClick={onMenuClick} />}
          </div>
          {menuIsOpen && (
            <StyledMenuContainer style={{ boxShadow: '2px 2px lightgrey' }}>
              <Menu.Item key="1" icon={<EditFilled />} onClick={() => history.push(PATHS.EDIT + '/' + postId)}>
                Edit
              </Menu.Item>
              <Menu.Item key="2" icon={<DeleteFilled />} onClick={onDeleteClick}>
                Delete
              </Menu.Item>
            </StyledMenuContainer>
          )}
        </MenuContainer>
      </CardContainer>
      {deleteConfirmation && (
        <ConfirmationModal
          title={'Delete Post?'}
          hasLeftButton={true}
          leftButtonText={'Delete'}
          onLeftButtonClick={onConfirmDeleteClick}
          rightButtonText={'Cancel'}
          onRightButtonClick={onDeleteClick}
          bottom={10}
        />
      )}
    </>
  )
}

export default SocialPostCard
