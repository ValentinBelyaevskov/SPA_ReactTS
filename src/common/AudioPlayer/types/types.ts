import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { ConfigForAdaptability } from 'common/NotVisibleParameterValue/useSetParameterSize';
import { AppDispatch } from 'redux/store';


export type AudioElementsCtxt = {
   refs?: React.RefObject<HTMLAudioElement>[]
}

export type AudioFile = {
   type: "audio"
   src: string
   name: string
   size: number
}

export type PlayerMode = "thumbnail" | "full"

export type ThumbnailStyle = {
   [key: string]: string
}

export type ThumbnailMode = {
   needBoxShadow?: boolean
   showFullPlayer?: boolean
   style?: ThumbnailStyle
}

export type FullStyle = {
   [key: string]: string
}

export type FullMode = {
   needBoxShadow?: boolean
   playerShouldBeSmallWidth?: boolean
   style?: FullStyle
   maxSizeForSmallWidthPlayer?: number
}

export type PlaylistItem = {
   tickerResizeCheckpoints?: [(number | undefined), (number | undefined), (number | undefined), (number | undefined)]
}

export type VolumeSliderProps = {
   volumeSliderChangeListener: (value: number) => void
   getCurrentVolume: () => void
}

export type TrackSliderProps = {
   percentageCanBeChanged: boolean
   trackPercentage: number
   duration: string
   currentTime: string
}

export type Thumbnail = {
   needBoxShadow: boolean,
   showFullPlayer: boolean,
   style: {
      [key: string]: string
   }
}



export type PlayerWindowWidth = 750 | 950

export type CommonVolumeSliderProps = {
   prevVolumePercentage: number | undefined
   volumePercentage: number
   soundTogglerValue: boolean
}

export type CommonTrackSliderProps = {
   playbackRate: 1 | 2
}


export type PlayerName = "popup" | "general"

export type ActionPlayerState = {
   showAudioPlayer?: boolean
   audioUploaded?: boolean
   itemIndex?: number
   showPlaylist?: boolean
   isPlaying?: boolean
   trackSliderProps?: TrackSliderProps
   [key: string]: boolean | number | TrackSliderProps | VolumeSliderProps | Thumbnail | undefined
}

export type PlayerState = {
   windowSize: [number, number]
   showAudioPlayer: boolean
   audioUploaded: boolean
   showPlaylist: boolean
   isPlaying: boolean
   playlistLoaded: boolean
   activeTrackId: number
   trackSliderProps: TrackSliderProps
}


export type PlayerConfig = {
   adaptToWindowSize: boolean
   activeTrackId: number
   isPlaying: boolean
   showAudioPlayer: boolean
   mode: PlayerMode
   full?: FullMode
   thumbnail?: ThumbnailMode
   playerWindowWidth: PlayerWindowWidth
   trackNameAdaptability: ConfigForAdaptability
   tickerResizeCheckpoints?: number[]
   animatedOpacity?: boolean
   trackNamesBreakPoint?: number
   mobileBreakPoint?: number | undefined
}

export type AudioFiles = {
   [key: number]: AudioFile
}

export interface Player {
   status: boolean
   state: PlayerState
   config: PlayerConfig
   audioFiles: AudioFiles
   audioFileIds: number[]
}

export interface GeneralPlayer extends Player {
   context: string | undefined
}

export type AudioPlayerState = {
   playerNames: PlayerName[]
   players: {
      popup: Player,
      general: GeneralPlayer
      [key: string]: Player | GeneralPlayer
   }
   commonVolumeSliderProps: CommonVolumeSliderProps
   commonTrackSliderProps: CommonTrackSliderProps
}


export type SwitchToNextTrack = (
   dispatch: AppDispatch,
   audioFiles: AudioFile[],
   itemIndex: number,
   setItemIndex: ActionCreatorWithPayload<number>,
   setIsPlaying: ActionCreatorWithPayload<boolean>
) => void

export type AudioPlayerFunctions = {
   switchToNextTrack?: SwitchToNextTrack
}


// * actions
export type PlayerStatusAction = {
   name: PlayerName
   status: boolean
}

export type PlayerConfigAction = {
   name: PlayerName
   playerConfig: PlayerConfig
}

export type PlayerStateAction = {
   name: PlayerName
   playerState: PlayerState
}

export type WindowSizeAction = {
   name: PlayerName,
   windowSize: [number, number]
}

export type ShowAudioPlayerAction = {
   name: PlayerName,
   showAudioPlayer: boolean
}

export type AudioUploadedAction = {
   name: PlayerName,
   audioUploaded: boolean
}

export type ItemIdAction = {
   name: PlayerName,
   itemId: number
}

export type ShowPlaylistAction = {
   name: PlayerName,
   showPlaylist: boolean
}

export type IsPlayingAction = {
   name: PlayerName,
   isPlaying: boolean
}

export type PlaylistLoadedAction = {
   name: PlayerName,
   playlistLoaded: boolean
}

export type ActiveTrackIdAction = {
   name: PlayerName,
   activeTrackId: number
}

export type TrackSliderPropsAction = {
   name: PlayerName
   trackSliderProps: TrackSliderProps
}

export type AudioFilesAction = {
   name: PlayerName
   audioFiles: AudioFile[]
}

export type AddAudioFileAction = {
   name: PlayerName
   file: AudioFile
}

export type RemoveAudioFileAction = {
   name: PlayerName
   id: number
}

// * context

export type AudioPlayerCtxt = {
   setPopupAudioElement?: React.Dispatch<React.SetStateAction<HTMLAudioElement | undefined>>
   setGeneralAudioElement?: React.Dispatch<React.SetStateAction<HTMLAudioElement | undefined>>
   getPlayerElement?: (playerName: PlayerName) => (HTMLAudioElement | undefined)
   showPlayerOnPlayBtnClick?: boolean
   setShowPlayerOnPlayBtnClick?: React.Dispatch<React.SetStateAction<boolean>>
}