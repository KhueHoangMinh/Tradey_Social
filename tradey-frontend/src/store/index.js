import {configureStore} from '@reduxjs/toolkit'
import authSlice from './auth-slice'
import displayItemsSlice from './displayitem-slice'

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        displayItems: displayItemsSlice.reducer
    }
})

export default store