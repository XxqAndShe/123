import {Injectable} from "@angular/core";
import {AppConfig} from "../../app.config";
import {API} from "../lib/api/api";
import {Http} from "@angular/http";
import {environment} from "environments/environment.prod";
import {Router} from "@angular/router";

@Injectable()
export class ApiService {

    constructor(public config: AppConfig, public http: Http,public router:Router) {

    }

    core(): API {
        let api: API = new API(this.http,this.router);
        if (environment.config_global) {
            api.url = window['baseUrl'] + "/api.do";
        } else {
            api.url = this.config.baseUrl + "/api.do";
        }

        return api;
    }

    report(): API {
        let api: API = new API(this.http,this.router);
        if (environment.config_global) {
            api.url = window['reportUrl'] + "/api.do";
        } else {
            api.url = this.config.reportUrl + "/api.do";
        }
        return api;
    }
}