import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { ShortcutCmp } from '../shortcut/shortcut'
import { Dialog } from '../../../directives/dialog'
import { getUid } from '../tools/util'
import { Http, Response, RequestOptions, Headers } from '@angular/http'
declare var $, Terminal, io, WebTorrent

@Component({
    selector: 'torrent-search',
    template: `
        <div dialog class="" title="{{title}}" style="width:986px;height:500px">
            <div class="dialog-body" style="text-align:center" style="overflow: auto">
                <div style="width:80%;margin:auto;margin-top:15px;font-size:20px;">
                    <input type="text" #keyword style="width:80%;font-size:20px;height:30px;float:left">
                    <button (click)="search(keyword.value)" style="width:19%;height:36px;float:right;">search</button>
                </div>
                
                <div style="clear:left"></div>

                <div style="width:100%;margin-top:30px;text-align: center;">

                    <div *ngIf="!dataList">
                        请输入查询内容
                    </div>

                    <div *ngIf="dataList && !dataList.length">
                        没有找到结果
                    </div>

                    <table *ngIf="dataList && dataList.length" style="width:80%;margin:auto;text-align:left">
                        <tr *ngFor="let data of dataList">
                            <td style="font-size:12px">
                                {{data.title}} 
                            </td>
                            <td style="text-align:right">
                                <button (click)="play('magnet:?xt=urn:btih:'+data.torrent_hash)" >play in container</button>
                            </td>
                        </tr>
                    </table>
                </div>
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

export class TorrentSearch implements OnInit
{
    title = 'Torrent Search'
    dataList
    constructor(private elementRef: ElementRef, http: Http){

        var opts = new RequestOptions({
            headers: new Headers({
                'Access-Control-Allow-Origin': '*'
            })
        })
        //     //    <iframe src="http://www.btmap.net/search/%E5%B9%BB%E5%9F%8E_ctime_1.html"></iframe>
        // http.get('http://127.0.0.1:8008/torrent/abc', opts).subscribe((data)=>{
        //     console.log(data)
        // })

        
    }
    play(mag){
        console.log(mag)
        window['webtorrent'](mag)
    }
    search(keyword){
        $.ajax({
            type: "GET",
            url: `http://127.0.0.1:8008/torrent/${encodeURI(keyword)}`,
            dataType: "jsonp",
            jsonp: "callback",
            success:  (result) => {
                this.dataList = result
            },
            complete: function(){
                // alert(2)
            },
            error: function(err){
                console.log(err)
            }
        })
    }

    ngOnInit(){
        
    }
}
