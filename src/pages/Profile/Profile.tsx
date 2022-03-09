import styles from './Profile.module.scss'
import ProfilePanel from './ProfilePanel/ProfilePanel'


const Profile = () => {
   return (
      <div className={`${styles.profile} page`}>
         <ProfilePanel />
      </div>
   )
}

export default Profile