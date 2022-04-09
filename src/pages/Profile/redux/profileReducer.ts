import { separatePatnAndName } from './../../../functions/separatePathAndName';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, Profile, AccountParams, LoginParams, ProfileMode, SetErrors, UpdateParams, ProfileInfoMode, SignInMode, UpdatedProfile, UploadFileParams } from '../types/types';
import { UserProps, LoadInfo, BackendlessError } from '../../../types/types';
import { createSelector } from 'reselect';
import { RootState } from '../../../redux/store';
import { cloudinary } from '../../../API/cloudinary/cloudinary';


// * initialState
const initialState: ProfileState = {
   profileInfo: {
      username: "",
      email: "",
      location: "",
      avatar: "./image/defaultAvatar.jpg",
      objectId: "",
      education: "",
      dateOfBirth: null,
   },
   profileMode: "signIn",
   profileInfoMode: "view",
   signInMode: "login",
   loadInfo: {
      loaded: false,
      loading: true,
      error: undefined,
      errorType: undefined,
   },
   errorTypes: [
      "login",
      "loginAsGuest",
      "createAccount",
      "emailConfirmation",
      "manyFailedLoginAttempts",
      "update",
      "uploadFile",
   ],
}


// * slice
const profileSlice = createSlice({
   name: 'profile',
   initialState,

   reducers: {
      setProfileMode: (state, action: PayloadAction<ProfileMode>) => {
         state.profileMode = action.payload
      },

      setProfileInfoMode: (state, action: PayloadAction<ProfileInfoMode>) => {
         state.profileInfoMode = action.payload
      },

      setSignInMode: (state, action: PayloadAction<SignInMode>) => {
         state.signInMode = action.payload
      },

      setLoadInfo: (state, action: PayloadAction<LoadInfo>) => {
         state.loadInfo = action.payload;
      },

      setErrors: (state, action: PayloadAction<SetErrors>) => {
         state.loadInfo.error = action.payload.error;
         state.loadInfo.errorType = action.payload.errorType;
      },

      resetProfileInfo: (state, action: PayloadAction<ProfileMode>) => {
         for (let key in state.profileInfo) {
            if (typeof state.profileInfo[key as keyof Profile] === 'string') {
               state.profileInfo = {
                  ...state.profileInfo,
                  [key as keyof Profile]: ""
               }
            } else if (typeof state.profileInfo[key as keyof Profile] === 'number') {
               state.profileInfo = {
                  ...state.profileInfo,
                  [key as keyof Profile]: null
               }
            }
            if (key === "avatar") state.profileInfo.avatar = state.profileInfo.avatar
         }
         state.profileMode = action.payload
      }
   },

   extraReducers: builder => {
      builder
         // ? loginAsGuest
         // ! PayloadAction<any>
         .addCase(loginAsGuest.fulfilled, (state, action: PayloadAction<any>) => {
            state.profileInfo.objectId = action.payload.objectId;
            state.profileMode = "loggedInAsGuest"
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? getProfileProps
         // ! PayloadAction<any>
         .addCase(getProfileProps.fulfilled, (state, action: PayloadAction<any>) => {
            if (action.payload.guestMode) {
               state.profileInfo.objectId = action.payload.profile.objectId
               state.profileMode = "loggedInAsGuest"
            } else if (action.payload.profile.objectId) {
               state.profileInfo = action.payload.profile
               state.profileMode = "loggedIn"
            } else {
               state.profileInfo.objectId = ""
               state.profileMode = "signIn"
            };
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? createAccount
         // ! PayloadAction<any>
         .addCase(createAccount.fulfilled, (state, action: PayloadAction<any>) => {
            state.profileMode = "signIn"
            state.signInMode = 'login'
            state.loadInfo.loading = false
            state.loadInfo.loaded = false
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? update
         // ! PayloadAction<any>
         .addCase(update.fulfilled, (state, action: PayloadAction<any>) => {
            if (action.payload) {
               state.profileInfo = action.payload
               state.profileInfoMode = "view"
            }
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? uploadFile
         .addCase(uploadFile.fulfilled, (state, action: PayloadAction<any>) => {
            state.profileInfo.avatar = action.payload;
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? login
         // ! PayloadAction<any>
         .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
            state.profileInfo = action.payload
            state.profileMode = "loggedIn"
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? logout
         // ! PayloadAction<any>
         .addCase(logout.fulfilled, (state, action: PayloadAction<any>) => {
            state.profileMode = "loggedOut"
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? passwordReset
         // ! PayloadAction<any>
         .addCase(passwordReset.fulfilled, (state, action: PayloadAction<any>) => {
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         // ? Pending, Error
         .addMatcher((action) => action.type.startsWith('profile/') && action.type.endsWith('/pending'),
            (state, action) => {
               state.loadInfo.loading = true
               state.loadInfo.loaded = false
            })
         .addMatcher((action) => action.type.startsWith('profile/') && action.type.endsWith('/rejected'),
            (state, action: BackendlessError) => {
               state.loadInfo.loading = false
               state.loadInfo.loaded = false
               state.loadInfo.error = action.payload
               console.log("action.payload: ", action.payload)
               if (action.payload === "Unable to login. User account is locked out due to too many failed logins.") {
                  state.loadInfo.errorType = "manyFailedLoginAttempts"
               } else if (action.payload === "User cannot login - email address must be confirmed first") {
                  state.loadInfo.errorType = "emailConfirmation"
               } else {
                  state.loadInfo.errorType = action.type.split("").slice(8, -9).join("")
               }
               console.log(state.loadInfo.errorType)
            })
   }
})


// * selectors
export const getProfileMode = createSelector(
   (state: RootState) => state.profile.profileMode,
   profileMode => profileMode
)

export const getProfileInfoMode = createSelector(
   (state: RootState) => state.profile.profileInfoMode,
   profileInfoMode => profileInfoMode
)

export const getSignInMode = createSelector(
   (state: RootState) => state.profile.signInMode,
   signInMode => signInMode
)

export const getLoadInfo = createSelector(
   (state: RootState) => state.profile.loadInfo,
   loadInfo => loadInfo
)

export const getProfileInfo = createSelector(
   (state: RootState) => state.profile.profileInfo,
   profileInfo => profileInfo
)

export const getErrorTypes = createSelector(
   (state: RootState) => state.profile.errorTypes,
   errorTypes => errorTypes
)

export const getObjectId = (state: RootState) => state.profile.profileInfo.objectId

export const getLoadingStatus = (state: RootState) => state.profile.loadInfo.loading



//* thunks
export const loginAsGuest = createAsyncThunk(
   "profile/loginAsGuest",
   async (stayLoggedIn: boolean, { rejectWithValue }) => {
      try {
         const response: any = stayLoggedIn
            ? await Backendless.UserService.loginAsGuest(stayLoggedIn)
            : await Backendless.UserService.loginAsGuest()
         return response
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const getProfileProps = createAsyncThunk(
   "profile/getProfileProps",
   async (_, { rejectWithValue }) => {
      try {
         const objectId = await Backendless.UserService.loggedInUser()
         const role: string[] = await Backendless.UserService.getUserRoles()

         if (role.includes("GuestUser", 0)) {
            return { profile: { objectId }, guestMode: true }
         } else if (objectId) {
            const profile: Profile = await Backendless.Data.of('Users').findById(`${objectId}`)
            const avatar = await fetch(`${profile.avatar}`)
            // console.log("profile.avatar: ", profile.avatar)
            if (!avatar.ok || !profile.avatar) {
               profile.avatar = "";
            }

            return { profile, guestMode: false }
         } else {
            return { profile: { objectId }, guestMode: false }
         }

      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const createAccount = createAsyncThunk(
   "profile/createAccount",
   async (accountParams: AccountParams, { rejectWithValue }) => {
      // При регистрации нового пользователя в объекте-аругменте метода register не должно
      // содержаться свойства ___class
      // Свойство objectId может существовать, если до этого был создан
      // гостевой аккаунт
      try {
         let registeredUser: Backendless.User | UserProps;

         if (accountParams.objectId) {
            const profile = new Backendless.User()
            profile.objectId = accountParams.objectId

            for (let key in accountParams.profileProps) {
               profile[key as keyof Backendless.User] = accountParams.profileProps[key]
            }

            registeredUser = await Backendless.UserService.register(profile)

         } else {
            registeredUser = await Backendless.UserService.register({ ...accountParams.profileProps })
         }

         return registeredUser
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const update = createAsyncThunk(
   "profile/update",
   async (updateParams: UpdateParams, { rejectWithValue, dispatch }) => {
      try {
         let mode: "changePassword" | "updateProfile" = "updateProfile"
         let profile: UpdatedProfile = {};
         for (let key in updateParams.profile) {
            profile[key] = updateParams.profile[key]
         }
         if (updateParams.profilePasswords) {
            mode = 'changePassword'
            for (let key in updateParams.profilePasswords) {
               profile[key] = updateParams.profilePasswords[key]
            }
         }
         const updatedProfile = await Backendless.UserService.update(profile)
         if (updatedProfile && updateParams.callback) {
            updateParams.callback()
         }
         if (mode === "updateProfile") {
            return updatedProfile
         } else {
            return undefined
         }
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const uploadFile = createAsyncThunk(
   "profile/uploadFile",
   async (uploadFileParams: UploadFileParams, { rejectWithValue }) => {
      try {
         if (uploadFileParams.typeOfFile !== "avatar") {
            throw Error("Wrong file type specified");
         }


         const response = await cloudinary.uploadImage(uploadFileParams.file, uploadFileParams.objectId)

         console.log("upload response: ", response)
         if (response && uploadFileParams.callback) {
            const avatar = separatePatnAndName(uploadFileParams.avatar)[1];
            cloudinary.deleteImage(avatar);

            uploadFileParams.callback();
            return response;
         } else {
            throw Error("Upload error")
         }

      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const login = createAsyncThunk(
   "profile/login",
   async (loginParams: LoginParams, { rejectWithValue }) => {
      try {
         const responce = await Backendless.UserService.login(loginParams.email, loginParams.password, loginParams.rememberMe);
         return responce;
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const logout = createAsyncThunk(
   "profile/logout",
   async (_, { rejectWithValue }) => {
      try {
         const responce = await Backendless.UserService.logout();
         return responce;
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message);
      }
   }
)

export const passwordReset = createAsyncThunk(
   "profile/passwordReset",
   async (loginParams: LoginParams, { rejectWithValue }) => {
      try {
         const response = Backendless.UserService.restorePassword(loginParams.email)
         return response
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message)
      }
   }
)


// * export slice
export const profileReducer = profileSlice.reducer
export const profileActions = profileSlice.actions