import {Component, Input, Inject, ElementRef, DynamicComponentLoader,ViewContainerRef} from '@angular/core';
import {NgStyle} from '@angular/common';
import {getUid} from '../tools/util';

import { Commander, CmpTool } from '../tools/commander'
declare var $
var hideTimeout:any = 0;

export var menuList = []

@Component({
    selector: 'menu',
    template: `
        <div class="content-menu" [ngStyle]="{'top': top+'px', 'left': left+'px'}" (mouseenter)="mouseenter()" (mouseleave)="mouseout()" >
            <ul>
                <li *ngFor="let item of items" (click)="handler(item, $event)" id="{{item._id}}" (mouseenter)="mouseenterItem(item.items, $event)" (mouseleave)="mouseoutItem($event, item)">
                    <a>{{item.text}}</a><div *ngIf="item.items"  class="right-arrows"></div>
                </li>
            </ul>
        </div>
    `,
    styleUrls: ['./components/desktop/menu/menu.css'],
    directives: [NgStyle]
})

export class MenuCmp extends Commander{
    element: any
    items
    top = 0
    left = 0
    constructor(public elementRef: ElementRef, public dcl: DynamicComponentLoader, public viewContainerRef: ViewContainerRef)
    {
        super()
        this.element = elementRef.nativeElement
        
        $(document).one('click', ()=>{
            CmpTool.destroy($(this.element).attr('id'))
        })
        // setTimeout(()=> {
        //     this.items.forEach((item)=>{
        //         item._id = getUid(16)
        //     })
        // });
	}
    
    mouseoutItem(event, item)
    {
        if( !item.items )
            return 
        // hideTimeout = setTimeout(()=> {
        //     if( this.config.mouseoutHide )
        //         return 
                
        //     menuList.forEach((item, index)=>{
        //         if(item._id === 'p'+ $(event.target).attr('_id')){
        //             menuList.splice(index, 1)
        //         }
        //     })
        // }, 1);
    }

    handler(item, event){
            
        if( item.click )
            item.click()

        if( item.items ){
            event.returnvalue=false;
            event.stopPropagation()
        }
        // alert(1)
        // menuList.splice(0, 100)
        setTimeout(function() {
            item.handler()
        }, 10);
        return false
    }
    
    mouseenter(){
        // clearTimeout(hideTimeout)
    }
    
    mouseout()
    {
        // if( !this.config.mouseoutHide )
        //     return 
        // menuList.forEach((item, index)=>{
        //     if(item._id === this.config._id){
        //         menuList.splice(index, 1)
        //     }
        // })
    }
    childRef
    mouseenterItem(items, event)
    {
        if( this.childRef )
            this.childRef.destroy()
            
        if( !items )
            return 
        
        this.createCmp(MenuCmp, false).then(ref=>
        {
            const component = ref['_hostElement'].component
            const liPosition = $(event.target).position()
            const menuPosition = $(this.element).find('.content-menu').position()
            const top = liPosition.top + menuPosition.top
            const left = liPosition.left + menuPosition.left + $(this.element).find('.content-menu').width()
            
            component.items = items
            component.top = top
            component.left = left

            this.childRef = ref
        })
    }
}
