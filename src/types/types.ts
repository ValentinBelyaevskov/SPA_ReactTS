export type LoadInfo = {
   loaded: boolean
   loading: boolean
   error: string | undefined
   errorType: string | undefined
}

export type UserProps = {
   username: string
   email: string
   location: string
   password: string
   [prop: string]: string
}

export type BackendlessError = {
   error: { [propName: string]: string }
   meta: Object
   payload: string | undefined
   type: string
}