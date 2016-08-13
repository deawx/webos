import { Component, OnInit, DynamicComponentLoader,ViewContainerRef, Injector, ApplicationRef } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteParams, Router }   from '@angular/router-deprecated';

import { DesktopCmp } from './desktop/desktop'
// import { searchEvent } from './dockbar/start/start'
import { DockbarCmp, dockAppList, searchEvent } from './dockbar/dockbar'
import { FileExplorerCmp } from './file-explorer/file-explorer'
import { TerminalCmp } from './applications/terminal'
import { UrlAppCmp } from './applications/url-app'
import { PdfCmp } from './applications/pdf'
import { VsCodeCmp } from './applications/vscode'
import { MenuCmp } from './menu/menu'
import { Commander } from './tools/commander'
import { dblClickEvent } from './shortcut/shortcut'
import { winMenuList } from './dockbar/win-menu/win-menu'
import { Bash } from './applications/terminal'
import { Webtorrent } from './applications/webtorrent'
import { TorrentSearch } from './applications/torrent-search'
import { PhotoViewer } from './applications/photo-viewer'
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

    constructor(public dcl: DynamicComponentLoader, public viewContainerRef: ViewContainerRef, private sanitizer: DomSanitizationService, private applicationRef: ApplicationRef){
        super()

        window['host_ip'] = this.getRequest().host_ip
        window['container_id'] = this.getRequest().container_id

        console.log()
        // ApplicationRef.tick()

        var bash = new Bash(this.getRequest().host_ip, this.getRequest().container_id)
        
        dblClickEvent((shortcut)=>{
            if( shortcut.type === 'text/plain' || shortcut.type === 'inode/x-empty' ){
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

            if( shortcut.type === 'image/x-icon' || shortcut.type === 'image/png' || shortcut.type === 'image/jpeg'){
                var url = `/getFile/${window['host_ip']}/${window['container_id']}?url=`+shortcut.path.replace(/\/\//g, '/')+'&type='+shortcut.type
                console.log(url)
                this.createCmp(PhotoViewer).then((ref)=>{
                    var component = ref['_hostElement'].component
                    component.url = url
                })
            }

            if( shortcut.type === 'application/x-bittorrent' ){
                this.createCmp(Webtorrent).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.url = shortcut.path
                })
            }
            if( shortcut.type === 'application/pdf' ){
                var url = `/getFile/${window['host_ip']}/${window['container_id']}?url=`+shortcut.path.replace(/\/\//g, '/')+'&type='+shortcut.type
                console.log(url)
                this.createCmp(PdfCmp).then((ref)=>{
                    var component = ref['_hostElement'].component
                    component.url = url
                })
            }

            if( shortcut.type === 'application/zip' )
            {
                var path = shortcut.path.split('/')
                console.log()
                console.log (shortcut.path, path.join('/'))
                bash.unzip(shortcut.path, shortcut.path.substr(0, shortcut.path.indexOf('.')), ()=>{
                    alert(1)
                })
            }
            
            console.log(shortcut)
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
        document.domain = '127.0.0.1'
        window['iframe_var'] = 'hello iframe'
        
        window['webtorrent'] = (url)=>
        {
            console.log(url)
            if( window['cmpList']['Webtorrent'] ){
                window['cmpList']['Webtorrent'].forEach((ref, index)=>
                {
                    ref.destroy()
                })
                window['cmpList']['Webtorrent'] = []
            }

            setTimeout(() => {
                this.createCmp(Webtorrent).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.url = url 
                    this.applicationRef.tick()
                })
            },10)
        }

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
            image: 'images/icons/angular.jpg',
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
            image: 'images/icons/nodejs.png',
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
            image: 'images/icons/webpack.jpg',
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
            image: 'images/icons/typescript.svg',
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
            image: 'images/icons/mongodb.png',
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
            image: 'images/icons/elasticsearch.png',
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
                        component.path = '/root/'
                        component.uploadUrl = '/upload/' + window['host_ip']+'/' +  window['container_id']
                        component.setContainer(this.getRequest().host_ip, this.getRequest().container_id)
                        $('body').click()
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
                        console.log(this.getRequest())
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
                        $('body').click()
                    })
                }
            }/*,{
                icon: 'icon-jav',
                text: 'Jav',
                shadow: 'shadow',
                dblclick: ()=>{
                    this.createCmp(UrlAppCmp).then(ref=>{
                        var component = ref['_hostElement'].component
                        component.url = 'http://127.0.0.1:8008'

                        window['movie_cmp'] = {
                            component: component,
                            destroy: ()=>{
                                ref.destroy()
                            }
                        }
                    })
                }
            }*/,{
                icon: 'icon-torrent',
                text: 'Torrent',
                shadow: 'shadow',
                dblclick: ()=>{
                    
                    this.createCmp(TorrentSearch).then(ref=>{
                        var component = ref['_hostElement'].component
                        component.dockbar_icon = 'icon-torrent'
                        // component.url = url
                    })
                }
            }]
        })
    }
}
