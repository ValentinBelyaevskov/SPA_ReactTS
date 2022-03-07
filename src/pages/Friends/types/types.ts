// types
export type StatusType = boolean | null;
export type FriendsData = User[];

// interfaces
export interface GetFriendsResponce {
   data: FriendsData,
}

export interface User {
   username: string,
   email: string,
   objectId:  string | undefined,
}

export interface FriendsState {
   list: FriendsData,
   loaded: StatusType,
   loading: StatusType,
   error: string | unknown,
   errorType: string | unknown,
}

export interface Success {
   result: User[]
}

export interface Fail {
   error: string | unknown,
   errorType: string | unknown,
}

export interface UpdadeUser {
   user: User,
   callback: () => void
}