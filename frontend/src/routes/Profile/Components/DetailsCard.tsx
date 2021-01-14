// import React from 'react'
export {}
// import { Card } from 'antd'
// import { RootState } from '../../../store/types'
// import { useDispatch, useSelector } from 'react-redux'
// import 'antd/dist/antd.css'
// import { useEffect } from 'react'
// import { fetchUserDetails } from '../../../store/profile/action'
// import { User } from '../../../store/profile/types'

// const DetailsCard = (props: User) => {
//   const dispatch = useDispatch()
//   // const { user } = useSelector((state: RootState) => state.profile)

//   useEffect(() => {
//     dispatch(fetchUserDetails())
//     //TODO: change to comparing userId with user.id
//     // isOwnProfile  => user.Id === myId (myId will be fetched via whatever backend or session storage,)
//   }, [dispatch])

//   const CCAItem = () => {
//     return (
//       <div className="site-card-border-less-wrapper">
//         <Card
//           title={<span style={{ fontSize: '20px' }}>CCAs</span>}
//           bordered={false}
//           style={{ width: '80vw' }}
//           size={'small'}
//         >
//           {props.cca.map((individualCCA) => {
//             return (
//               // eslint-disable-next-line react/jsx-key
//               <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>
//                 {individualCCA.ccaName}
//               </span>
//             )
//           })}
//         </Card>
//       </div>
//     )
//   }

//   const ModulesItem = () => {
//     return (
//       <div className="site-card-border-less-wrapper">
//         <Card
//           title={<span style={{ fontSize: '20px' }}>Modules</span>}
//           bordered={false}
//           style={{ width: '80vw' }}
//           size={'small'}
//         >
//           {user.modules.map((module) => {
//             return (
//               // eslint-disable-next-line react/jsx-key
//               <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>{module}</span>
//             )
//           })}
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <>
//       <CCAItem />
//       <ModulesItem />
//     </>
//   )
// }

// export default DetailsCard
