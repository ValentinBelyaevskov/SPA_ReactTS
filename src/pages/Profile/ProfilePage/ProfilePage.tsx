import styles from './ProfilePage.module.scss'
import ProfilePanel from './ProfilePanel/ProfilePanel';
import Wall from './Wall/Wall';


type Props = {
}


const ProfilePage = (props: Props) => {
   return (
      <div
         className={styles.profileInfo}
      >
         <ProfilePanel />
         <Wall />
      </div>
   )
}

export default ProfilePage