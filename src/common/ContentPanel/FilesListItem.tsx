import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './FilesListItem.module.scss';
import { addContentButtonNames, icons } from './ContentPanel';
import NotVisibleParameterValue from 'common/NotVisibleParameterValue/NotVisibleParameterValue';
import { useState } from 'react';
import { useEffect } from 'react';
import getFileNameAndFormat from 'functions/getFileNameAndFormat';
import { FilesItem } from './hooks/useFilesBlock';
import { DataType } from './hooks/usePostLoadingStatus';
import { setFileSizeInUnits } from 'functions/setFileSizeInUnits';



type Props = {
   file: FilesItem
   mode: "edit" | "view"
   deleteFile: (index: number) => void
   index: number
   updateLoadingStatusesItem?: (index: number, newItemValue: boolean, dataType: DataType) => void
}



const FilesListItem = (props: Props) => {
   const fileIconIndex: number = addContentButtonNames.findIndex((item, index) => {
      if (props.file.type.length === 0 && index === 1) return true


      return props.file.type!.includes(item)
         || (
            (
               props.file.type!.includes("text")
               || props.file.type!.includes("application")
            )
            && item === "file"
         )
   });
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
      <div className={`${styles.filesListItem} ${styles[props.mode]}`}>
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
         <div className={styles.fileSize}>
            {setFileSizeInUnits(props.file.size!)}
         </div>
         <img
            className={`${styles.hideIcon} ${hideIconHoverAndTouchClassNames.className}`}
            src="./icons/hideMini.svg"
            alt="hide icon"
            onClick={hideIconClickListener}
            onMouseEnter={hideIconHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={hideIconHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={hideIconHoverAndTouchClassNames.touchEndListener}
            onLoad={() => {
               if (props.updateLoadingStatusesItem) props.updateLoadingStatusesItem(props.index, true, "file");
            }}
         />
         <NotVisibleParameterValue
            parameterValue={props.file.name}
            setIsTheValueLong={setIsTheValueLong}
            setStringWithLineBreak={setStringWithLineBreak}
            setVisibleParameterValue={setVisibleParameterValue}
            className={styles.notVisibleValue}
            configForAdaptability={[
               [550, undefined, 415, 35],
               [500, 549, 360, 30],
               [461, 499, 320, 20],
               [400, 460, 200, 15],
               [320, 399, 160, 10],
               [280, 319, 130, 8],
            ]}
         />
      </div >
   )
}

export default FilesListItem