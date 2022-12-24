import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Radio } from 'antd'

import FacilityLogo from './FacilityLogo'
import JCRCBlockOutModal from '../Mobile/JCRCBlockOutModal'
import { Facility } from '../../store/facilityBooking/types'

const FacilityCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const FacilityHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
`

const FacilitySubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
`

const FacilityLabels = styled.div`
  align-self: center;
  margin-top: 14px;
`

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper:hover {
    color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: #de5f4c;
    border-left-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover:before {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover {
    color: white;
    background: #de5f4c;
    border-color: #de5f4c;
  }

  .ant-radio-button-wrapper {
    font-family: Inter;
  }
`

const StyledRadioGroupDiv = styled.div`
  overflow: auto;
  white-space: nowrap;
  margin: 0 21px;
  position: sticky;
  left: 0;
  top: 4.4rem;
  padding-bottom: 10px;
  background: #fafaf4;
`

const StyledBodyDiv = styled.div`
  background-color: #fafaf4;
  height: 80vh;
  overflow: scroll;
  overflow-x: hidden;
`

const FacilitiesList = (props: {
  facilityList: Facility[]
  locationList: string[]
  facilityCardOnClick: (facilityId: number) => void
  blockOutIsOpen?: boolean
}) => {
  const { facilityList, locationList, facilityCardOnClick, blockOutIsOpen } = { ...props }
  const [selectedTab, setSelectedTab] = useState('All')

  useEffect(() => {
    setSelectedTab('All')
  }, [])

  const onChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTab(e.target.value)
  }

  const RadioGroup = (
    <StyledRadioGroupDiv onChange={onChangeTab}>
      <StyledRadioGroup defaultValue={locationList[0]}>
        {locationList.map((location, idx) => (
          <Radio.Button key={idx} value={location}>
            {location}
          </Radio.Button>
        ))}
      </StyledRadioGroup>
    </StyledRadioGroupDiv>
  )

  return (
    <>
      {RadioGroup}
      <StyledBodyDiv>
        {blockOutIsOpen && (
          <JCRCBlockOutModal
            title="Facilities Blocking"
            hasLeftButton={true}
            leftButtonText="Confirm"
            rightButtonText="Close"
            facilities={facilityList}
          />
        )}
        {facilityList.map((facility) => {
          if (facility.facilityLocation === selectedTab || selectedTab === '' || selectedTab === 'All')
            return (
              <FacilityCard
                key={facility.facilityID}
                onClick={() => {
                  facilityCardOnClick(facility.facilityID)
                }}
              >
                <FacilityLogo key={facility.facilityID} facilityId={facility.facilityID} />
                <FacilityLabels>
                  <FacilityHeader>{facility.facilityName}</FacilityHeader>
                  <FacilitySubHeader>{facility.facilityLocation}</FacilitySubHeader>
                </FacilityLabels>
              </FacilityCard>
            )
        })}
      </StyledBodyDiv>
    </>
  )
}

export default FacilitiesList
