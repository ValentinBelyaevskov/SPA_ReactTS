import { useDebounce } from "hooks/useDebounce";



export type TrackSliderPropsList = {
   percentageCanBeChanged?: boolean
   trackPercentage?: number
   duration?: string
   currentTime?: string
}

type SetTrackSliderProps = (props: TrackSliderPropsList) => void

type TrackSliderChangeListener = (value: number) => void



export const useTrackSliderChangeListener = (
   audioElement: HTMLAudioElement,
   audioUploaded: boolean,
   setTrackSliderProps: SetTrackSliderProps

): TrackSliderChangeListener => {

   const changeCurrentTimeWithDebounce = useDebounce((value: number, audioElement: HTMLAudioElement, duration: number, setTrackSliderProps: SetTrackSliderProps): void => {
      const audio = audioElement!;

      audio.currentTime = (+duration / 100) * value;

      setTrackSliderProps({
         percentageCanBeChanged: true,
         trackPercentage: value,
         currentTime: ((value * + audio.duration) / 100).toFixed(2)
      });
   }, 100)



   const trackSliderChangeListener = (value: number): void => {
      if (!audioUploaded) return;


      const audio = audioElement!;

      let correctedValue = value > (100 * (audio.duration - 0.5) / audio.duration)
         ? 99.9
         : value;

      changeCurrentTimeWithDebounce(correctedValue, audioElement, audio.duration, setTrackSliderProps);
      setTrackSliderProps({
         percentageCanBeChanged: false,
         trackPercentage: correctedValue,
         currentTime: ((correctedValue * + audio.duration) / 100).toFixed(2),
      })
   }



   return trackSliderChangeListener
}