import React from 'react'
import styled from 'styled-components'

import AlumniRoom from '../../assets/facilitiesLogos/AlumniRoom.svg'
import BandRoom from '../../assets/facilitiesLogos/BandRoom.svg'
import BasketballCourt from '../../assets/facilitiesLogos/BasketballCourt.svg'
import ConferenceRoomKFH from '../../assets/facilitiesLogos/ConferenceRoomKFH.svg'
import ConferenceRoomUL from '../../assets/facilitiesLogos/ConferenceRoomUL.svg'
import DanceStudio from '../../assets/facilitiesLogos/DanceStudio.svg'
import Foyer from '../../assets/facilitiesLogos/Foyer.svg'
import Gym from '../../assets/facilitiesLogos/Gym.svg'
import HardCourt from '../../assets/facilitiesLogos/HardCourt.svg'
import MainAreaCommHall from '../../assets/facilitiesLogos/MainAreaCommHall.svg'
import MainAreaUL from '../../assets/facilitiesLogos/MainAreaUL.svg'
import MeetingRoomLL from '../../assets/facilitiesLogos/MeetingRoomLL.svg'
import PoolAreaLL from '../../assets/facilitiesLogos/PoolAreaLL.svg'
import Stage from '../../assets/facilitiesLogos/Stage.svg'
import TVRoom from '../../assets/facilitiesLogos/TVRoom.svg'
import DummyAvatar from '../../assets/dummyAvatar.svg'

const FacilityAvatar = styled.img`
  padding: 10px;
  width: 30%;
  max-height: 70px;
`

export default function FacilityLogo(props: { facilityId: number }) {
  switch (props.facilityId) {
    case 1:
      return <FacilityAvatar src={MainAreaUL} />
    case 2:
      return <FacilityAvatar src={ConferenceRoomUL} />
    case 3:
      return <FacilityAvatar src={AlumniRoom} />
    case 4:
      return <FacilityAvatar src={Foyer} />
    case 5:
      return <FacilityAvatar src={Stage} />
    case 6:
      return <FacilityAvatar src={MainAreaCommHall} />
    case 7:
      return <FacilityAvatar src={BandRoom} />
    case 8:
      return <FacilityAvatar src={PoolAreaLL} />
    case 9:
      return <FacilityAvatar src={TVRoom} />
    case 10:
      return <FacilityAvatar src={MeetingRoomLL} />
    case 11:
      return <FacilityAvatar src={ConferenceRoomKFH} />
    case 12:
      return <FacilityAvatar src={HardCourt} />
    case 13:
      return <FacilityAvatar src={BasketballCourt} />
    case 14:
      return <FacilityAvatar src={Gym} />
    case 15:
      return <FacilityAvatar src={DanceStudio} />
    case 16:
      return <FacilityAvatar src={MainAreaCommHall} />
    default:
      return <FacilityAvatar src={DummyAvatar} />
  }
}
