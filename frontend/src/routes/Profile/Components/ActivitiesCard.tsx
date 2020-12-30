import React from 'react'
import 'antd/dist/antd.css'
import SocialPostCard from '../../../components/Mobile/SocialPostCard'

interface Activities {
  title: string
  dateTime: string
  description: string
  id: number
  postId: string
  name: string
  avatar: string
  isOwner: boolean
}

const testData: Activities[] = [
  {
    isOwner: true,
    title: 'Hello',
    dateTime: '8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
    id: 1,
    postId: '12345678',
    name: 'Zhou Gou Gou',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  },
]

// const ActivitiesItem = (activitiesItem: Activities) => {
//   return (
//     <div className="site-card-border-less-wrapper">
//       <Card
//         title={<span style={{ fontSize: '20px' }}>{activitiesItem.title}</span>}
//         bordered={false}
//         style={{ width: '80vw' }}
//         size={'small'}
//       >
//         <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>
//           {activitiesItem.description}
//         </span>
//       </Card>
//     </div>
//   )
// }

const ActivitiesItem = (activitiesItem: Activities) => {
  return (
    <SocialPostCard
      isOwner={activitiesItem.isOwner}
      postId={activitiesItem.postId}
      title={activitiesItem.title}
      dateTime={activitiesItem.dateTime}
      description={activitiesItem.description}
      avatar={activitiesItem.avatar}
      name={activitiesItem.name}
    />
  )
}

const renderActivitiesItems = () => {
  return testData.map((data) => {
    return (
      <ActivitiesItem
        key={data.id}
        title={data.title}
        dateTime={data.dateTime}
        id={data.id}
        description={data.description}
        postId={data.postId}
        avatar={data.avatar}
        name={data.name}
        isOwner={data.isOwner}
      />
    )
  })
}

const ActivitiesCard = () => {
  return <div>{renderActivitiesItems()}</div>
}

export default ActivitiesCard
