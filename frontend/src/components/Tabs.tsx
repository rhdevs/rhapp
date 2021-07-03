import React, { useState } from 'react'

import styled from 'styled-components'
import { V1_BLUE } from '../common/colours'

const MainTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
  margin-bottom: 10px;
`

const TabContainer = styled.div<{ isSelected?: boolean }>`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  color: ${(props) => (props.isSelected ? V1_BLUE : 'rgba(0, 0, 0, 0.55)')};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`

const Separator = styled.div`
  width: 1px;
  background-color: rgba(0, 0, 0, 0.5);
  height: 17px;
`
//NOTE: Values and children is assumed to correspond according to their indexes!
type Props = {
  defaultValue?: number
  valueNamesArr
  childrenArr
}

export const Tabs = (props: Props) => {
  const [currentTab, setCurrentTab] = useState<number>(props.defaultValue ?? 1)

  const selectedChild = () => {
    const index = currentTab - 1
    return props.childrenArr[index]
  }

  return (
    <>
      <MainTabsContainer>
        {props.valueNamesArr.map((valueName, index) => {
          const isSelected = props.valueNamesArr.indexOf(valueName) === currentTab - 1
          return (
            <>
              <TabContainer key={index} onClick={() => setCurrentTab(index + 1)} isSelected={isSelected}>
                {valueName}
              </TabContainer>
              {index !== props.valueNamesArr.length - 1 && <Separator />}
            </>
          )
        })}
      </MainTabsContainer>
      {selectedChild()}
    </>
  )
}
