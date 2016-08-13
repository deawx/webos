import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { ShortcutCmp } from '../shortcut/shortcut'
import { Dialog } from '../../directives/dialog'
import { getUid } from '../tools/util'
declare var $, Terminal, io, WebTorrent

@Component({
    selector: 'url-app',
    template: `
        <div dialog class="" title="{{title}}" style="width:986px;height:500px">
            <div class="dialog-body" >
                <a (click)="play(i)" *ngFor="let file of fileList; let i = index">{{file}}</a>
            </div>
        </div>
    `,
    styles: [`
        .dialog-body video{
            width: 100%;
            height: 100%
        }
    `],
    directives: [ Dialog ]
})

export class Webtorrent implements OnInit ,OnDestroy
{
    title = 'Url-App'
    url
    socket
    constructor(private elementRef: ElementRef){
        
    }

    play(i){
        $(this.elementRef.nativeElement).find('.dialog-body').html(`<iframe allowfullscreen=true src="http://${ window['host_ip'].split(':')[0]}:8005/${i}" style="width:100%;height:100%;border:0px"></iframe>`)
    }

    fileList = []

    ngOnDestroy(){
        this.socket.disconnect()
    }

    ngOnInit(){
        var client = new WebTorrent()

        //  this.url = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'
        // this.url = '/root/3.torrent'
        
        this.socket = io.connect(`http://${ window['host_ip'].split(':')[0]}:8004`)
        this.socket.emit('createWebTorrent', this.url, (fileList)=>{
            this.fileList = fileList
        })
    }
}
