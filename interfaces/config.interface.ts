export interface EnvConfigType {
    server:{
        port:number;
    },
    throttle:{
      windowInMillisec: number, // 24 hrs in milliseconds
      maximum: number,
      message: string, 
      headers: boolean,
    }
  }