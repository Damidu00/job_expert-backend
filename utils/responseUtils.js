export const errorResponseUnAuthorize = ()=>{
    return createError("UNAUTHORIZED","You are not authorized to access.");
}

export const createResponse = (data)=>{

    const response = {
        "status": "success",
        "data": data
    };

    return response;
}

export const createError = (errorCode,message)=>{

    const errorResponse = {
        "status":"error",
        "error": {
            "code": errorCode,
            "message": message
        }
    };

    return errorResponse;
}