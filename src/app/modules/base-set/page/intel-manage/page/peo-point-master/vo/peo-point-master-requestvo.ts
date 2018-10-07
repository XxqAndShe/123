/**
 * Created by hd on 2017/3/30.
 */
export class CustomerWorkerRequestVO{
    id:string;
    customer:VCustomer;
    workerName:string;
    transportCompany:String;
    orderType:string;
    area:VArea;
    areaCodes:string[]
    userWorkers:VWorker[];
}

export class VWorker{
    workerName:string;
    workerID:string;
}

export class VCustomer{
    name:string;
    id:string;
}
export class VArea{
    code:string;
    name:string;
    fullName:string;
}