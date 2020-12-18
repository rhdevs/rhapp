import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import { Input, Upload } from 'antd'
import { DatePicker, List } from 'antd-mobile'
import { LeftOutlined, CheckOutlined, CameraFilled } from '@ant-design/icons'
import enUs from 'antd-mobile/lib/date-picker/locale/en_US'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`
const StyledInput = styled(Input)`
  &.ant-input {
    width: 100%;
    border-radius: 30px;
    border: 1px solid #d9d9d9;
    padding: 5px 10px;
    margin: 0px 0px 20px 0px;
  }
  &.ant-input::placeholder {
    color: #d9d9d9;
  }
`

const StyledList = styled(List)`
  &.am-list {
    width: 100%;
  }
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
  align-items: center;
  justify-content: space-between;
`

const StyledTitle = styled.text`
  font-family: Inter;
  color: black;
  font-size: 15px;
  font-weight: bold;
  line-height: 30px;
  margin-right: 20px;
`

const UploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55vw;
  height: 50px;
  border: 1px dashed #ddd;
  border-radius: 5px;
  /* background-color: red; */
`

const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)

const BackIcon = (
  <Link to={'/schedule'}>
    <LeftOutlined style={{ color: 'black', padding: '0 10px' }} />
  </Link>
)

const CheckIcon = (
  <div>
    <CheckOutlined style={{ color: 'black' }} />
  </div>
)

export default function CreateEvent() {
  const [eventName, setEventName] = useState('')
  const [fromDateTime, setFromDateTime] = useState(now)
  const [toDateTime, setToDateTime] = useState(now)
  const [location, setLocation] = useState('')
  const [cca, setCca] = useState('')
  const [description, setDescription] = useState('')
  const [eventType, setEventType] = useState('')

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
      <TopNavBar title={`Event Details`} leftIcon leftIconComponent={BackIcon} rightComponent={CheckIcon} />
      <Background>
        <StyledInput placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        <StyledList style={{ backgroundColor: 'transparent', padding: '0px 20px' }}>
          <DatePicker mode="datetime" locale={enUs} value={fromDateTime} onChange={setFromDateTime}>
            <StyledList.Item arrow="horizontal" style={{ backgroundColor: 'rgb(217, 217, 217)' }}>
              From
            </StyledList.Item>
          </DatePicker>
          <DatePicker mode="datetime" locale={enUs} value={toDateTime} onChange={setToDateTime}>
            <StyledList.Item arrow="horizontal">To</StyledList.Item>
          </DatePicker>
        </StyledList>

        <InputRow title="Location" placeholder="Event Location" value={location} setValue={setLocation} />
        <InputRow title="CCA" placeholder="CCA Name" value={cca} setValue={setCca} />
        <InputRow
          title="Description"
          placeholder="Tell us what your event is about!"
          value={description}
          setValue={setDescription}
          textarea
        />
        <InputRow title="Event Type" placeholder="Select" value={eventType} setValue={setEventType} />
        <Row>
          <StyledTitle>Upload Image</StyledTitle>
          <Upload name="Event_Image" showUploadList={false}>
            <UploadButton>
              <CameraFilled />
            </UploadButton>
          </Upload>
        </Row>
      </Background>
    </div>
  )
}
