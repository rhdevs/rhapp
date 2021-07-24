# Actions

## Update / Retrieve Store Variables

### Getter

Functions that retrieve store variables.

### Setter

Functions that update store variables.

- **setIsLoading** <br>
  Input: `boolean` <br>
  Variable updated: `isLoading`
- **setFilteredSupperGroups** <br>
  Filter Supper Groups in SupperHome Page. <br>
  Variable updated: `filteredSupperGroups`
- **setCount** <br>
  Input: `number`
  Variable updated: `count`
- **setPriceLimit** <br>
  Input: `number` <br>
  Variable updated: `priceLimit`
- **setDeliveryTime** <br>
  Input: `number`<br>
  Variable updated: `deliveryTime`
- **setSelectedPaymentMethod** <br>
  Input: `PaymentMethod[]` <br>
  Variable updated: `selectedPaymentMethod` <br>
  Used in: EditSupperGroup
- **setSelectedRestaurant** <br>
  Input: `string` <br>
  Variable updated: `selectedRestaurant`
- **setSelectedSupperGroupStatus** <br>
  Input: `SupperGroupStatus | null` <br>
  Variable updated: `selectedSupperGroupStatus` <br>
  Used in: ViewOrder
- **setSearchValue** <br>
  Input: `string` <br>
  Variable updated: `searchValue` <br>
  Used in: PlaceOrder
- **setSupperGroup** <br>
  Input: `SupperGroup` <br>
  Variable updated: `supperGroup` <br>
  Used in: Page1, Page2, Page3 and index of CreateSupperGroup
- **setMenuTabKey** <br>
  Input: `string` <br>
  Variable updated: `menuTabKey` <br>
- **setExpandAll** <br>
  Input: `boolean` <br>
  Variable updated: `isExpandAll`
- **setPaymentExpandedCount** <br>
  Input: `number` <br>
  Variable updated: `expandedCount`
- **setEstimatedArrivalTime** <br>
  Input: `number` <br>
  Variable updated: `estArrivalTime` <br>
  Used in: DeliveryDetails
- **setEditOrderNumber** <br>
  Input: `number` <br>
  Variable updated: `editOrderNumber` <br>
  Used in: EditSupperGroup
- **setCounter** <br>
  Input: `number` <br>
  Variable updated: `counter` <br>
  Used in: Page3 of CreateSupperGroup
- **resetFoodStates** <br>
  Sets variable as null. <br>
  Variable updated: `food` <br>
  Used in: EditFoodItems
- **setOrderId** <br>
  Input: `string | undefined` <br>
  Variable updated: `orderId`
- **\*setPaymentUpdateArray (might delete)** <br>
  Input: `orderId: string, hasReceived: boolean` <br>
  Variable updated: `paymentUpdateArray`
- **setNewSupperGroupId** <br>
  Input: `number` <br>
  Variable updated:`newSupperGroupId`
- **setIsFoodMenuModalOpen** <br>
  Input: `boolean` <br>
  Variable updated:`isFoodMenuModalOpen` <br>
  Used in: PlaceOrder
- **setFoodModalInfo** <br>
  Input: `foodMenuModalId: string, modalMenuFoodName: string` <br>
  Variable updated:`foodMenuModalId, modalMenuFoodName`
- **setClosingTimeFilter** <br>
  Input: `Filter` <br>
  Variable updated: `closingTimeFilter`
- **setAmountLeftFilter** <br>
  Input: `Filter` <br>
  Variable updated: `amountLeftFilter`
- **setRestaurantFilter** <br>
  Input: `Restaurants[]` <br>
  Variable updated: `restaurantFilter`
- **setSupperErrorMessage** <br>
  Input: `string` <br>
  Variable updated: `supperErrorMessage`

## Level 1 Functions

Direct connection with backend.

### GET

- **getSupperNotification** <br>
  Get an array of supper notifications from `/user/:userId/supperGroupNotification`.
- **getAllSupperGroups** <br>
  Get all supper group from `/supperGroup`.
  Used in: SupperHome
- **getSupperGroupById** <br>
  Get supper group from `/supperGroup/:SupperGroupId`. <br>
  Input: `string | number | undefined` <br>
  Used in: UpdateItem, UpdateDelivery, UpdateAllItems, JoinOrder, OrderSummary, ViewOrder, DeliveryDetails, EditSupperGroup, AddFoodItem, ConfirmOrder, ViewCart
- **getCreatedSupperHistory** <br>
  Get Supper Groups created by the user from `/user/:userId/supperGroupHistory. <br> Input: `userId: string` <br>
  Used in: GroupHistory
- **getOrderById** <br>
  Get order from `/order/:orderId`. <br>
  Input: `orderId: string | undefined`
- **getRestaurantMenu** <br>
  Get restaurant with menu from `/restaurant/:restaurantId/menu` <br>
  Input: `restaurantId:string` <br>
  Used in: PlaceOrder
- **getFoodMenu** <br>
  Get food in menu from `/restaurant/food/:foodMenuId`. <br>
  Input: `foodId: string` <br>
  Used in: AddFoodItem
- **getFoodInOrder** <br>
  Get food in order from `/order/:orderId/:food/:foodId`. <br>
  Input: `orderId: string | undefined, foodId: string | undefined` <br>
  Used in: UpdateItem, EditFoodItem
- **getCollatedOrder** <br>
  Get collated order from `/supperGroup/:supperGroupId/collated`. <br>
  Input: `supperGroupId: string | number | undefined` <br>
  Used in: OrderSummary, ViewOrder, ViewCard
- **getUserOrder** <br>
  Get user's order from `/supperGroup/:supperGroupId/user/:userId`. <br>
  Input: `supperGroupId: string | number | undefined` <br>
  Used in: ViewOrder, ViewCart, ConfirmOrder
- **getJoinedSupperHistory** <br>
  Get Supper Groups created by the user from `/user/:userId/joinGroupHistory`. <br>
  Used in: GroupHistory

### SET

### POST/PUT

- updateSupperGroupPaymentStatus

## Level 2 Functions

- More abstract
- pages
