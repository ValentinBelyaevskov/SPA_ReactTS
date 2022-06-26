import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { profileReducer } from "../pages/Profile";
import {
   persistStore,
   persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { audioPlayerReducer } from "common/AudioPlayer/redux/audioPlayerReducer";


// store options
const profilePersistConfig = {
   key: 'profile',
   storage,
   whitelist: ['profileMode', 'profileInfoMode', 'signInMode', 'errorTypes'],
}

const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: ['friends', 'profile', 'audioPlayer'],
}

const rootReducer = combineReducers({
   profile: persistReducer(profilePersistConfig, profileReducer),
   audioPlayer: persistReducer(profilePersistConfig, audioPlayerReducer)
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)


// store
export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            ignoredPaths: ['friends.list', 'profile.profileInfo', 'profile.profileInfo.posts'],
            ignoredActionPaths: [
               'payload',
               'meta.arg.callback',
               'meta.arg.file',
               'meta.arg.files',
               'meta.arg.audios',
               `meta.arg.imagesAndVideos`,
               'profile.profileInfo.posts'
            ],
         },
      }),
})

export const persistor = persistStore(store);


// export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Persistor = typeof persistor;