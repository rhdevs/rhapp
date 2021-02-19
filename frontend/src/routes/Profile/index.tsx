import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, Tabs } from 'antd'
import 'antd/dist/antd.css'
import { useHistory } from 'react-router-dom'
import EditProfileButton from './Components/EditProfileButton'
import FriendAndTelegramButtons from './Components/FriendAndTelegramButtons'
import TopNavBar from '../../components/Mobile/TopNavBar'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserCCAs, fetchUserDetails, fetchUserPosts, populateProfileEdits } from '../../store/profile/action'
import { RootState } from '../../store/types'
// import statusDot from '../../assets/warning.png'
import { PATHS } from '../Routes'
import { useParams } from 'react-router-dom'
import { Post } from '../../store/profile/types'
import PostCard from './Components/PostCard'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`

const ProfileComponent = styled.div`
  background-color: #fafaf4;
  width: 100vw;
`

const CardContainer = styled.div`
  position: relative;
  width: 80vw;
  margin: 0 auto;
`

const CustomTabs = styled(Tabs)`
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #363636 !important;
    font-weight: 500;
  }
  .ant-tabs-ink-bar {
    border-bottom: 2px solid #de5f4c;
  }
`

const ProfileDetailsGroup = styled.div`
  margin-left: 10vw;
  width: 80vw;
`

const NameParagraph = styled.p`
  font-size: 24px;
  font-weight: bold;
`
const TelegramParagraph = styled.p`
  font-size: 15px;
  font-weight: 500;
`
const BlockParagraph = styled.p`
  font-size: 15px;
  font-weight: 300;
`
const BioParagraph = styled.p`
  font-size: 15px;
`

const AvatarSpan = styled.span`
  display: inline-block;
  height: 27vh;
  width: 30vw;
  vertical-align: middle;
`

const PersonalInfoSpan = styled.span`
  display: inline-block;
  height: 27vh;
  width: 50vw;
  vertical-align: middle;
  padding-left: 3vw;
`

export default function Profile() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const { user, ccas, posts } = useSelector((state: RootState) => state.profile)
  const params = useParams<{ userId: string }>()
  const userIdFromPath = params.userId

  useEffect(() => {
    dispatch(fetchUserDetails(localStorage.getItem('userID')))
    dispatch(fetchUserCCAs(localStorage.getItem('userID')))
    dispatch(fetchUserPosts(localStorage.getItem('userID')))
    setIsOwnProfile(userIdFromPath === localStorage.getItem('userId'))
  }, [dispatch])

  const ActivitiesItem = (postItem: Post) => {
    return (
      <PostCard
        isOwner={!postItem.isOfficial}
        postId={postItem._id}
        title={postItem.title}
        dateTime={postItem.createdAt}
        description={postItem.description}
        avatar={user.profilePictureUrl}
        name={user.displayName}
        userId={postItem.userID}
      />
    )
  }

  const renderActivitiesItems = () => {
    return posts.map((postItem) => {
      return (
        <ActivitiesItem
          key={postItem._id}
          isOfficial={postItem.isOfficial}
          _id={postItem._id}
          title={postItem.title}
          createdAt={postItem.createdAt}
          description={postItem.description}
          postPics={postItem.postPics}
          userID={postItem.userID}
          ccaID={postItem.ccaID}
          tags={postItem.tags}
        />
      )
    })
  }

  const ActivitiesCard = () => {
    return <div>{renderActivitiesItems()}</div>
  }

  const { TabPane } = Tabs
  const CardTabs = () => (
    <CustomTabs defaultActiveKey="1" centered>
      <TabPane tab="Activities" key="1">
        <ActivitiesCard />
      </TabPane>
      <TabPane tab="Details" key="2">
        <>
          <CCAItem />
          <ModulesItem />
        </>
      </TabPane>
    </CustomTabs>
  )

  // FRIENDS SECTION PUSHED BACK IN PROD
  // const handleClickFriendList = () => {
  //   dispatch(fetchUserFriends(userIdFromPath))
  //   history.push(PATHS.FRIEND_LIST_PAGE + `${userIdFromPath}`)
  // }

  const PersonalInfoContainer = () => (
    <ProfileDetailsGroup>
      <AvatarSpan>
        <img alt="logo" style={{ width: 100, borderRadius: 100 / 2 }} src={user?.profilePictureUrl} />
      </AvatarSpan>
      <PersonalInfoSpan>
        <NameParagraph>{user?.displayName}</NameParagraph>
        <TelegramParagraph>@{user?.telegramHandle}</TelegramParagraph>
        <BlockParagraph>Block {user?.block}</BlockParagraph>
        {/* FRIENDS SECTION PUSHED BACK IN PROD */}
        {/* <p style={{ textDecoration: 'underline', color: '#1890FF' }} onClick={handleClickFriendList}>
          My Friends
          <img alt="statusDot" style={{ marginLeft: 5, width: 6 }} src={String(statusDot)} />
        </p> */}
      </PersonalInfoSpan>
      <BioParagraph>{user?.bio}</BioParagraph>
    </ProfileDetailsGroup>
  )

  const CCAItem = () => {
    return (
      <div className="site-card-border-less-wrapper">
        <Card
          title={<span style={{ fontSize: '20px' }}>CCAs</span>}
          bordered={false}
          style={{ width: '80vw' }}
          size={'small'}
        >
          {ccas &&
            ccas?.map((cca) => (
              <>
                <span
                  key={cca.ccaID}
                  style={{
                    backgroundColor: '#F5F5F5',
                    padding: '9px 16px',
                    borderRadius: '9px',
                    lineHeight: '40px',
                    margin: '10px',
                  }}
                >
                  {cca.ccaName}
                </span>
                <br />
              </>
            ))}
        </Card>
      </div>
    )
  }

  const ModulesItem = () => {
    return (
      <div className="site-card-border-less-wrapper">
        <Card
          title={<span style={{ fontSize: '20px' }}>Modules</span>}
          bordered={false}
          style={{ width: '80vw' }}
          size={'small'}
        >
          {user.modules &&
            user.modules?.map((module) => (
              <>
                <span
                  style={{
                    backgroundColor: '#F5F5F5',
                    padding: '9px 16px',
                    borderRadius: '9px',
                    lineHeight: '40px',
                    margin: '10px',
                  }}
                  key={module}
                >
                  {module}
                </span>{' '}
                <br />
              </>
            ))}
        </Card>
      </div>
    )
  }

  const logoutButton = (
    <div
      onClick={() => {
        console.log('im logging out!')
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        history.push(PATHS.LOGIN_PAGE)
      }}
    >
      Logout
    </div>
  )

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Profile'} rightComponent={logoutButton} leftIcon />
        <ProfileComponent>
          <PersonalInfoContainer />
          {isOwnProfile ? (
            <EditProfileButton
              handleClick={() => {
                history.push(PATHS.EDIT_PROFILE_PAGE)
                dispatch(populateProfileEdits())
              }}
            />
          ) : (
            <FriendAndTelegramButtons user={user} />
          )}
          <CardContainer>
            <CardTabs />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
