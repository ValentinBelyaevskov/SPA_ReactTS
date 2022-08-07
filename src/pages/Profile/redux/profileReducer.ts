import { separatePatnAndName } from './../../../functions/separatePathAndName';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, Profile, AccountParams, LoginParams, ProfileMode, SetErrors, UpdateParams, ProfileInfoMode, SignInMode, UpdatedProfile, UploadFileParams, PostData, PostPayloadAction, Post, ImagesAndVideosItem, AudiosItem, FilesItem, PostObject } from '../types/types';
import { UserProps, LoadInfo, BackendlessError } from '../../../types/types';
import { createSelector } from 'reselect';
import { RootState } from '../../../redux/store';
import { remoteFileStorage } from 'API/uploadFiles/remoteFileStorage';




const initialState: ProfileState = {
   profileInfo: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      region: "",
      city: "",
      avatar: "./image/defaultAvatar.jpg",
      objectId: "",
      education: "",
      dateOfBirth: undefined,
   },
   posts: {
      entities: {},
      ids: [],
   },
   files: {
      entities: {},
      ids: [],
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
      "uploadAvatar",
      "getProfileProps",
   ],
}




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
         .addCase(loginAsGuest.fulfilled, (state, action) => {
            state.profileInfo.objectId = action.payload.objectId;
            state.profileMode = "loggedInAsGuest"
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(getProfileProps.fulfilled, (state, action) => {
            if (action.payload.guestMode && action.payload.profile && action.payload.profile.objectId) {
               state.profileInfo.objectId = action.payload.profile.objectId
               state.profileMode = "loggedInAsGuest"
            } else if (action.payload.profile && action.payload.profile.objectId) {
               state.profileInfo = action.payload.profile as Profile
               state.profileMode = "loggedIn"
            } else {
               state.profileInfo.objectId = ""
               state.profileMode = "signIn"
            };

            if (action.payload.posts) {
               action.payload.posts.forEach(post => {
                  state.posts.entities[post.objectId] = post;
                  state.posts.ids.push(post.objectId);
               });
            }

            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(createAccount.fulfilled, (state, action) => {
            state.profileMode = "signIn"
            state.signInMode = 'login'
            state.loadInfo.loading = false
            state.loadInfo.loaded = false
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(update.fulfilled, (state, action) => {
            if (action.payload) {
               if (action.payload) {
                  state.profileInfo = {
                     ...state,
                     ...action.payload as Profile
                  }
               }
               state.profileInfoMode = "view"
            }
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(uploadAvatar.fulfilled, (state, action) => {
            state.profileInfo = { ...state.profileInfo, avatar: action.payload };
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(login.fulfilled, (state, action) => {
            state.profileInfo = {
               ...state,
               ...action.payload
            }
            state.profileMode = "loggedIn"
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(logout.fulfilled, (state, action) => {
            state.profileMode = "loggedOut"
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(passwordReset.fulfilled, (state, action) => {
            state.loadInfo.loading = false
            state.loadInfo.loaded = true
            state.loadInfo.error = undefined
            state.loadInfo.errorType = undefined
         })
         .addCase(createAPost.fulfilled, (state, action) => {
            console.log("createAPost responce: ", action.payload);
            state.posts.entities[action.payload.objectId] = action.payload;
            state.posts.ids.unshift(action.payload.objectId);

            state.profileInfoMode = "view"
            state.loadInfo.loading = false;
            state.loadInfo.loaded = true;
            state.loadInfo.error = undefined;
            state.loadInfo.errorType = undefined;
         })
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

export const getSignInMode = (state: RootState) => state.profile.signInMode;

export const getProfileInfoMode = (state: RootState) => state.profile.profileInfoMode;

export const getProfileMode = (state: RootState) => state.profile.profileMode;

export const getObjectId = (state: RootState) => state.profile.profileInfo.objectId

export const getLoadingStatus = (state: RootState) => state.profile.loadInfo.loading

export const getPostIds = (state: RootState) => state.profile.posts.ids

export const getPostEntities = (state: RootState) => state.profile.posts.entities



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
         const objectId = await (await Backendless.UserService.getCurrentUser()).objectId;

         const role: string[] = await Backendless.UserService.getUserRoles();

         if (role.includes("GuestUser", 0)) {
            return { profile: { objectId }, guestMode: true }
         } else if (objectId) {
            const profile: Profile = await Backendless.Data.of('Users').findById(`${objectId}`)
            const avatar = await fetch(`${profile.avatar}`)

            if (!avatar.ok || !profile.avatar) {
               profile.avatar = "";
            }

            const postQuery = await Backendless.DataQueryBuilder.create()
               .setSortBy(["created"])
               .setWhereClause(`userId = '${objectId}'`);

            const posts: Post[] = await Backendless.Data.of("Posts").find(postQuery);

            return { profile, guestMode: false, posts: posts.reverse() }

         } else {
            return { profile: undefined, guestMode: false }
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
   async (updateParams: UpdateParams, { rejectWithValue }) => {
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

         const updatedProfile = await Backendless.UserService.update(profile);

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

export const uploadAvatar = createAsyncThunk(
   "profile/uploadAvatar",
   async (uploadFileParams: UploadFileParams, { rejectWithValue }) => {
      try {
         if (uploadFileParams.typeOfFile !== "avatar") {
            throw Error("Wrong file type specified");
         }

         const response = await remoteFileStorage.uploadAvatar(uploadFileParams.file, uploadFileParams.objectId)

         if (response && uploadFileParams.callback) {
            const avatar = separatePatnAndName(uploadFileParams.avatar)[1];

            if (uploadFileParams.typeOfFile) {
               await remoteFileStorage.deleteFiles([avatar]);
            }

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
         const responce: Profile = await Backendless.UserService.login(loginParams.email, loginParams.password, loginParams.rememberMe);
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
         const response = Backendless.UserService.restorePassword(loginParams.email);
         return response;
      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message)
      }
   }
)

export const createAPost = createAsyncThunk(
   "profile/createAPost",
   async (postData: PostData, { rejectWithValue }) => {
      try {
         const getPostObject = async (
            userId: string,
            innerHTML: string,
            imagesAndVideos: ImagesAndVideosItem[],
            audios: AudiosItem[],
            files: FilesItem[],
         ): Promise<PostObject> => {

            console.log("files: ", files)

            const fileUrls = await Promise.all(
               files
                  .map(item => item.file!)
                  .map(async file => {
                     const newFile = new File(
                        [file],
                        `${new Date().getTime()}${file.name}`,
                        { type: file.type }
                     );

                     const responce = await Backendless.Files.upload(newFile, 'files', false);

                     return responce.fileURL;
                  })
            );

            const audioUrls = await remoteFileStorage.uploadAudios(audios.map(item => item.file!));
            const imagesAndVideosUrls = await remoteFileStorage.uploadImagesAndVideos(imagesAndVideos.map(item => item.file!));



            return {
               userId,
               innerHTML: innerHTML ? innerHTML : "",
               imagesAndVideos: imagesAndVideosUrls.map((src, index) => (
                  {
                     src,
                     area: imagesAndVideos[index].area,
                     aspect: imagesAndVideos[index].aspect,
                     sizes: imagesAndVideos[index].sizes,
                     type: imagesAndVideos[index].type,
                  }
               )),
               audios: audioUrls.map((src, index) => ({
                  src,
                  name: audios[index].name,
                  size: audios[index].size,
                  type: audios[index].type,
               })),
               files: fileUrls.map((src, index) => ({
                  src,
                  name: files[index].name,
                  size: files[index].size,
                  type: files[index].type,
               })),
            }
         }



         const postObject = await getPostObject(
            postData.profileId,
            postData.innerHTML,
            postData.imagesAndVideos,
            postData.audios,
            postData.files,
         );

         const jsonPostObject: { [key: string]: any } = {}

         for (let key in postObject) {
            if (key === "imagesAndVideos" || key === "audios" || key === "files") {
               jsonPostObject[key] = JSON.stringify(postObject[key]);
            } else {
               jsonPostObject[key] = postObject[key];
            }
         }

         const post: Post = await Backendless.Data.of("Posts").save<Post>(postObject);


         await Backendless.UserService.update({
            objectId: postData.profileId,
            posts: [...postData.profilePosts, post.objectId]
         });



         return post;

      } catch (err: any) {
         console.log(err);
         return rejectWithValue(err.message)
      }
   }
)




export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;