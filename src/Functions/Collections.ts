import { APIUser } from "discord-api-types/v10";

let users = Object({})
function getUser(userid: string) {
    let user: any;
    for(let _user of users){
     if(userid ==_user.id){
        user = _user
     }
     return user ? user : false
    }
}

export { users, getUser}