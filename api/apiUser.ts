import APIService, { APICaller } from "./APIKit";

export const storeUser = async(userInfo:any, loginType: 'via google' | 'via phone')=>{
    
    try {
        const res = await APICaller(APIService.post(`/addUser`,{
            data: {...userInfo, loginType}
        }))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}