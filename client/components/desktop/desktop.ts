import { Component, Input } from '@angular/core'
import { CORE_DIRECTIVES } from '@angular/common'
import { ShortcutCmp } from '../shortcut/shortcut'
declare var $

@Component({
    selector: 'desktop',
    template: `
        <div style="width:100%;height:100%" (contextmenu)="_contextmenu($event)">
            <div class="fullscreen_post_bg" style="background-image:url(images/img1.jpg)" ></div> 
            <div class="body">
                <div class="layout-table">
                    <div class="horizontal">
                        <shortcut *ngFor="let shortcut of items" [shortcut]="shortcut"></shortcut>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .fullscreen_post_bg img {
            display: none;
        }
        
        .fullscreen_post_bg {
            background-position: 50% 50%;
            background-size: cover;
            bottom: 0;
            left: 0;
            position: fixed;
            right: 0;
            top: 0;
            z-index:-1;
        }
    `],
    directives: [ ShortcutCmp ]
})

export class DesktopCmp 
{
    _id = 'desktop'; 
    items;
    s = {}
    background_image = 'images/img1.jpg'
    constructor(){
        // this.shortcuts = []
    }

    _contextmenu(event)
    {
        // if(3 == event.which){ 
            // alert('这 是右键单击事件'); 
        // }
        event.returnvalue=false;
        event.stopPropagation()
        this.contextmenu(event.clientX, event.clientY)
        return false

    }

    contextmenu(x, y){
        
    }

    click(){
        // menuList.splice(0,100)
    }
}
