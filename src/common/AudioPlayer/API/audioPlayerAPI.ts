import { AppDispatch } from "redux/store";
import { setPlayerField } from "../functions.ts/setPlayerField";
import { AudioPlayerActions } from "../redux/audioPlayerReducer";
import { ActiveTrackIdAction,  AddAudioFileAction,  AudioFile, AudioFilesAction, AudioUploadedAction, CommonTrackSliderProps, CommonVolumeSliderProps, IsPlayingAction, ItemIdAction, PlayerConfig, PlayerConfigAction, PlayerName, PlayerState, PlayerStateAction, PlayerStatusAction, PlaylistLoadedAction, RemoveAudioFileAction, ShowAudioPlayerAction, ShowPlaylistAction, TrackSliderProps, TrackSliderPropsAction, WindowSizeAction } from "../types/types";



export class audioPlayerApi {
   protected dispatch: AppDispatch
   protected audioPlayerActions: AudioPlayerActions
   protected name: PlayerName



   constructor(
      dispatch: AppDispatch,
      audioPlayerActions: AudioPlayerActions,
      name: PlayerName
   ) {

      this.dispatch = dispatch;
      this.audioPlayerActions = audioPlayerActions;
      this.name = name;
   }



   resetPlayer = () => {
      setPlayerField<PlayerName>(this.dispatch, this.audioPlayerActions.resetPlayer)(this.name);
   }

   setCommonVolumeSliderProps = (commonVolumeSliderProps: CommonVolumeSliderProps) => {
      setPlayerField<CommonVolumeSliderProps>(this.dispatch, this.audioPlayerActions.setCommonVolumeSliderProps)(commonVolumeSliderProps);
   }

   setCommonTrackSliderProps = (commonTrackSliderProps: CommonTrackSliderProps) => {
      setPlayerField<CommonTrackSliderProps>(this.dispatch, this.audioPlayerActions.setCommonTrackSliderProps)(commonTrackSliderProps);
   }

   setState = (playerState: PlayerState) => {
      setPlayerField<PlayerStateAction>(this.dispatch, this.audioPlayerActions.setPlayerState)({
         name: this.name,
         playerState
      });
   }

   setConfig = (playerConfig: PlayerConfig) => {
      setPlayerField<PlayerConfigAction>(this.dispatch, this.audioPlayerActions.setPlayerConfig)({
         name: this.name,
         playerConfig
      });
   }

   setStatus = (status: boolean) => {
      setPlayerField<PlayerStatusAction>(this.dispatch, this.audioPlayerActions.setPlayerStatus)({
         name: this.name,
         status
      });
   }

   setAudioFiles = (audioFiles: AudioFile[]) => {
      setPlayerField<AudioFilesAction>(this.dispatch, this.audioPlayerActions.setAudioFiles)({
         name: this.name,
         audioFiles
      });
   }

   addAudioFile = (file: AudioFile) => {
      setPlayerField<AddAudioFileAction>(this.dispatch, this.audioPlayerActions.addAudioFile)({
         name: this.name,
         file
      });
   }

   removeAudioFile = (id: number) => {
      setPlayerField<RemoveAudioFileAction>(this.dispatch, this.audioPlayerActions.removeAudioFile)({
         name: this.name,
         id,
      });
   }

   setWindowSize = (windowSize: [number, number]) => {
      setPlayerField<WindowSizeAction>(this.dispatch, this.audioPlayerActions.setWindowSize)({
         name: this.name,
         windowSize
      });
   }

   setShowAudioPlayer = (showAudioPlayer: boolean) => {
      setPlayerField<ShowAudioPlayerAction>(this.dispatch, this.audioPlayerActions.setShowAudioPlayer)({
         name: this.name,
         showAudioPlayer
      });
   }

   setAudioUploaded = (audioUploaded: boolean) => {
      setPlayerField<AudioUploadedAction>(this.dispatch, this.audioPlayerActions.setAudioUploaded)({
         name: this.name,
         audioUploaded
      });
   }

   setShowPlaylist = (showPlaylist: boolean) => {
      setPlayerField<ShowPlaylistAction>(this.dispatch, this.audioPlayerActions.setShowPlaylist)({
         name: this.name,
         showPlaylist
      });
   }

   setIsPlaying = (isPlaying: boolean) => {
      setPlayerField<IsPlayingAction>(this.dispatch, this.audioPlayerActions.setIsPlaying)({
         name: this.name,
         isPlaying
      });
   }

   setPlaylistLoaded = (playlistLoaded: boolean) => {
      setPlayerField<PlaylistLoadedAction>(this.dispatch, this.audioPlayerActions.setPlaylistLoaded)({
         name: this.name,
         playlistLoaded
      });
   }

   setActiveTrackId = (activeTrackId: number) => {
      setPlayerField<ActiveTrackIdAction>(this.dispatch, this.audioPlayerActions.setActiveTrackId)({
         name: this.name,
         activeTrackId
      });
   }

   setTrackSliderProps = (trackSliderProps: TrackSliderProps) => {
      setPlayerField<TrackSliderPropsAction>(this.dispatch, this.audioPlayerActions.setPlayerTrackSliderProps)({
         name: this.name,
         trackSliderProps
      });
   }
}