import Parameter from './Parameter';
import styles from './Parameters.module.scss';
import profileInfoStyles from './ProfileInfo.module.scss';
import { splitStringIntoWords } from '../../../../../functions/splitStringIntoWords';
import React from 'react';


type Parameters = ((string | undefined | number | null)[])[]

type Props = {
   block: Parameters
   showFullInfo: boolean
   setHighlightShowMoreButton: React.Dispatch<React.SetStateAction<boolean>>
   hideFullInfoOnTouchTimeout: NodeJS.Timeout | null
   setHideFullInfoOnTouchTimeout: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>
}


const Parameters = (props: Props) => {
   const blockName: (string | undefined) = typeof props.block[0] === "object" && props.block[0].length === 1 ? (typeof props.block[0][0] === "string" ? props.block[0][0]: undefined) : undefined;
   const title: (string | undefined) = blockName ? splitStringIntoWords(blockName, true) : undefined;
   const parameters: Parameters = props.block[0] && props.block[0].length === 1 ? props.block.slice(1) : props.block;



   return (
      <div className={`${styles.parameters} ${blockName ? profileInfoStyles[blockName] : profileInfoStyles.infoBlock}`}>
         {
            title ?
               (<div className={styles.parametersTitleContainer}>
                  <h3 className={styles.parametersTitle}>{title}</h3>
                  <hr />
               </div>)
               : null
         }
         <div className={`${styles.parametersList}`}>
            {parameters.map((item, i) => (
               <Parameter
                  key={item[0]}
                  parameterName={item[0]}
                  parameterValue={item[1]}
                  showFullInfo={props.showFullInfo}
                  setHighlightShowMoreButton={props.setHighlightShowMoreButton}
                  hideFullInfoOnTouchTimeout={props.hideFullInfoOnTouchTimeout}
                  setHideFullInfoOnTouchTimeout={props.setHideFullInfoOnTouchTimeout}
               />
            ))}
         </div>
      </div>
   )
}

export default Parameters