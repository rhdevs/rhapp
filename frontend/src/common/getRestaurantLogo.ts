import McDonald from '../assets/supper/restaurantLogos/McDonald.svg'
import Alamaan from '../assets/supper/restaurantLogos/Alamaan.svg'
import Kimly from '../assets/supper/restaurantLogos/Kimly.svg'
import notFound from '../assets/notFound.svg'
import { Restaurants } from '../store/supper/types'

export const getRestaurantLogo = (restaurant?: Restaurants) => {
  if (restaurant === Restaurants.MCDONALDS) {
    return McDonald
  } else if (restaurant === Restaurants.ALAMAANS) {
    return Alamaan
  } else if (restaurant === Restaurants.KIMLYDIMSUM) {
    return Kimly
  } else {
    return notFound
  }
}
