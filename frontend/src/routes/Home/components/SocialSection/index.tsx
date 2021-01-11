import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PlusCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd'
import SocialPostCard from '../../../../components/Mobile/SocialPostCard'
import { PATHS } from '../../../Routes'

type TabProps = {
  active: boolean
}

type SocialPostCardProps = React.ComponentProps<typeof SocialPostCard>

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 20px;
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  background-color: #fafaf4;
  z-index: 100;
`

const TabBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`

const Tab = styled.div<TabProps>`
  width: 50%;
  text-align: center;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`

const dummyAllData: SocialPostCardProps[] = [
  {
    isOwner: true,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    postId: '123456789',
    title: 'Hello',
    name: 'Zhou Gou Gou',
    dateTime: '8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
    postPics: [
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    ],
  },
]

const dummyFriendData = dummyAllData.slice(0, 1)

export default function SocialSection() {
  const history = useHistory()
  const [isAllSocialPosts, setIsAllSocialPosts] = useState(true)
  const toggleTab = () => setIsAllSocialPosts(!isAllSocialPosts)

  const renderSocialPosts = () => {
    const data = isAllSocialPosts ? dummyAllData : dummyFriendData
    return data.map((post: SocialPostCardProps) => <SocialPostCard {...post} key={post.dateTime} />)
  }

  return (
    <>
      <Header>
        <span>{`What's happening....`}</span>
        <PlusCircleFilled style={{ color: '#EB5757', fontSize: 20 }} onClick={() => history.push(PATHS.CREATE_POST)} />
      </Header>
      <TabBar>
        <Tab active={isAllSocialPosts} onClick={toggleTab}>
          All
        </Tab>
        <Divider type="vertical" />
        <Tab active={!isAllSocialPosts} onClick={toggleTab}>
          Friends
        </Tab>
      </TabBar>
      {renderSocialPosts()}
    </>
  )
}
