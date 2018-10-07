import {trigger, state, style,transition,animate} from "@angular/core";

export const orderBtnAnimation=trigger('btnState',[
    state('show',style({
        left:'0',
        display:'block'
    })),
    state('hide',style({
        left:'-100%',
        display:'none'
    })),
    transition('hide<=>show', animate('250ms ease-in'))
]);