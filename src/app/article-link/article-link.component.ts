import {Component, OnInit} from '@angular/core';
import {API} from "../share/lib/api/api";
import {ActivatedRoute} from "@angular/router";
import {Title, DomSanitizer} from '@angular/platform-browser';
import {copy} from "app/share/utils/copy";

// 文章信息查询接口
const ARTICLE_URL = "http://192.168.1.64:12000/documentController/findPwdDocument";

@Component({
    selector: 'article-link',
    templateUrl: './article-link.component.html',
    styleUrls: ['./article-link.component.css']
})
export class ArticleLinkComponent implements OnInit {

    data: any;
    name: string;
    timeDate: string;
    errorMsg: string;
    article: boolean = false;
    notFound: boolean = false; // 文章不存在
    pwd;
    text;
    articleUrl;
    hint: boolean = false;
    link: string;
    attachments: any;

    constructor(public _activatedRoute: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public api: API,
                public title: Title) {
    }

    ngOnInit() {
        // 如果不需要密码
        this.title.setTitle('文章预览');
        this.article = false;
        let articleId = this._activatedRoute.snapshot.params['articleId'];
        //分享链接
        this.articleUrl = location.protocol + '//' + location.host + '/article/' + articleId;
        this.api.call("documentController.findPwdDocument", {
            id: articleId,
            pwd: this.pwd
        }).ok(json => {
            this.setInnerHtml(json.result);
        }).fail(err => {
            this.article = false;
            if (err && err.code == 100) {
                if (err['error'].indexOf('密码') === -1) {
                    this.title.setTitle('文章找不到');
                    this.errorMsg = err['error'];
                    this.notFound = true;
                } else {
                    this.notFound = false;
                }
            }
        });
    }

    onModelChange($event) {
        this.errorMsg = "";
    }

    /**
     * 输入密码
     */
    checkClick() {
        this.errorMsg = "";
        let articleId = this._activatedRoute.snapshot.params['articleId'];
        this.api.call("documentController.findPwdDocument", {
            id: articleId,
            pwd: this.pwd
        }).ok(json => {
            this.setInnerHtml(json.result);

        }).fail(err => {
            if (err && err.code == 100) {
                this.errorMsg = err['error'];
            }
        });
    }

    /**
     * 处理数据
     * @param data
     */
    setInnerHtml(data) {
        this.article = !this.article;
        this.data = data;
        this.attachments = data.attachments;
        this.title.setTitle(`${data.name} - 文章预览`);
        this.name = data.name;
        this.timeDate = data.timeDate;
        setTimeout(() => {
            let text = document.getElementById("text");
            if (text) {
                text.innerHTML = data.text;
            }
        }, 100);
        if (data['pdf'] === 'PDF' && data['pdfUrl']) {
            // 使用iframe嵌入页面方式
            localStorage['ACTICLE_FILE_URL'] = data['pdfUrl'];
            // this.pdfViewer(data['pdfUrl']);
            // data['pdfUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(data['pdfUrl']);
        }
    }

    /**
     * 收藏
     * @param url
     * @param title
     * @returns {boolean}
     */
    save(url?, title?) {
        if (!url) {
            url = window.location
        }
        if (!title) {
            title = this.name
        }
        var browser = navigator.userAgent.toLowerCase();
        if (window['sidebar']) { // Mozilla, Firefox, Netscape
            window['sidebar'].addPanel(title, url, "");
        } else if (window.external) { // IE or chrome
            if (browser.indexOf('chrome') == -1) { // ie
                window.external['AddFavorite'](url, title);
            } else { // chrome
                alert('请使用快捷键 CTRL + D 添加收藏');
            }
        }
        else if (window['opera'] && window.print) { // Opera - automatically adds to sidebar if rel=sidebar in the tag
            return true;
        }
        else if (browser.indexOf('konqueror') != -1) { // Konqueror
            alert('请使用快捷键 CTRL + D 添加收藏');
        }
        else if (browser.indexOf('webkit') != -1) { // safari
            alert('请使用快捷键  CTRL + D (or Command+D for macs) 添加收藏');
        } else {
            alert('抱歉，您的浏览器不支持添加书签！')
        }
    }

    /**
     *  复制链接
     */
    onShare() {
        copy(this.articleUrl);
        this.hint = true;
        setTimeout(() => {
            this.hint = false;
        }, 2000);
    }

    /*pdfViewer(url) {
        // url='/pdf-js/web/compressed.tracemonkey-pldi-09.pdf';
        window['ACTICLE_FILE_URL'] = '/pdf-js/web/blank.pdf';
        // If absolute URL from the remote server is provided, configure the CORS
        // header on that server.

        // Disable workers to avoid yet another cross-origin issue (workers need
        // the URL of the script to be loaded, and dynamically loading a cross-origin
        // script does not work).
        // PDFJS.disableWorker = true;

        // The workerSrc property shall be specified.
        PDFJS.workerSrc = './assets/js/pdfjs/pdf.worker.js';

        // Asynchronous download of PDF
        var loadingTask = PDFJS.getDocument(url);
        loadingTask.promise.then(function (pdf) {
            console.log('PDF loaded');

            // Fetch the first page
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function (page) {
                console.log('Page loaded');

                var scale = 1.5;
                var viewport = page.getViewport(scale);

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById('pdf-canvas');
                var context = canvas['getContext']('2d');
                canvas['height'] = viewport.height;
                canvas['width'] = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function () {
                    console.log('Page rendered');
                });
            });
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
    }*/

}
