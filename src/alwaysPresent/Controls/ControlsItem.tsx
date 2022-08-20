import { useAppSelector } from 'hooks/redux';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { getProfileInfo, getProfileInfoMode } from 'pages/Profile/redux/profileReducer';
import { useEffect, useState } from 'react';
import { NavLink, useMatch, useParams } from 'react-router-dom';
import styles from './ControlsItem.module.scss';



type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   icon: string
   activeIcon: string
}

type IsActiveObj = { isActive: boolean }



const ControlsItem = (props: Props) => {
   const profileInfoMode = useAppSelector(getProfileInfoMode);
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const profile = useAppSelector(getProfileInfo);
   const [path, setPath] = useState<string>("/");
   const match = useMatch(path);

   const [itemClassName, setItemClassName] = useState(`${styles.controlsListItem} ${itemHoverAndTouchClassNames.className} unselectable`);




   const getItemClassName = ({ isActive }: IsActiveObj): string => isActive ? `${itemClassName} ${styles.activeItem}` : itemClassName;


   const getTo = (): string => {
      if (profileInfoMode === "addingContent") return path

      return props.buttonName === "Profile"
         ? (
            profile.objectId
               ? profile.objectId
               : "SignIn"
         )
         : props.buttonName
   }


   const getIcon = (): string => {
      return ""
   }




   useEffect(() => {
      setPath(
         props.buttonName === 'Profile'
            ? (
               profile.objectId ?
                  `${profile.objectId}`
                  : '/SignIn'
                  )
            : `${props.buttonName}/NotFoundPage`
      )
   }, [props.buttonName, profile.objectId])




   return (
      <NavLink
         to={getTo()}
         className={getItemClassName}
         onClick={itemHoverAndTouchClassNames.clickListener}
         onMouseEnter={itemHoverAndTouchClassNames.mouseEnterListener}
         onTouchStart={itemHoverAndTouchClassNames.touchStartListener}
         onTouchEnd={itemHoverAndTouchClassNames.touchEndListener}
      >
         <img
            className={styles.buttonIcon}
            src={match ? props.activeIcon : props.icon}
            alt={`${props.buttonName} page icon`}
         />
         <span className={`${styles.buttonName} unselectable`}>
            {props.buttonName}
         </span>
      </NavLink>
   )
}

export default ControlsItem