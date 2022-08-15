import { ActiveTrackIdAction, AddAudioFileAction, AudioFiles, AudioFilesAction, ItemIdAction, RemoveAudioFileAction, WindowSizeAction } from './../types/types';
import { AudioPlayerState, AudioUploadedAction, CommonTrackSliderProps, CommonVolumeSliderProps, IsPlayingAction, PlayerConfigAction, PlayerName, PlayerState, PlayerStateAction, PlayerStatusAction, PlaylistLoadedAction, ShowAudioPlayerAction, ShowPlaylistAction, ThumbnailMode, TrackSliderProps, TrackSliderPropsAction } from '../types/types';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';




const initialState: AudioPlayerState = {
   playerNames: ["popup", "general"],
   players: {
      popup: {
         status: false,
         state: {
            windowSize: [1280, 980],
            showAudioPlayer: false,
            audioUploaded: false,
            showPlaylist: false,
            isPlaying: false,
            playlistLoaded: false,
            activeTrackId: 0,
            trackSliderProps: {
               percentageCanBeChanged: true,
               trackPercentage: 0,
               duration: "00m 00s",
               currentTime: "00m 00s",
            },
         },
         config: {
            adaptToWindowSize: true,
            activeTrackId: 0,
            isPlaying: false,
            showAudioPlayer: false,
            mode: "full",
            full: {
               needBoxShadow: true,
               playerShouldBeSmallWidth: false,
               style: {},
            },
            thumbnail: {
               needBoxShadow: true,
               showFullPlayer: false,
               style: {}
            },
            playerWindowWidth: 950,
            trackNameAdaptability: [[525, undefined, 425, 35]],
            tickerResizeCheckpoints: undefined,
         },
         audioFiles: {},
         audioFileIds: [],
      },

      general: {
         status: false,
         context: undefined,
         state: {
            windowSize: [1280, 980],
            showAudioPlayer: false,
            audioUploaded: false,
            showPlaylist: false,
            isPlaying: false,
            playlistLoaded: false,
            activeTrackId: 0,
            trackSliderProps: {
               percentageCanBeChanged: true,
               trackPercentage: 0,
               duration: "00m 00s",
               currentTime: "00m 00s",
            },
         },
         config: {
            adaptToWindowSize: true,
            activeTrackId: 0,
            isPlaying: false,
            showAudioPlayer: false,
            mode: "full",
            full: {
               needBoxShadow: true,
               playerShouldBeSmallWidth: false,
               style: {}
            },
            thumbnail: {
               needBoxShadow: true,
               showFullPlayer: false,
               style: {}
            },
            playerWindowWidth: 950,
            trackNameAdaptability: [[525, undefined, 425, 35]],
            tickerResizeCheckpoints: undefined,
         },
         audioFiles: {},
         audioFileIds: []
      }
   },
   commonTrackSliderProps: {
      playbackRate: 1
   },
   commonVolumeSliderProps: {
      prevVolumePercentage: undefined,
      volumePercentage: 10,
      soundTogglerValue: true,
   }
}




