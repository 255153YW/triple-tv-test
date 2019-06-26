import React from 'react';
import APIErrorObject from 'interfaces/APIErrorObject';

interface Props{
    error:APIErrorObject
}

export default function ShowErrorMessage(props:Props) {
    let message;

    if(props.error.response){
        let status = props.error.response.status;
        let statusText = props.error.response.statusText;
        switch(status){
            case 404:
                message = "Sorry, we can't find that";
                break;
            default:
                message = statusText; 
        }

    }else{
        message = props.error.message;
    }
    return <div>{message}</div>;
}