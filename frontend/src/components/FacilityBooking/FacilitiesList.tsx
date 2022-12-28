import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Radio } from 'antd'

import { REVAMP_GREEN } from '../../common/colours'
import { unixToFullDateTime } from '../../common/unixToFullDateTime'
import FacilityLogo from './FacilityLogo'
import JCRCBlockOutModal from '../Mobile/JCRCBlockOutModal'
import { Facility } from '../../store/facilityBooking/types'

const FacilitiesListMainDiv = styled.div`
  height: 100%;
`

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
    color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: ${REVAMP_GREEN};
    border-left-color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover:before {
    color: white;
    background: ${REVAMP_GREEN};
    border-color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
    color: white;
    background: ${REVAMP_GREEN};
    border-color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: white;
    background: ${REVAMP_GREEN};
    border-color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover {
    color: white;
    background: ${REVAMP_GREEN};
    border-color: ${REVAMP_GREEN};
  }

  .ant-radio-button-wrapper {
    font-family: Inter;
  }
`

const StyledUpperGroupDiv = styled.div`
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
  height: 100%;
`

const TimeTextDiv = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  background-color: #fafaf4;
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-top: 0.7rem;
`

/**
 * # FacilitiesList Component
 *
 * @param facilityList (`Facility[]`) - list of facilities to be displayed
 * @param locationList (`string[]`) - list of locations to be displayed
 * @param facilityCardOnClick (`(facilityId: number) => void`) - function to be called when a facility card is clicked
 * @param blockOutIsOpen (`boolean`, optional) - whether the block out modal is open or not
 * @param showTimeStartEnd (`boolean`, optional) - whether to display start and end time in the header with format `From: Day, DD Month YYYY at HHMM\n To: Day, DD Month YYYY at HHMM`
 * @param showTimeStart (`number`, optional) - unix timestamp for header start time
 * @param showTimeEnd (`number`, optional) - unix timestamp for header start time
 *
 * @returns A list of facilities to be displayed, which can be filtered by location
 *
 * @example
 * ```
 * <FacilitiesList facilityList={facilityList} locationList={locationList} facilityCardOnClick={facilityCardOnClick} />
 * ```
 */
const FacilitiesList = (props: {
  facilityList: Facility[]
  locationList: string[]
  facilityCardOnClick: (facilityId: number) => void
  blockOutIsOpen?: boolean
  showTimeStartEnd?: boolean
  showTimeStart?: number
  showTimeEnd?: number
}) => {
  const { facilityList, locationList, facilityCardOnClick, blockOutIsOpen } = { ...props }
  const [selectedTab, setSelectedTab] = useState('All')

  useEffect(() => {
    setSelectedTab('All')
  }, [])

  const onChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTab(e.target.value)
  }

  const StartEndTimeText = (
    <TimeTextDiv>
      <span>From: {props.showTimeStart ? unixToFullDateTime(props.showTimeStart) : '-'}</span>
      <span>To: {props.showTimeEnd ? unixToFullDateTime(props.showTimeEnd) : '-'}</span>
    </TimeTextDiv>
  )

  const RadioGroup = (
    <StyledRadioGroup defaultValue={locationList[0]}>
      {locationList.map((location, idx) => (
        <Radio.Button key={idx} value={location}>
          {location}
        </Radio.Button>
      ))}
    </StyledRadioGroup>
  )

  return (
    <FacilitiesListMainDiv>
      <StyledUpperGroupDiv onChange={onChangeTab}>
        {props.showTimeStartEnd && StartEndTimeText}
        {RadioGroup}
      </StyledUpperGroupDiv>
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
    </FacilitiesListMainDiv>
  )
}

export default FacilitiesList
