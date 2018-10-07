import {
    Component,
    animate,
    trigger,
    state,
    transition,
    style,
    Output,
    EventEmitter,
    Input,
    OnInit
} from "@angular/core";
import {Router} from "@angular/router";
import {API} from "../../lib/api/api";
@Component({
    selector: 'sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.css'],
    animations: [trigger('submenushow', [
        state("show", style({
            left: '0'
        })),
        state("hide", style({
            left: '-139px'
        })),
        transition('hide=>show', animate('180ms ease-in')),
        transition('show=>hide', animate('180ms ease-in'))
    ]),
        trigger('showIndentIcon', [
            state("show", style({
                left: '127px'
            })),
            state("hide", style({
                left: '-156px'
            })),
            transition('hide=>show', animate('180ms ease-in')),
            transition('show=>hide', animate('180ms ease-in'))
        ])
    ]
})
export class SubMenuComponent implements OnInit {

    public subMenuState: string = 'hide';
    public overtimeTask: number = 0;
    @Output() leftChange = new EventEmitter<boolean>();//输出参数到父组件
    // 菜单点击颜色变色（改变其class）

    //父组件传来的菜单内容
    @Input() selectMenuContent: any;

    isMenuClick = [];

    constructor(public router: Router,public api: API) {
    }

    ngOnInit() {
        window['epInstance'].on('update_submenu_info',()=>{
            this.overtimeTaskRenovate();
        })
        for (let i = 0, len = this.selectMenuContent.content.length; i < len; i++) {
            this.isMenuClick[i] = false;
        }
        this.isMenuClick[0] = true;
        // 超时的待跟踪任务
        this.overtimeTaskRenovate();
    }
    /**
     * 重定向到子菜单时，定位到index选项高亮
     * @param index
     */
    redirectSub(index) {
        for (var i = 0, len = this.selectMenuContent.content.length; i < len; i++) {
            this.isMenuClick[i] = false;
        }
        this.isMenuClick[index] = true;
    }

    /**
     * 二级菜单点击
     * @param index
     */
    menuclick(index: number) {
        let routerUrl = this.selectMenuContent.router + '/' + this.selectMenuContent.subRouter[index];
        // console.info(routerUrl)
        this.router.navigate([routerUrl]);
        for (var i = 0, len = this.selectMenuContent.content.length; i < len; i++) {
            this.isMenuClick[i] = false;
            if (i == index) {
                this.isMenuClick[i] = true;
            }
        }
    }

    /**
     * 二级菜单显示
     * @param event
     * @param tar
     */
    showSubMenu(event: any, tar) {
        this.subMenuState = 'show';
        if (event) {
            event.target.style.display = 'none';
        }
        if (tar) {
            tar.style.display = 'none';
        }
        this.leftChange.emit(true);//传参至父组件
    }

    /**
     * 二级隐藏菜单
     * @param spreadIcon
     * @param mark
     */
    hideSubMenu(spreadIcon: any, mark?) {
        this.subMenuState = 'hide';
        if (!mark) {
            spreadIcon.style.display = 'none';
        }
        this.leftChange.emit(false);//传参至父组件
    }

    overtimeTaskRenovate(){
        this.api.call('taskTraceController.findToTraceTaskCount')
            .ok(data => {
                this.overtimeTask = data.result.traceTaskCount;
            })
            .fail(err => {
            });
    }
}
