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

export type BurgerIcon = "./icons/hide.svg" | "./icons/burger.svg";

export type ControlsStyle = { display?: "none" }

export type ControlsCtxt = {
   icon?: BurgerIcon
   setIcon?: React.Dispatch<React.SetStateAction<BurgerIcon>>
   controlsLoaded?: boolean
   setControlsLoaded?: React.Dispatch<React.SetStateAction<boolean>>
   needToShowControls?: boolean
   setNeedToShowControls?: React.Dispatch<React.SetStateAction<boolean>>
   controlsStyle?: ControlsStyle
   burgerIconClickListener?: (needToShowControls: boolean) => void
}

export type ShowPopupContext = {
   appRef?: React.RefObject<HTMLDivElement>
   pagesRef?: React.RefObject<HTMLDivElement>
}