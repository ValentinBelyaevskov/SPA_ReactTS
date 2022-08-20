import { LoadInfo, UserProps, Entities, Ids } from '../../../types/types';

export type ProfileState = {
   profileInfo: Profile
   profilePageScroll: ProfilePageScroll
   profileMode: ProfileMode
   profileInfoMode: ProfileInfoMode
   signInMode: SignInMode
   loadInfo: LoadInfo
   postsLoadInfo: LoadInfo
   errorTypes: string[]
   uploadedPosts: {
      entities: Entities<Post>
      ids: Ids
   },
   files: {
      entities: Entities<File>
      ids: Ids
   }
}

export interface Profile {
   firstName: string
   lastName: string
   email: string
   country: string
   region: string
   city: string
   avatar: string
   objectId: string
   password?: string
   education?: string
   dateOfBirth?: string
   posts: string[]
}

export type ProfilePageScroll = [
   number,
   number
]

export type Post = {
   objectId: string
   innerHTML: string
   imagesAndVideos: ImagesAndVideosItem[]
   files: FilesItem[]
   audios: AudiosItem[]
   likes: string[]
   comments: string[]
   created: number
}

export type ProfileMode = "signIn"
   | "loggedOut"
   | "loggedIn"
   | "loggedInAsGuest"
   | "guestSignIn"

export type ProfileInfoMode = "pageView"
   | "showingAPopup" | "addingContent" | "contentChange"

export type SignInMode = "login"
   | "passwordReset"
   | "createAccount"
   | "loginAsGuest"
   | "emailConfirmation"

export type SignInParams = {
   accountExists: boolean,
   loginAsGuestMode: boolean,
}

export type AccountParams = {
   profileProps: UserProps
   objectId: string
}

export type UpdateParams = {
   profile: UpdatedProfile,
   profilePasswords?: {
      currentPassword: string
      newPassword: string
      education?: string
      dateOfBirth?: string
      posts?: Ids
      [prop: string]: string | number | null | undefined | string[]
   },
   callback?: () => void
}

export interface UpdatedProfile {
   firstName?: string
   lastName?: string
   email?: string
   country?: string
   region?: string
   city?: string
   avatar?: string
   objectId?: string
   password?: string
   education?: string
   dateOfBirth?: string
   posts?: Ids
   [prop: string]: string | number | null | undefined | string[]
}

export type CreateAccountArg = {
   accountParams: AccountParams
   callback: () => void
}

export type LoginParams = {
   email: string
   password: string
   rememberMe: boolean
}

export type LoginArg = {
   loginParams: LoginParams
   callback: () => void
}

export type LoginAsGuestArg = {
   stayLoggedIn: boolean
   callback: () => void
}

export type SetErrors = {
   error: string | undefined,
   errorType: string | undefined,
}

export type UploadFileParams = {
   file: File,
   typeOfFile: "avatar",
   callback?: () => void,
   objectId: string
   avatar: string
}

export type PostPayloadAction = {
   post: Post,
   userPosts: string[]
}

// ? create a post thunk
export type ImagesAndVideosItem = {
   type: "image" | "video"
   src?: string,
   file?: File,
   aspect?: number,
   area?: number,
   sizes?: [number, number]
}

export type FilesItem = {
   type: string
   name?: string
   src?: string
   file?: File
   size?: number
}

export type AudiosItem = {
   type: "audio",
   file?: File
   src: string
   name: string,
   size: number,
}

export type PostData = {
   profileId: string
   profilePosts: string[]
   innerHTML: string
   imagesAndVideos: ImagesAndVideosItem[]
   files: FilesItem[]
   audios: AudiosItem[]
}

export type PostObject = {
   userId: string,
   innerHTML: string,
   imagesAndVideos: ImagesAndVideosItem[],
   files: FilesItem[],
   audios: AudiosItem[],
   [key: string]: any
}
//       ?

export type GetPostsData = {
   objectId: string
   uploadedPostIdsLength: number,
   allPostIdsLength: number,
}

export type DeletePostData = {
   callback: () => void
   postId: string
   profileId: string
   allPostIds: string[]
}

export type ClickResult = "like" | "cancelLike"

export type LikeAPostData = {
   callback: () => void
   clickResult: ClickResult
   likes: string[]
   profileId: string
   postId: string
}