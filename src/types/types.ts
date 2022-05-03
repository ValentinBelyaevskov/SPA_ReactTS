import React from 'react';
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

export type AppStyle = {
   overflow?: "hidden" | "auto"
   height?: string,
   marginTop?: string,
}

export type PopupSwitcherIcon = "./icons/hide.svg" | "./icons/burger.svg";

export type PopupStyle = { display?: "none" }

export type PopupCtxt = {
   needToShowPopup?: boolean
   setNeedToShowPopup?: React.Dispatch<React.SetStateAction<boolean>>
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
   popupSwitcherlickListener?: (needToShowPopup: boolean) => void
}

export type ShowPopupCtxt = {
   appRef?: React.RefObject<HTMLDivElement>
   pagesContainerRef?: React.RefObject<HTMLDivElement>
}

export type WindowSize = [number, number]

export type AppCtxt = {
   appRef?: React.RefObject<HTMLDivElement>
   pageRef?: React.RefObject<HTMLDivElement>
   pagePartRef?: React.RefObject<HTMLDivElement>
   showPreloader?: boolean
   setShowPreloader?: React.Dispatch<React.SetStateAction<boolean>>
}