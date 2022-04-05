import styles from './ProfileInfo.module.scss'
import ProfilePanel from './ProfilePanel/ProfilePanel';
import Wall from './Wall/Wall';


type Props = {
}


const ProfileInfo = (props: Props) => {
   return (
      <div className={styles.profileInfo}>
         <ProfilePanel />
         <Wall />
      </div>
   )
}

export default ProfileInfo