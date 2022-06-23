// * beforeUpload
// const separatePatnAndName = (pathAndName) => {
//    if (pathAndName.includes("/", 0)) {
//       const fileNameLength = pathAndName.split("").reverse().findIndex((item) => item === "/")
//       const pathWithoutName = pathAndName.split("").slice(0, -fileNameLength - 1).join("")
//       const nameWithoutPath = pathAndName.split("").slice(-fileNameLength).join("")
//       return [pathWithoutName, nameWithoutPath]
//    } else {
//       return ["", pathAndName]
//    }
// }


// Backendless.ServerCode.File.beforeUpload('*', async function(req) {
//    const user = await Backendless.Data.of("Users").findById(req.context.userId)
   
//    if (user.avatar) {
//       const oldAvatar = separatePatnAndName(user.avatar)[1]
//       Backendless.Files.remove("image/user-avatar/" + oldAvatar)
//       console.log("oldAvatar: ", oldAvatar)
//    }

//    Backendless.Data.of("Users").save({
//       objectId: req.context.userId,
//       avatar: req.fileURL,
//    })
// });


// * afterUpload



// * afterPublish
// Backendless.ServerCode.Messaging.afterPublish('*', async function(req, res) {
//    function subsequenceFromStartLast(sequence, at1) {
//      var start = at1;
//      var end = sequence.length - 1 + 1;
//      return sequence.slice(start, end);
//    }
//      await Backendless.Data.of('Chat').addRelation(
//       (req.message['chatId'])
//       , 'messages'
//       , [
//          (
//             await Backendless.Data.of('Messages').deepSave(
//                (
//                   {
//                      'content': (req.message['content']),
//                      'chatId': (req.message['chatId']),
//                      'messageId': subsequenceFromStartLast(((res['result'])['messageId']), 8),
//                      'chat': ({ 'objectId': (req.message['chatId']) }),
//                      'from': ({ 'objectId': req.context.userId }),
//                      'to': (req.message['to']) ? (req.message['to']) : null,
//                      'readBy': (req.message['to']) ? [] : [({ 'objectId': req.context.userId })]
//                   }
//                )
//             )
//          )
//       ]
//    );
//  });


// * beforeUpdate
// Backendless.ServerCode.User.beforeUpdate(async function(req) {
//    console.log("request: ", req)
//    if (
//       (!req.user.currentPassword && (typeof req.user.currentPassword !== "string"))
//       && (!req.user.newPassword && (typeof req.user.newPassword !== "string"))
//    ) return
//    const result = await Backendless.UserService.verifyPassword( req.user.currentPassword )
//    let response = {
//      error: "Wrong password"
//    };
   
//    if (result) {
//       let user = {...req.user}
//       delete user.currentPassword
//       delete user.newPassword
//       req.user = {...user, password: req.user.newPassword}
//    } else {
//      throw Error('Wrong "current password" value'.replace(/"([^"]+)"/g, '«$1»') )
//    }
// });


// * funcs
// export const getUniqueFileName = async (name: string, path: string): Promise<string> => {
//    const uniquePath: string = Math.random().toString(36).slice(2, 14)
//    const shortcut: string = name.length > 20 ? name.slice(-20) : name
//    const uniqueName: string = uniquePath + shortcut
//    const filesList: any = await Backendless.Files.listing(path)

//    if (filesList.find((item: any) => {
//       return (item.name === uniqueName)
//    })) {
//       return getUniqueFileName(name, path)
//    } else {
//       return uniqueName
//    }
// }