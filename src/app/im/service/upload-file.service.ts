/**
 * 文件和图片上传接口服务
 * Created by giscafer on 2017-05-06.
 */
import {Injectable} from "@angular/core";
import {API} from "app/share/lib/api/api";
import {AppConfig} from "app/app.config";
import {Response, Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UploadFileService {

    constructor(public http: Http, public api: API, public appConfig: AppConfig) {

    }

    uploadUrl = this.appConfig.baseUrl + "/upload";

    /**
     *  上传图片
     * @returns {Promise<T>}
     */
    uploadPic(formData: any): Promise<any> {
        let jwt = localStorage["jwt"];
         /*let headers = new Headers({
             'Content-Type': 'multipart/form-data',
             'Authorization': "Bearer " + jwt
         });
         let options = new RequestOptions({headers: headers});

         return this.http.post(this.uploadUrl, formData, options)
         .toPromise()
         .then(this.extractData)
         .catch(this.handleError);*/

        let xhr = new XMLHttpRequest();


        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300)
                        resolve({xhr: xhr, formData: formData});
                    else
                        reject({xhr: xhr, formData: formData});

                }
            };

            xhr.open('POST', this.uploadUrl, true);
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);
            xhr.send(formData);
        });


    }


    public extractData(res: any) {
        let body = res.json();
        return body.data || {};
    }

    /**
     * 错误处理
     * @param error
     * @returns {Promise<never>}
     */
    public handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }
}