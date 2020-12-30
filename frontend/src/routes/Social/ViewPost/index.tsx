import React, { useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import 'antd/dist/antd.css'
// import { PATHS } from '../../Routes'
import { Avatar, Menu } from 'antd'

const MainContainer = styled.div`
  width: 100%;
  height: calc(100% + 100px);
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

const ImageContainer = styled.div`
  width: 100%;
  margin: auto 0;
  position: relative;
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
type Props = {
  isOwner: boolean
  avatar?: string
  name: string
  title: string
  dateTime: string
  description: string
  postId: string
  initials: string
  postPics?: string[]
}

export default function ViewPost() {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  // const dispatch = useDispatch()
  // const history = useHistory()

  // const params = useParams<{ postId: string }>()
  const props = useLocation<Props>()

  const { isOwner, avatar, name, title, dateTime, description, postId, initials, postPics } = props.state

  const onMenuClick = () => {
    setMenuIsOpen(!menuIsOpen)
    console.log(menuIsOpen)
  }

  const onDeleteClick = () => {
    setMenuIsOpen(false)
    setDeleteConfirmation(!deleteConfirmation)
    console.log(deleteConfirmation)
  }
  const MenuIcon = isOwner ? (
    <MenuContainer>
      <div onClick={onMenuClick}>
        <EllipsisOutlined rotate={90} style={{ fontSize: '16px' }} />
      </div>
    </MenuContainer>
  ) : (
    <></>
  )

  console.log(props)
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
          {name}, {dateTime}
        </TimeDateText>
      </TextContainer>
    </CenterContainer>
  )

  return (
    <>
      <TopNavBar centerComponent={Topbar} rightComponent={MenuIcon} />

      <MainContainer>
        {menuIsOpen && (
          <>
            <StyledMenuContainer style={{ boxShadow: '2px 2px lightgrey' }}>
              <Menu.Item key="1" icon={<EditFilled />} onClick={onMenuClick}>
                Edit
              </Menu.Item>
              <Menu.Item key="2" icon={<DeleteFilled />} onClick={onDeleteClick}>
                Delete
              </Menu.Item>
            </StyledMenuContainer>
          </>
        )}
        {postPics && (
          <ImageContainer>
            <StyledImg src={postPics[0]} />
          </ImageContainer>
        )}
        <DescriptionText>{description}</DescriptionText>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
