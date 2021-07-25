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
- **setFoodStates** <br>
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
- **setFoodState** <br>
  Input: `Food | undefined` <br>
  Variable updated: `food`

## Level 1 Functions

Direct connection with backend.

### GET

Get Object from backend.

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
  Get Supper Groups created by the user from `/user/:userId/supperGroupHistory.` <br>
  Input: `userId: string` <br>
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

### PUT

Edit Object in backend.

- **updateSupperGroup** <br>
  Update Supper Group at `/supper/:supperGroupId`. <br>
  Input: `supperGroupId: string | number | undefined, updatedInfo: any` <br>
  Used in: OrderSummary, DeliveryDetails, EditSupperGroup
- **emptyOrderFoodList** <br>
  Empty order foodlist at `/order/:orderId`. <br>
  Input: `supperGroupId: string, orderId: string`
- **updateOrderDetails** <br>
  Update order details at `/order/:orderId`. <br>
  Input: `orderId: string, newOrderDetails: any` <br>
  Used in: ConfirmOrder, UserView (ViewOrder)
- **updateFoodInOrder** <br>
  Update food in order at `/order/:orderId/food/:foodId`. <br>
  Input: `newFood: any, orderId: string, foodId: string` <br>
  Used in: EditFoodItem
- **updateOwnerEdits** <br>
  Update owner edits at `/supperGroup/:supperGroupId/owner` <br>
  Input: `supperGroupId: number | undefined, foodId: string | undefined, updates: Updates, forAll: boolean`

### POST

Create Object in backend.

- **createSupperGroup** <br>
  Create Supper Group at `/supperGroup`. <br>
  Input: `newSupperGroup: SupperGroup` <br>
  Used in: Page3 of CreateSupperGroup
- **createOrder** <br>
  Create order at `/order`. <br>
  Input:`supperGroupId: string | number` <br>
  Used in: JoinOrder, Page3 of CreateOrder
- **addFoodToOrder**
  Add food to order at `/order/:orderId/food`. <br>
  Input: `newFood: Food, orderId: string` <br>
  Used in: AddFoodItem

### Delete

Remove Object from backend.

- **closeSupperNotification** <br>
  Close supper notification through `/user/:userId/supperGroupNotification/:supperGroupId`. <br>
  Input: `supperGroupId: number`
- **deleteSupperGroup** <br>
  Delete supper group through `supperGroup/:supperGroupId`. <br>
  Input: `supperGroupId: string|number|undefined`
- **deleteOrder** - to be removed <br>
  Delete order through `/order/:orderId`.
  Input: `supperGroupId: string | number, orderId: string | undefined` <br>
- **deleteFoodInOrder** <br>
  Delete food in order through `/order/:orderId/foood/:foodId`. <br>
  Input: `orderId: string |undefined, foodId: string | undefined`
- **leaveSupperGroup** <br>
  Remove user from supper group through `/supperGroup/:supperGroupId/user/:userId`. <br>
  Input: `supperGroupId: string | number | undefined`

## Level 2 Functions

Get information for pages.

- **getPlaceOrderPageDetails** <br>
  Get details for Order Page. <br>
  Input: `supperGroupId: string, restaurantId: string` <br>
  Actions used: `getSupperGroupById`, `getRestaurant`, `getUserOrder` and `setOrderId`<br>
  Files: `/PlaceOrder`

- **getOrderSummaryPageDetails** <br>
  Get details for Order Summary Page. <br>
  Input: `supperGroupId: string` <br>
  Actions used: `getCollatedOrder` and `getSupperGroupById` <br>
  Files: `/OrderSummary`

- **getUpdateItemPageDetails** <br>
  Get details for Update Item Page. <br>
  Input: `supperGroupId: string, orderId: string, foodId: string` <br>
  Actions used: `getSupperGroupById` and `getFoodInOrder` <br>
  Files: `/OrderSummary/UpdateItem`

- **getUpdateAllItemsPageDetails** <br>
  Get details for Update All Items Page. <br>
  Input: `supperGroupId: string, foodId: string` <br>
  Actions used: `getCollatedOrder` and `setFoodState` <br>
  Files: `/OrderSummary/UpdateAllItems`

- **getGroupHistoryPageDetails** <br>
  Get details for Group History Page. <br>
  Input: - <br>
  Actions used: `getCreatedSupperHistory` and `getJoinedSupperHistory` <br>
  Files: `/GroupHistory`

- **getJoinOrderPageDetails** <br>
  Get details for Join Group Page. <br>
  Input: - <br>
  Actions used: `getSupperGroupById` <br>
  Files: `/JoinGroup`

- **getSupperHomePageDetails** <br>
  Get details for Supper Home Page. <br>
  Input: - <br>
  Actions used: `getAllSupperGroups` <br>
  Files: `/`
