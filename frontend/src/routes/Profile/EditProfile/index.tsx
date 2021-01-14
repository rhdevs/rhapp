import React, { useState } from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
// import EditDetailsCard from './EditDetailsCard'
import EditPersonalInfoContainer from '../Components/EditPersonalInfoContainer'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchUserDetails, handleCCADetails, handleModuleDetails } from '../../../store/profile/action'
import { AutoComplete, Card, Select } from 'antd'
import deleteIcon from '../../../assets/cancel.svg'
import plusCircle from '../../../assets/plusCircle.svg'

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

interface Details {
  title: string
}

export default function EditProfile() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.profile)

  useEffect(() => {
    dispatch(fetchUserDetails())
    //TODO: change to comparing userId with user.id
    // isOwnProfile  => user.Id === myId (myId will be fetched via whatever backend or session storage,)
  }, [dispatch])

  // Visibility dropdown
  const { Option } = Select

  function handleChange(value) {
    console.log(`selected ${value}`)
  }

  const VisibilitySelector = () => {
    return (
      <Select defaultValue="Everybody" style={{ width: 120, float: 'right' }} onChange={handleChange}>
        <Option value="Everybody">Everybody</Option>
        <Option value="Friends">Friends</Option>
        <Option value="Only Me">Only Me</Option>
      </Select>
    )
  }

  // Search bar
  const options = [{ value: 'Baa' }, { value: 'Basketball' }, { value: 'Badminton' }]

  const Complete: React.FC = () => (
    <AutoComplete
      style={{ width: '120px', height: '22px' }}
      options={options}
      placeholder="search info.."
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
    />
  )

  const EditDetailsItem = (detailsItem: Details) => {
    const [searchInfoSelected, setSearchInfoSelected] = useState(false)

    function plusCircleClicked() {
      setSearchInfoSelected(!searchInfoSelected)
    }

    const deleteIconClicked = (itemType: 'cca' | 'module', itemToBeDeleted: string) => {
      switch (itemType) {
        case 'cca':
          dispatch(handleCCADetails('Delete', itemToBeDeleted))
          break
        case 'module':
          dispatch(handleModuleDetails('Delete', itemToBeDeleted))
          break
      }
    }

    const renderSwitch = (detailsTitle: string) => {
      switch (detailsTitle) {
        case 'CCAs':
          {
            return user.ccas.map((cca) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>
                  {cca.ccaName}
                  <img
                    alt="deleteIcon"
                    style={{ marginLeft: 5, width: 6 }}
                    src={String(deleteIcon)}
                    onClick={() => deleteIconClicked('cca', cca.ccaName)}
                  />
                </span>
              )
            })
          }
          break
        case 'Modules':
          {
            return user.modules.map((module) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>
                  {module}
                  <img
                    alt="deleteIcon"
                    style={{ marginLeft: 5, width: 6 }}
                    src={String(deleteIcon)}
                    onClick={() => deleteIconClicked('module', module)}
                  />
                </span>
              )
            })
          }
          break
        default:
          return <></>
      }
    }

    return (
      <div className="site-card-border-less-wrapper">
        <Card
          title={
            <span>
              <span style={{ fontSize: '20px' }}>
                <span style={{ display: 'inline-flex', flexDirection: 'column' }}>{detailsItem.title}</span>
                <img
                  alt="plusCircle"
                  style={{ marginLeft: 10, width: 15 }}
                  src={String(plusCircle)}
                  onClick={plusCircleClicked}
                />
                <VisibilitySelector />
              </span>
              {searchInfoSelected ? (
                <span style={{ display: 'block' }}>
                  <Complete />
                </span>
              ) : (
                <></>
              )}
            </span>
          }
          bordered={false}
          style={{ width: '80vw' }}
          size={'small'}
        >
          {renderSwitch(detailsItem.title)}
        </Card>
      </div>
    )
  }

  const EditDetailsCard = () => {
    return (
      <>
        <EditDetailsItem title="CCAs" />
        <EditDetailsItem title="Modules" />
      </>
    )
  }

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Edit Profile'} />
        <ProfileComponent>
          <EditPersonalInfoContainer />
          <CardContainer>
            <EditDetailsCard />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
