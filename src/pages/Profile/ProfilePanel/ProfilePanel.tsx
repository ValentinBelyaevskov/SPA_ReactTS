import { CustomImage } from '../../../common'
import Parameter from './Parameter'
import styles from './ProfilePanel.module.scss'


type Props = {
}

type AvatarWrapperStyle = {
   overflow: "hidden" | "visible",
   borderRadius: string,
}


const ProfilePanel = (props: Props) => {
   const avatarWrapperStyle: AvatarWrapperStyle = {
      overflow: 'hidden',
      borderRadius: "0.6rem",
   }

   const parameters: string[] = ["location", "education", "dateOfBirth", "email"]

   // !
   const profileInfo: {[prop: string]: string} = {
      username: "Ivan Ivanov",
      email: "ivanovivanivanovichfrommoscow@mail.ru",
      location: "Russia, Moscow, Karl Marks street 30/1",
      education: "Lomonosov MSU, biology and chemistry Faculty",
      dateOfBirth: "03.05.1995",
   }


   return (
      <div className={styles.profilePanel}>
         <CustomImage additionalClass={styles.avatar} src='./image/defaultAvatar.jpg' wrapperStyle={avatarWrapperStyle} />
         <div className={styles.profileInfo}>
            <h3 className={styles.username}>
               {profileInfo.username}
            </h3>
            <div className={styles.parameters}>
               {parameters.map((item: string) => <Parameter
                  key={item}
                  parameterName={item}
                  parameterValue={profileInfo[item]}
               />)}
            </div>
         </div>
      </div>
   )
}

export default ProfilePanel