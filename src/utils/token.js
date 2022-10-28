export function getToken(){
    const token=sessionStorage.getItem("TOKEN");
    return token;
}

export function setToken(token){
    sessionStorage.setItem("TOKEN",token);
}