import {trigger, state, style,transition,animate} from "@angular/core";

export const animationScale=trigger('boxState',[
    state('show',style({
        transfrom:'scale(1)',
        display:'block'
    })),
    state('hide',style({
        transform:'scale(0)',
        dispaly:'none'
    })),
    transition('hide<=>show', animate('180ms ease-in'))
]);