import styles from './ControlsItem.module.scss'


type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings"
}


const ControlsItem = (props: Props) => {
   return (
      <li className={styles.controlsListItem}>
         <img className={styles.buttonIcon} src={`./icons/${props.buttonName.toLocaleLowerCase()}.svg`} alt={`${props.buttonName} page icon`} />
         <span className={`${styles.buttonName} unselectable`}>
            {props.buttonName}
         </span>
      </li>
   )
}

export default ControlsItem