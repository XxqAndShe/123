import {Component,Input,OnInit} from '@angular/core';
@Component({
    selector: 'appointment-time-details',
    templateUrl: './appointment-time-details.component.html',
    styleUrls: [
        './appointment-time-details.component.css'
    ]
})
export class appointmentTimeDetailsComponent{
    @Input() appointmentDetails: any;
    constructor(){}
    ngOnInit(){}
}