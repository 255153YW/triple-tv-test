interface response{
    status:number,
    statusText:string
}

export default interface APIErrorProps{
    response:undefined|response,
    message:string
}
