import { Component, OnInit, DynamicComponentLoader,ViewContainerRef, Injector, ApplicationRef } from '@angular/core';

import { DesktopCmp } from './desktop/desktop'
import { ActivatedRoute } from '@angular/router'
import { DockbarCmp, dockAppList, searchEvent } from './dockbar/dockbar'
import { FileExplorerCmp } from './file-explorer/file-explorer'
import { TerminalCmp } from './applications/terminal'
import { UrlAppCmp } from './applications/url-app'
import { PdfCmp } from './applications/pdf'
import { VsCodeCmp } from './applications/vscode'
import { MenuCmp } from './menu/menu'
import { Commander } from './tools/commander'
import { dblClickEvent, contextmenuEvent } from './shortcut/shortcut'
import { winMenuList } from './dockbar/win-menu/win-menu'
import { Bash } from './applications/terminal'
import { Webtorrent } from './applications/webtorrent'
import { TorrentSearch } from './applications/torrent-search'
import { PhotoViewer } from './applications/photo-viewer'
import { DomSanitizationService } from '@angular/platform-browser'
declare var io ,  $   

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
    host
    container
    copyPath
    bash
    constructor(public activatedRoute: ActivatedRoute, public dcl: DynamicComponentLoader, public viewContainerRef: ViewContainerRef, private sanitizer: DomSanitizationService, private applicationRef: ApplicationRef){
        super()
        
        
        this.activatedRoute.params.subscribe(params => {
            this.container = params['container']
            this.host = params['host']
            console.log(this.host, this.container)
            this.bash = new Bash(this.host, this.container)
        })
        

        
        contextmenuEvent((event, shortcut)=>
        {
            this.createCmp(MenuCmp, false).then(ref=>{
                var component = ref['_hostElement'].component
                component.top = event.pageY-10
                component.left = event.pageX

                component.items = [{
                    text: 'Open',
                    handler: (event)=>{
                        shortcut.dblclick()       
                    }
                }, {
                    text: "Rename",
                    handler: (event)=>
                    {
                        shortcut.rename = (val)=>{
                            var newPath = shortcut.shortcut.path.split('/')
                            newPath.pop()

                            this.bash.mv(shortcut.shortcut.path, `${newPath.join('/')}/${val}`, ()=>{
                                this.refresh()
                            })
                        }
                        shortcut.onRename()
                    }
                },{
                    text: 'Copy',
                    handler: (event)=>{
                        this.copyPath = shortcut.shortcut.path
                    }
                }, {
                    text: "Delete",
                    handler: (event)=>{
                        if( !confirm("delete?") )
                            return 

                        this.bash.rm(shortcut.shortcut.path, ()=>{
                            this.refresh()
                        })
                    }
                }]
                //component.setUrl(url, this.host)
                //this.applicationRef.tick()
            })
        })

        dblClickEvent((shortcut)=>{
            if( shortcut.type === 'text/plain' || shortcut.type === 'inode/x-empty' ){
                this.bash.cat(shortcut.path, (err, data)=>{
                    this.createCmp(VsCodeCmp).then((ref)=>{
                        var component = ref['_hostElement'].component
                        component.text = data
                        component.title = shortcut.path.split('/').pop()
                        component.onSave = (text)=>{
                            text = text.replace(/\n/g, '').replace(/\n$/, '')
                            this.bash.write(shortcut.path, text, (err)=>{

                            })
                        }
                    })
                })
            }

            if( shortcut.type === 'image/x-icon' || shortcut.type === 'image/png' || shortcut.type === 'image/jpeg'){
                var url = `/getFile/${this.host}/${this.container}?url=`+shortcut.path.replace(/\/\//g, '/')+'&type='+shortcut.type
                console.log(url)
                this.createCmp(PhotoViewer).then((ref)=>{
                    var component = ref['_hostElement'].component
                    component.setUrl(url) 
                })
            }

            if( shortcut.type === 'application/x-bittorrent' ){
                this.createCmp(Webtorrent).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.setUrl(shortcut.path, this.host)
                })
            }
            if( shortcut.type === 'application/pdf' ){
                var url = `/getFile/${this.host}/${this.container}?url=`+shortcut.path.replace(/\/\//g, '/')+'&type='+shortcut.type
                console.log(url)
                this.createCmp(PdfCmp).then((ref)=>{
                    var component = ref['_hostElement'].component
                    component.setUrl(url)
                })
            }

            if( shortcut.type === 'application/zip' )
            {
                var path = shortcut.path.split('/')
                console.log()
                console.log (shortcut.path, path.join('/'))
                this.bash.unzip(shortcut.path, shortcut.path.substr(0, shortcut.path.indexOf('.')), ()=>{
                    this.refresh()
                })
            }
            
            console.log(shortcut)
        })
    }

    refresh(){
        if( window['cmpList']['FileExplorerCmp'] ){
            window['cmpList']['FileExplorerCmp'].forEach((ref, index)=>{
                var component = ref['_hostElement'].component
                component.refresh()
            })
        }
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
                    component.setUrl(url, this.host)
                    this.applicationRef.tick()
                })
            },10)
        }

        window['web-desktop'] = true

        searchEvent.search = (value) =>
        {
            this.createCmp(UrlAppCmp).then(ref=>{
                var component = ref['_hostElement'].component
                component.setUrl(`http://www.bing.com/search?q=${value}`)
                component.dockbar_icon = 'icon-bing'
                component.title = 'Bing'
                $('body').click()
            })
        }

        winMenuList.top.push(
        //     {
        //     name: 'Email',
        //     image: 'images/metro-icons/blue/gmail_blu.png',
        //     click: ()=>{
        //         this.createCmp(UrlAppCmp).then(ref=>{
        //             var component = ref['_hostElement'].component
        //             component.setUrl('http://mail.goyoo.com')
        //             component.dockbar_icon = 'icon-email'
        //             component.title = 'Goyoo Mail'
        //             $('body').click()
        //         })
        //     }
        // }, 
        {
            name: 'Terminal',
            image: 'images/metro-icons/blue/code_blu.png',
            click: ()=>{
                this.createCmp(TerminalCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.host_ip = this.host
                    component.container_id = this.container
                    $('body').click()
                })
            }
        }, {
            name: 'Bing',
            image: 'images/metro-icons/blue/bing_blu.png',
            click: ()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.setUrl('https://bing.com')
                    component.dockbar_icon = 'icon-bing'
                    component.title = 'Bing'
                    $('body').click()
                })
            }
        })

        winMenuList.life.push({
            image: 'images/icons/angular2.jpg',
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Angular2'
                    component.dockbar_icon = 'icon-angular'
                    component.setUrl('https://angular.io')
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
                    component.setUrl('http://www.nodejs.org/')
                    $('body').click()
                })
            }
        },{
            image: 'images/icons/webpack.svg',
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'Webpack'
                    component.dockbar_icon = 'icon-webpack'
                    component.setUrl('https://webpack.github.io/')
                    $('body').click()
                })
            }
        },{
            image: 'images/icons/typescript.png',
            big: true,
            click:()=>{
                this.createCmp(UrlAppCmp).then(ref=>{
                    var component = ref['_hostElement'].component
                    component.title = 'TypeScript'
                    component.dockbar_icon = 'icon-typescript'
                    component.setUrl('http://www.typescriptlang.org/')
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
                    component.setUrl('https://www.mongodb.com/')
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
                    component.setUrl('https://www.elastic.co/')
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
                    component.setContainer(this.host, this.container)
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
                        component.uploadUrl = '/upload/' + this.host+'/' +  this.container
                        component.setContainer(this.host, this.container)
                        component.rightClick = (event)=>{
                            this.createFileExplorerMenu(event, component)
                            event.returnvalue=false;
                            event.stopPropagation()
                            return false
                        }
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
                        component.setContainer(this.host, this.container)
                        component.rightClick = (event)=>{
                            this.createFileExplorerMenu(event, component)
                            event.returnvalue=false;
                            event.stopPropagation()
                            return false
                        }
                    })
                }
            },{
                icon: 'icon-terminal',
                text: 'Terminal',
                shadow: 'shadow',
                dblclick: ()=>{
                    this.createCmp(TerminalCmp).then(ref=>{
                        var component = ref['_hostElement'].component
                        component.host_ip = this.host
                        component.container_id = this.container
                        $('body').click()
                    })
                }
            }
            // ,{
            //     icon: 'icon-torrent',
            //     text: 'Torrent',
            //     shadow: 'shadow',
            //     dblclick: ()=>{
                    
            //         this.createCmp(TorrentSearch).then(ref=>{
            //             var component = ref['_hostElement'].component
            //             component.dockbar_icon = 'icon-torrent'
            //             // component.url = url
            //         })
            //     }
            // }
            ]
        })
    }
    createFileExplorerMenu(event, component)
    {
        this.createCmp(MenuCmp, false).then(ref=>{
            var menu = ref['_hostElement'].component
            menu.top = event.pageY-10
            menu.left = event.pageX

            menu.items = [{
                text: "New",
                items: [{
                    text: 'Folder',
                    handler: ()=>{
                        this.bash.mkdir(component.path+'/NewFolder', ()=>{
                            this.refresh()
                        })
                    }
                }, {
                    text: 'Text Document',
                    handler: ()=>{
                        this.bash.touch(component.path+'/NewDocument', ()=>{
                            this.refresh()
                        })
                    }
                }],
                handler: function(event){
                    
                }
            }, {
                text: "Refresh",
                handler: function(event) 
                {
                    component.refresh()   
                }
            }, {
                text: "Paste",
                disabled: this.copyPath,
                handler: (event)=>
                {
                    var filename = this.copyPath.split('/').pop() + '_copy'
                    
                    this.bash.cp(this.copyPath, component.path + '/' + filename, ()=>{
                        this.refresh()
                    })
                }
            }]

            
            //component.setUrl(url, this.host)
            //this.applicationRef.tick()
        })
    }
}
