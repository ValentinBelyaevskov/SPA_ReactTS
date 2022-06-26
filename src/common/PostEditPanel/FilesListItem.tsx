import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './FilesListItem.module.scss'
import { addContentButtonNames, icons } from './PostEditPanel';
import NotVisibleParameterValue from 'common/NotVisibleParameterValue/NotVisibleParameterValue';
import { useState } from 'react';
import { useEffect } from 'react';
import getFileNameAndFormat from 'functions/getFileNameAndFormat';
import { FilesItem } from './hooks/useFilesBlock';



type Props = {
   file: FilesItem
   deleteFile: (index: number) => void
   index: number
}



const FilesListItem = (props: Props) => {
   const fileIconIndex: number = addContentButtonNames.findIndex(item => props.file.type!.includes(item) || ((props.file.type!.includes("text") || props.file.type!.includes("application")) && item === "file"));
   const fileIcon: string = icons[fileIconIndex];
   const hideIconHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const fileLinkHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);

   const [fileNameWithFormat, setFileNameWithFormat] = useState<string>(props.file.name!);
   const [visibleParameterValue, setVisibleParameterValue] = useState<string | undefined | number | null>(props.file.name!);
   const [stringWithLineBreak, setStringWithLineBreak] = useState<(JSX.Element | string)[]>([]);
   const [isTheValueLong, setIsTheValueLong] = useState<boolean | undefined>(undefined);




   const getFileFormat = (name: string): string => getFileNameAndFormat(name)[1];

   const hideIconClickListener = () => {
      props.deleteFile(props.index);
      hideIconHoverAndTouchClassNames.clickListener();
   }




   useEffect(() => {
      if (isTheValueLong && visibleParameterValue) {
         setFileNameWithFormat(`${`${visibleParameterValue}`.slice(0, -6)}... .${getFileFormat(props.file.name!)}`);
      } else {
         setFileNameWithFormat(props.file.name!);
      }
   }, [props.file.name, visibleParameterValue])



   return (
      <div className={styles.filesListItem}>
         <div
            className={`${styles.fileLinkContainer} ${fileLinkHoverAndTouchClassNames.className}`}
            onClick={fileLinkHoverAndTouchClassNames.clickListener}
            onMouseEnter={fileLinkHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={fileLinkHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={fileLinkHoverAndTouchClassNames.touchEndListener}
         >
            <img className={styles.fileIcon} src={fileIcon} alt={`${props.file.type} ${props.file.name}`} />
            <a className={styles.fileLink} href={props.file.src} target="_blank">
               {fileNameWithFormat}
            </a>
         </div >
         <img
            className={`${styles.hideIcon} ${hideIconHoverAndTouchClassNames.className}`}
            src="./icons/hideMini.svg"
            alt="hide icon"
            onClick={hideIconClickListener}
            onMouseEnter={hideIconHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={hideIconHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={hideIconHoverAndTouchClassNames.touchEndListener}
         />
         <NotVisibleParameterValue
            parameterValue={props.file.name}
            setIsTheValueLong={setIsTheValueLong}
            setStringWithLineBreak={setStringWithLineBreak}
            setVisibleParameterValue={setVisibleParameterValue}
            className={styles.notVisibleValue}
            configForAdaptability={[
               [550, undefined, 450, 38],
               [480, 550, 380, 32],
               [420, 480, 312, 27],
               [350, 420, 242, 21],
               [320, 350, 207, 18],
               [280, 320, 173, 15],
            ]}
         />
      </div >
   )
}

export default FilesListItem