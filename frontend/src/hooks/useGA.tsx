import { useEffect } from "react"
import ReactGA from 'react-ga4'
import { useLocation } from "react-router-dom"

// MEASUREMENT_ID is a palceholder for my account: G-EGD28SL69L
const MEASUREMENT_ID = 'G-EGD28SL69L'
ReactGA.initialize(MEASUREMENT_ID)
//testing
// ReactGA.ga('send','pageview','/#/login')
// ReactGA.ga('send','pageview','/login')
// ReactGA.ga('send','pageview','/register')
// ReactGA.ga('send','pageview','/#/register')

const usePageTracking = () => {
  const location = useLocation()
//   console.log("Tracking page: ")
//   console.log(location.pathname + location.search)
//   ReactGA.send(location.pathname + location.search)

  useEffect(() => {
    // track pageview with gtag / react-ga / react-ga4, for example:
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location])
}

// const usePageTracking = (props) => {
//   const pathname = props.match.path
//   let pageView = pathname
//   ReactGA.pageview(pageView)
//   console.log("Tracking page: ")
//   console.log(pageView)
// }
export default usePageTracking 