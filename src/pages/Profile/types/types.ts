import { LoadInfo, UserProps } from '../../../types/types';

export type ProfileState = {
   profileInfo: Profile
   profileMode: ProfileMode
   profileInfoMode: ProfileInfoMode
   signInMode: SignInMode
   loadInfo: LoadInfo
   errorTypes: string[]
}

export type Profile = {
   username: string
   email: string
   location: string
   avatar: string
   objectId: string
   password?: string
   education?: string
   dateOfBirth?: number | null
}

export type ProfileMode = "signIn"
   | "loggedOut"
   | "loggedIn"
   | "loggedInAsGuest"
   | "guestSignIn"

export type ProfileInfoMode = "view"
   | "edit"

export type SignInMode = "login"
   | "passwordReset"
   | "createAccount"
   | "loginAsGuest"

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
      dateOfBirth?: number | null
      [prop: string]: string | number | null | undefined
   },
   callback?: () => void
}

export type UpdatedProfile = {
   username?: string
   email?: string
   location?: string
   objectId?: string
   profileAvatar?: string
   education?: string
   dateOfBirth?: number | null
   [prop: string]: string | number | null | undefined
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