const playerSlice = createSlice({
   name: 'audioPlayer',
   initialState,

   reducers: {
      // * common
      setCommonTrackSliderProps: (state, action: PayloadAction<CommonTrackSliderProps>) => {
         state.commonTrackSliderProps = action.payload;
      },

      setCommonVolumeSliderProps: (state, action: PayloadAction<CommonVolumeSliderProps>) => {
         state.commonVolumeSliderProps = action.payload;
      },

      // * player
      setPlayerStatus: (state, action: PayloadAction<PlayerStatusAction>) => {
         state.players[action.payload.name].status = action.payload.status;
      },

      setPlayerConfig: (state, action: PayloadAction<PlayerConfigAction>) => {
         state.players[action.payload.name].config = action.payload.playerConfig;
      },

      setPlayerState: (state, action: PayloadAction<PlayerStateAction>) => {
         state.players[action.payload.name].state = action.payload.playerState;
      },

      setGeneralPlayerContext: (state, action: PayloadAction<string>) => {
         state.players.general.context = action.payload;
      },

      setAudioFiles: (state, action: PayloadAction<AudioFilesAction>) => {
         state.players[action.payload.name].audioFiles = {};
         state.players[action.payload.name].audioFileIds = [];

         action.payload.audioFiles.forEach((file, index) => {
            const id = file.id ? file.id: new Date().getTime() + index;
            state.players[action.payload.name].audioFiles[id] = { ...file };
            state.players[action.payload.name].audioFileIds.push(id);
         })
      },

      addAudioFile: (state, action: PayloadAction<AddAudioFileAction>) => {
         const id = new Date().getTime();
         state.players[action.payload.name].audioFiles[id] = action.payload.file;
         state.players[action.payload.name].audioFileIds.push(id);
      },

      removeAudioFile: (state, action: PayloadAction<RemoveAudioFileAction>) => {
         const id: number = action.payload.id
         const name: PlayerName = action.payload.name
         const audioFiles = state.players[name].audioFiles;
         const audioFileIds = state.players[name].audioFileIds;
         const newAudioFilesObj: AudioFiles = {};

         for (let key in audioFiles) {
            if (+key !== id)
               newAudioFilesObj[key] = { ...audioFiles[key] }
         }

         state.players[name].audioFileIds = audioFileIds.filter(item => item !== id);
         state.players[name].audioFiles = { ...newAudioFilesObj }
      },

      resetPlayer: (state, action: PayloadAction<PlayerName>) => {
         const player = state.players[action.payload];

         player.status = false;
         player.audioFiles = {};
         player.audioFileIds = [];

         if (action.payload === 'general') {
            state.players[action.payload].context = undefined;
         }

         state.players[action.payload].state = {
            windowSize: [1280, 980],
            showAudioPlayer: false,
            audioUploaded: false,
            showPlaylist: false,
            isPlaying: false,
            playlistLoaded: false,
            activeTrackId: 0,
            trackSliderProps: {
               percentageCanBeChanged: true,
               trackPercentage: 0,
               duration: "00m 00s",
               currentTime: "00m 00s",
            },
         }

         player.config = {
            adaptToWindowSize: true,
            activeTrackId: 0,
            isPlaying: false,
            showAudioPlayer: false,
            mode: "full",
            full: {
               needBoxShadow: true,
               playerShouldBeSmallWidth: false,
               style: {}
            },
            thumbnail: {
               needBoxShadow: true,
               showFullPlayer: false,
               style: {}
            },
            playerWindowWidth: 950,
            trackNameAdaptability: [[525, undefined, 425, 35]],
            tickerResizeCheckpoints: undefined,
         }
      },

      setWindowSize: (state, action: PayloadAction<WindowSizeAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            windowSize: action.payload.windowSize
         }
      },

      setShowAudioPlayer: (state, action: PayloadAction<ShowAudioPlayerAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            showAudioPlayer: action.payload.showAudioPlayer
         }
      },

      setAudioUploaded: (state, action: PayloadAction<AudioUploadedAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            audioUploaded: action.payload.audioUploaded
         }
      },

      setShowPlaylist: (state, action: PayloadAction<ShowPlaylistAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            showPlaylist: action.payload.showPlaylist
         }
      },

      setIsPlaying: (state, action: PayloadAction<IsPlayingAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            isPlaying: action.payload.isPlaying
         }
      },

      setPlaylistLoaded: (state, action: PayloadAction<PlaylistLoadedAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            playlistLoaded: action.payload.playlistLoaded
         }
      },

      setActiveTrackId: (state, action: PayloadAction<ActiveTrackIdAction>) => {
         state.players[action.payload.name].state = {
            ...state.players[action.payload.name].state,
            activeTrackId: action.payload.activeTrackId
         }
      },

      setPlayerTrackSliderProps: (state, action: PayloadAction<TrackSliderPropsAction>) => {
         state.players[action.payload.name].state.trackSliderProps = action.payload.trackSliderProps;
      },
   },
})



export const getPlayerNames = createSelector(
   (state: RootState) => state.audioPlayer.playerNames,
   playerNames => playerNames
)

export const getPlayers = createSelector(
   (state: RootState) => state.audioPlayer.players,
   players => players
)

export const getPlayerStatuses = createSelector(
   (state: RootState) => state.audioPlayer.players,
   (state: RootState) => state.audioPlayer.playerNames,
   (players, names) => names.map(name => players[name].status)
)

// * common
export const getCommonTrackSliderProps = createSelector(
   (state: RootState) => state.audioPlayer.commonTrackSliderProps,
   commonTrackSliderProps => commonTrackSliderProps
)

export const getCommonVolumeSliderProps = createSelector(
   (state: RootState) => state.audioPlayer.commonVolumeSliderProps,
   commonVolumeSliderProps => commonVolumeSliderProps
)

// * player
export const getPlayerStatus = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].status,
   status => status
)

export const getPlayerState = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].state,
   playerConfigs => playerConfigs
)

export const getGeneralPlayerContext = createSelector(
   (state: RootState) => state.audioPlayer.players.general.context,
   context => context
)

export const getPlayerAudioFiles = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].audioFiles,
   audioFiles => audioFiles
)

export const getPlayerAudioFileIds = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].audioFileIds,
   audioFileIds => audioFileIds
)

export const getPlayerConfig = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].config,
   playerConfigs => playerConfigs
)

export const getShowAudioPlayer = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].state.showAudioPlayer,
   showAudioPlayer => showAudioPlayer
)

export const getTrackSliderProps = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].state.trackSliderProps,
   trackSliderProps => trackSliderProps
)

export const getActiveTrackName = (playerName: PlayerName) => createSelector(
   (state: RootState) => state.audioPlayer.players[playerName].audioFiles,
   (state: RootState) => state.audioPlayer.players[playerName].state.activeTrackId,
   (audioFiles, activeTrackId) => {
      return activeTrackId !== 0 && audioFiles[activeTrackId]
         ? audioFiles[activeTrackId].name
         : undefined
   }
)



export const audioPlayerReducer = playerSlice.reducer;
export const audioPlayerActions = playerSlice.actions;
export type AudioPlayerActions = typeof audioPlayerActions;