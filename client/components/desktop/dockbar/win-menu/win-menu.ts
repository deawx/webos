import {Component, ElementRef, DynamicComponentLoader, ViewContainerRef} from '@angular/core';
import { Commander } from '../../tools/commander'
import { UrlAppCmp } from '../../applications/url-app'
import { DomSanitizationService } from '@angular/platform-browser'


export var winMenuList = {top: [], bottom: [], life: [], browse: []}

@Component({
    selector: 'win-menu',
    template: `
        <div class="win-menu-layout" (click)="$event.stopPropagation()"> 
            <div class="bg"></div>
            <div class="win-menu-left" >
                <div style="padding:10px">
                    <div>
                        <img src="images/metro-icons/green/business_grn.png" style="width:33px;height:33px;border-radius:15px;float:left">
                        <span style="line-height:33px;margin-left:10px;font-size:14px;color:#fff">Yoo-Cloud</span>
                    </div>

                    <div style="padding-top:20px;">
                        <span style="font-size: 12px;color: #999;">Most used</span>
                        <ul class="app" style="list-style: none;padding-left: 0px;height:240px;height:310px">
                            <li (click)="item.click()" *ngFor="let item of winMenuList.top">
                                <img src="{{item.image}}"> 
                                <span>{{item.name}}</span>
                            </li>
                           <!--<li>
                                <img src="images/metro-icons/blue/games2_blu.png"> 
                                <span></span>
                            </li>
                            <li>
                                <img src="images/metro-icons/blue/evernote_blu.png"> 
                                <span></span>
                            </li> -->
                        </ul>
                    </div>

                    <div style="padding-top:10px;height:110px">
                        <ul class="app system" style="list-style: none;padding-left: 0px;">
                            <li (click)="item.click()" *ngFor="let item of winMenuList.bottom">
                                <img src="{{item.image}}"> 
                                <span>{{item.name}}</span>
                            </li>
                            
                            <!--<li>
                                <img src="images/metro-icons2/white/Gear.png"> 
                                <span></span>
                            </li>
                            <li>
                                <img src="images/metro-icons2/white/Rotate.png"> 
                                <span></span>
                            </li>
                            <li>
                                <img src="images/metro-icons2/white/Align-left.png"> 
                                <span></span>
                            </li>
                            -->
                        </ul>
                    </div>

                    <div>
                    </div>
                </div>
            </div> 
            <div class="win-menu-right">
                <div style="margin-top:10px;float:left">
                    <span style="line-height:33px;font-size:15px;color:#fff;margin-left:5px">Language and framework</span>
                
                    <div style="width:250px">
                        <div class="{{item.big?'icon-block-big':'icon-block'}}" (click)="item.click()" *ngFor="let item of winMenuList.life">
                            <img style="width:100%;height:100%" src="{{item.image}}">
                        </div>
                    </div>
                </div>
                <div style="margin-top:10px;float:left">
                    <span style="line-height:33px;font-size:15px;color:#fff;margin-left:5px">Database</span>
                
                    <div style="width:250px">
                        <div class="{{item.big?'icon-block-big':'icon-block'}}" (click)="item.click()" *ngFor="let item of winMenuList.browse">
                            <img style="width:100%;height:100%" src="{{item.image}}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./components/dockbar/win-menu/win-menu.css'],
    providers: [],
    directives: []
})

export class WinMenuCmp extends Commander 
{
    clickStart(){
        alert('敬请期待!')
    }
    winMenuList = winMenuList
    constructor(private elementRef: ElementRef){
        super()
    }
    
    email(){
        // this.createCmp(UrlAppCmp).then(ref=>{
        //     var component = ref['_hostElement'].component
        //     console.log(this.sanitizer)
        //     component.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://mail.goyoo.com')
        // })
    }
    click(event){
        event.stopPropagation()
    }
} 
