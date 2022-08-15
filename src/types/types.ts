import React from 'react';


// * normalization
export interface Entities<T> {
   [key: string]: T
}

export type Ids = string[]
// *


export type LoadInfo = {
   loaded: boolean
   loading: boolean
   error: string | undefined
   errorType: string | undefined
}

export type UserProps = {
   firstName: string
   lastName: string
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

export type AppStyle = {
   overflow?: "hidden" | "auto"
   height?: string,
   marginTop?: string,
}

export type PopupSwitcherIcon = "./icons/hide.svg" | "./icons/burger.svg";

export type PopupStyle = { display?: "none" }

export type PopupCtxt = {
   popupName?: string,
   setPopupName?:  React.Dispatch<React.SetStateAction<string | undefined>>,
   setPopup?:  React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
}

export type PopupControlsCtxt = {
   popupLoaded?: boolean
   popupStyle?: PopupStyle
   icon?: PopupSwitcherIcon
   setIcon?: React.Dispatch<React.SetStateAction<PopupSwitcherIcon>>
   needToShowPopup?: boolean
   setNeedToShowPopup?: React.Dispatch<React.SetStateAction<boolean>>
   needToShowBackground?: boolean
   setNeedToShowBackground?: React.Dispatch<React.SetStateAction<boolean>>
   setPopupLoaded?: React.Dispatch<React.SetStateAction<boolean>>
}

export type ShowPopupCtxt = {
   appRef?: React.RefObject<HTMLDivElement>
   pagesContainerRef?: React.RefObject<HTMLDivElement>
}

export type WindowSize = [number, number]

export type AppCtxt = {
   profileContentLoading?: boolean
   setShowAudioPlayer?: React.Dispatch<React.SetStateAction<boolean>>
   setProfileContentLoading?: React.Dispatch<React.SetStateAction<boolean>>
   setProfileInfoLoading?: React.Dispatch<React.SetStateAction<boolean>>
   setProfileWallLoading?: React.Dispatch<React.SetStateAction<boolean>>
}