import { Component, Inject, ElementRef, Input } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { MenuCmp } from '../menu/menu'
declare var $

var dblclick

export function dblClickEvent(done){
    dblclick = done
}

@Component({
    selector: 'shortcut',
    template: `
        <div id="" class="desktop-icon" style="height:70px">
            <div *ngIf="shortcut" class="icon-block" title="{{shortcut.text}}" (click)="click()" (dblclick)="dblclick(shortcut)" (contextmenu)="rightClick($event)" (click)="hideMenu()">
                <div class="icon-bg {{shortcut && shortcut.icon}}" ></div>
                <div *ngIf="!_rename" class="icon-text{{shortcut && shortcut.shadow?'-shadow':''}}">{{shortcut.text}}</div>
                <div *ngIf="_rename" class="icon-text{{shortcut && shortcut.shadow?'-shadow':''}}">
                    <input (blur)="blur()" (keydown)="keydown($event)" (load)="alert(1)" style="border: 0px;width:100%;height: 15px;" value="{{shortcut.text}}">
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./components/desktop/shortcut/shortcut.css'],
    directives: []
})

export class ShortcutCmp 
{
    _id = 'start';
    element: any 
    @Input() shortcut;
    // _rename = false
    constructor(@Inject(ElementRef) elementRef: ElementRef){
        
        this.element = elementRef.nativeElement    
        // setTimeout(()=> {
        //     this.shortcut.obj = this
        // }, 10);     
    }
    
    click(){
        $('.icon-active').removeClass('icon-active')
		$(this.element).find('.icon-block').addClass('icon-active')
    }

    dblclick(shortcut){
        if( shortcut.dblclick )
            return shortcut.dblclick(shortcut)
        
        dblclick && dblclick(shortcut)
    }
     
    keydown(event){
        // if(event.keyCode==27){
        //     this._rename = false
        // }   
        // if(event.keyCode==13){
        //     $(this.element).find('input').blur()
        // }
    }
    
    blur(){
        // this._rename = false
        // this.shortcut.text = $(this.element).find('input').val()
        // this.shortcut.rename($(this.element).find('input').val())
    }
    
    rename(){
        // this._rename = true
        // setTimeout(()=> {
        //     $(this.element).find('input').focus()
        //     $(this.element).find('input').select()
        // }, 10);
    }
    
    rightClick(event){
        
        $('.icon-active').removeClass('icon-active')
		$(this.element).find('.icon-block').addClass('icon-active')
        
        if( !this.shortcut.menu )
            return 
        
        menuList.splice(0, 100)
        menuList.push({
            top:event.pageY-10,
            left: event.pageX,
            items: this.shortcut.menu 
        })
        
        event.returnvalue=false;
        event.stopPropagation()
        return false
    }
    
    hideMenu(){
        // menuList.splice(0,100)
    }
}
