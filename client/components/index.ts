import { Component, OnInit, DynamicComponentLoader,ViewContainerRef, Injector } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteParams, Router }   from '@angular/router-deprecated';

import { DesktopCmp } from './desktop/desktop'
// import { searchEvent } from './dockbar/start/start'
import { DockbarCmp, dockAppList, searchEvent } from './dockbar/dockbar'
import { FileExplorerCmp } from './file-explorer/file-explorer'
import { TerminalCmp } from './applications/terminal'
import { UrlAppCmp } from './applications/url-app'
import { VsCodeCmp } from './applications/vscode'
import { MenuCmp } from './menu/menu'
import { Commander } from './tools/commander'
import { dblClickEvent } from './shortcut/shortcut'
import { winMenuList } from './dockbar/win-menu/win-menu'
import { Bash } from './applications/terminal'
import { DomSanitizationService } from '@angular/platform-browser'



var dockMap = {}   
declare var io     

var idIndex =10
@Component({
    selector: 'Home',
    providers: [  ], 
    directives: [ DesktopCmp, DockbarCmp ],
    template: `
    `,
    styles: [`
    `]
})

export class HomeCmp extends Commander implements OnInit 
{
    shortcuts = [{}]
    socket;term_id
    callback

    constructor(public dcl: DynamicComponentLoader, public viewContainerRef: ViewContainerRef, private sanitizer: DomSanitizationService){
        super()
        var bash = new Bash(this.getRequest().host_ip, this.getRequest().container_id)
        
        dblClickEvent((shortcut)=>{
            if( shortcut.type === 'text/plain' ){
                bash.cat(shortcut.path, (err, data)=>{
                    this.createCmp(VsCodeCmp).then((ref)=>{
                        var component = ref['_hostElement'].component
                        component.text = data
                        component.title = shortcut.path.split('/').pop()
                        component.onSave = (text)=>{
                            text = text.replace(/\n/g, '').replace(/\n$/, '')
                            bash.write(shortcut.path, text, (err)=>{

                            })
                        }
                    })
                })
            }
        })
    }
    
    getRequest(): any 
    {
        var url = location.search
        var theRequest = new Object()
        if (url.indexOf('?') != -1) 
        {
            var str = url.substr(1)
            var strs = str.split('&')
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split('=')[0]]=(strs[i].split('=')[1])
            }
        }
        return theRequest
    }


    ngOnInit()
    {
        this.createCmp(TerminalCmp).then(ref=>{
            var component = ref['_hostElement'].component
            component.host_ip = this.getRequest().host_ip
            component.container_id = this.getRequest().container_id
            component.max = true
        })
        if( !this.getRequest().desktop )
            return 
        window['web-desktop'] = true

        searchEvent.search = (value) =>
        {
            this.createCmp(UrlAppCmp).then(ref=>{
                var component = ref['_hostElement'].component
                component.url = `http://www.bing.com/search?q=${value}`
                component.dockbar_icon = 'icon-bing'
                component.title = 'Bing'
                $('body').click()
            })
        }



        winMenuList.top.push({
            name: 'Email',
            image: 'images/metro-icons/blue/gmail_blu.png',
            click: ()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.url = 'http://mail.goyoo.com'
                    component.dockbar_icon = 'icon-email'
                    component.title = 'Goyoo Mail'
                    $('body').click()
                })
            }
        }, {
            name: 'Terminal',
            image: 'images/metro-icons/blue/code_blu.png',
            click: ()=>{
                this.createCmp(TerminalCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.host_ip = this.getRequest().host_ip
                    component.container_id = this.getRequest().container_id
                    $('body').click()
                })
            }
        }, {
            name: 'Bing',
            image: 'images/metro-icons/blue/bing_blu.png',
            click: ()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.url = 'https://bing.com'
                    component.dockbar_icon = 'icon-bing'
                    component.title = 'Bing'
                    $('body').click()
                })
            }
        })

        winMenuList.life.push({
            image: '/images/icons/angular.jpg',
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Angular2'
                    component.dockbar_icon = 'icon-angular'
                    component.url = 'https://angular.io'
                    $('body').click()
                })
            }
        },{
            image: '/images/icons/nodejs.png',
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Node.js'
                    component.dockbar_icon = 'icon-nodejs'
                    component.url = 'http://www.nodejs.org/'
                    $('body').click()
                })
            }
        },{
            image: '/images/icons/webpack.jpg',
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Webpack'
                    component.dockbar_icon = 'icon-webpack'
                    component.url = 'https://webpack.github.io/'
                    $('body').click()
                })
            }
        },{
            image: '/images/icons/typescript.svg',
            big: true,
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'TypeScript'
                    component.dockbar_icon = 'icon-typescript'
                    component.url = 'http://www.typescriptlang.org/'
                    $('body').click()
                })
            }
        })


        winMenuList.browse.push({
            image: '/images/icons/mongodb.png',
            big: true,
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Mongodb'
                    component.dockbar_icon = 'icon-mongodb'
                    component.url = 'https://www.mongodb.com/'
                    $('body').click() 
                })
            }
        },{
            image: '/images/icons/elasticsearch.png',
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Elastic'
                    component.dockbar_icon = 'icon-elastic'
                    component.url = 'https://www.elastic.co/'
                    $('body').click() 
                })
            }
        })


        
        winMenuList.bottom.push({
            name: 'File Exploer',
            image: 'images/metro-icons2/white/Folder.png',
            click: ()=>{
                this.createCmp(FileExplorerCmp).then(ref=>
                {
                    var component = ref['_hostElement'].component
                    component.path = '/'
                    component.setContainer(this.getRequest().host_ip, this.getRequest().container_id)
                    $('body').click()
                })
            }
        })


        this.createCmp(DockbarCmp, false).then(ref=>{
            var component = ref['_hostElement'].component
            
        })

        this.createCmp(DesktopCmp, false).then(ref=>
        {
            var component = ref['_hostElement'].component
            // component.contextmenu = ((x, y)=>
            // {
            //     this.createCmp(MenuCmp, false).then(ref=>
            //     {
            //         var component = ref['_hostElement'].component
            //         component.left = x
            //         component.top = y

            //         component.items = [
            //             { text: '新建', items: [ {text: '文件夹'}, {text: '文本'}] },
            //             { text: '复制' },
            //             { text: '保存' },
            //             { text: '重命名' },
            //             { text: '属性' },
            //         ]
            //     })
            // })
            
            component.items = [{
                icon: 'icon-user',
                text: 'Documents',
                shadow: 'shadow',
                dblclick: ()=>{
                    this.createCmp(FileExplorerCmp).then(ref=>
                    {
                        var component = ref['_hostElement'].component
                        component.title = 'Documents'
                        component.path = '~/'
                        component.setContainer(this.getRequest().host_ip, this.getRequest().container_id)
                    })
                }
            },{
                icon: 'icon-computer',
                text: 'This PC',
                shadow: 'shadow',
                dblclick: ()=>{
                    this.createCmp(FileExplorerCmp).then(ref=>
                    {
                        var component = ref['_hostElement'].component
                        component.path = '/'
                        component.setContainer(this.getRequest().host_ip, this.getRequest().container_id)
                    })
                }
            },{
                icon: 'icon-terminal',
                text: 'Terminal',
                shadow: 'shadow',
                dblclick: ()=>{
                    this.createCmp(TerminalCmp).then(ref=>{
                        var component = ref['_hostElement'].component
                        component.host_ip = this.getRequest().host_ip
                        component.container_id = this.getRequest().container_id
                    })
                }
            }]
        })
    }
}
