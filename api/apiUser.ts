import { supabase } from "@/config/supabase";
import APIService, { APICaller } from "./APIKit";

export const storeUser = async (userInfo: any, loginType: 'via google' | 'via phone') => {

    try {
        const res = await APICaller(APIService.post(`/addUser`, {
            data: { ...userInfo, loginType }
        }))
        return res.data;
        // const userData = JSON.parse(userInfo);

        // const userinfo = {
        //     first_name: userInfo.data.user.givenName,
        //     last_name: userInfo.data.user.familyName,
        //     name: userInfo.data.user.name,
        //     email: userInfo.data.user.email,
        //     pic: userInfo.data.user.photo,
        //     login_through: loginType
        // }
        // // Find user in the database
        // const { data: existingUser, error } = await supabase
        //     .from('users')
        //     .select('*')
        //     .eq('name', userinfo.name)
        //     .eq('email', userinfo.email)
        //     .single();  // Use `.single()` to get only one record, if any

        // if (existingUser) {
        //     return existingUser;
        // } else {
        //     // Insert new user into the database
        //     const { data: newUser, error: insertError } = await supabase
        //         .from('users')
        //         .insert(userinfo).select();

        //         if(insertError){
        //             throw new Error("Error in inserting user")
        //         }else{
        //             console.log("newUser",newUser);
        //             return newUser
        //         }
        // }


    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}


export const deletUser = async (userId: string) => {
    try {
        const res = await APICaller(APIService.delete(`/user?id=${userId}`))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}