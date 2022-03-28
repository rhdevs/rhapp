import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { getInitials } from '../../../common/getInitials'
import Avatar from '../../../components/Mobile/Avatar'
import { PATHS } from '../../Routes'

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
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
  width: 75%;
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

const TitleText = styled.p`
  margin: 0;
  color: black;
  font-family: Inter;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TimeDateText = styled.p`
  margin: 0;
  color: grey;
  font-family: Inter;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const DescriptionText = styled.p`
  margin: 0;
  color: black;
  font-family: Inter;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

type PostCardProps = {
  isOwner: boolean
  avatar: string
  name: string
  title: string
  dateTime: number
  description: string
  postId: string
  postPics?: string[]
  userId: string
}

function PostCard(props: PostCardProps) {
  const { avatar, name, title, dateTime, description, postPics, userId, postId } = props
  const history = useHistory()
  const initials = getInitials(props.name)

  const getHumanDateTime = () => {
    const date = new Date(dateTime)
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  }

  return (
    <>
      <CardContainer
        onClick={() => {
          history.push(PATHS.VIEW_POST + postId)
        }}
      >
        <div>
          <Avatar
            size={{ xs: 40, sm: 64, md: 80, lg: 100, xl: 100, xxl: 100 }}
            style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            src={avatar}
            userId={userId}
          >
            {initials}
          </Avatar>
        </div>
        <CenterContainer>
          <TextContainer>
            <TitleText>{title}</TitleText>
            <TimeDateText>
              {name}, {getHumanDateTime()}
            </TimeDateText>
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
      </CardContainer>
    </>
  )
}

export default PostCard
