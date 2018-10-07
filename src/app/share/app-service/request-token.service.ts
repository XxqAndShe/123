/**
 * 前端假token，防止多次提及表单
 */
import { Injectable } from '@angular/core';
@Injectable()
export class RequestTokenService{
   createToken(){
       localStorage["request-token"]="rt_"+new Date().getTime();
   }
}