import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ViewEventDetailCard from '../../../components/Scheduling/ViewEventDetailCard'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { LeftOutlined, EditOutlined } from '@ant-design/icons'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getHallEventTypes } from '../../../store/scheduling/action'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin: 8px 0px;
  align-items: center;
  justify-content: space-between;
`

const BackIcon = (
  <Link to={'/schedule'}>
    <LeftOutlined style={{ color: 'black', padding: '0 10px' }} />
  </Link>
)

export default function CreateEvent() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getHallEventTypes())
  }, [dispatch])

  const EditIcon = (
    <div>
      <EditOutlined style={{ color: 'black', fontSize: '30px' }} />
    </div>
  )

  /** Incomplete functionality for Uploading Image */

  // const [uploadLoading, setUploadLoading] = useState(false)
  // const [imageUrl, setImageUrl] = useState('')

  // function getBase64(img, callback) {
  //   const reader = new FileReader()
  //   reader.addEventListener('load', () => callback(reader.result))
  //   reader.readAsDataURL(img)
  // }

  // const handleUpload = (info) => {
  //   if (info.file.status === 'uploading') {
  //     setUploadLoading(true)
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (imageUrl: string) => {
  //       setImageUrl(imageUrl)
  //       setUploadLoading(false)
  //     })
  //   }
  // }

  return (
    <div>
      <TopNavBar title={`Event Details`} leftIcon leftIconComponent={BackIcon} rightComponent={EditIcon} />
      <Background>
        <Row>
          <ViewEventDetailCard
            eventName={'Gym Lah'}
            eventCreatedBy={'You'}
            startDateAndTime={1608723138}
            endDateAndTime={1608726751}
            eventLocation={'Basketball Court'}
            eventCca={'Basketball'}
            eventDescription={'Come join us'}
            eventType={'CCA'}
          />
        </Row>
      </Background>
    </div>
  )
}
