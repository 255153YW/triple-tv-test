interface response{
    status:number,
    statusText:string
}

export default interface APIErrorObject{
    response:undefined|response,
    message:string
}
