import React, { useState } from 'react'
import styled from 'styled-components'
import { PlusCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd'
import SocialPostCard from '../../../components/Mobile/SocialPostCard'

type TabProps = {
  active: boolean
}

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

const dummyAllData = [
  {
    title: 'Hello',
    dateTime: 'Zhou Gou Gou, 8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
  },
  {
    title: 'Hello',
    dateTime: 'Zhou Mao Mao, 8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
  },
  {
    title: 'Hello',
    dateTime: 'Zhou Gou Gou, 8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
  },
  {
    title: 'Hello',
    dateTime: 'Zhou Mao Mao, 8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
  },
]

const dummyFriendData = dummyAllData.slice(0, 1)

export default function SocialSection() {
  const [isAllSocialPosts, setIsAllSocialPosts] = useState(true)
  const toggleTab = () => setIsAllSocialPosts(!isAllSocialPosts)

  const renderSocialPosts = () => {
    const data = isAllSocialPosts ? dummyAllData : dummyFriendData
    return data.map((post) => <SocialPostCard {...post} key={post.dateTime} />)
  }

  return (
    <>
      <Header>
        <span>{`What's happening....`}</span>
        <PlusCircleFilled style={{ color: '#EB5757', fontSize: 20 }} />
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
