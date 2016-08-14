import {Component, ElementRef, Inject, Input} from '@angular/core'
import {NgClass} from '@angular/common'
import { Commander, CmpTool } from '../../tools/commander'

declare var $, html2canvas

export var dockAppList = []

@Component({
    selector: 'dock-app', 
    styleUrls: [ './components/desktop/dockbar/dock-item/dock-item.css' ],
    directives: [ NgClass ],
    template:  `
        <div (mouseenter)="mouseenter(dock.items)" (mouseleave)="mouseout()" (click)="clickIcon(dock)" *ngIf="dock.items.length" [ngClass]="{ 'dockbar-icon-many': dock.items.length > 1 }" class="dockbar-icon">
            <div  class="dockbar-icon-img {{dock.icon}}">
            </div>
        </div>
        
        <div id="app-icon-block-{{dock._id}}" *ngIf="dock.items && dock.items.length" (mouseenter)="_mouseenter()"  (mouseleave)="mouseout()" class="app-block" style="display:none"> 
            <div *ngFor="let item of dock.items" (mouseenter)="item_mouseenter(item)" (mouseleave)="item_mouseout(item)"  class="app-item"> 
                <div class="title"> 
                    <div class="img {{dock.icon}}"> 
                        &nbsp;&nbsp;&nbsp;&nbsp; 
                    </div> 
                    {{item.title}}
                    <div class="close" (click)="close(item)"> 
                        &nbsp;&nbsp;&nbsp;&nbsp; 
                    </div>
                </div> 
                <div class="body" style="text-align:center" (click)="clickItem(item)">
                    <img *ngIf="item.url" src="{{item.url}}" style="height:100px">
                    <div *ngIf="!item.url" id="dock_view_{{item._id}}"  style="width:100%;height:100px"></div>
                </div> 
            </div> 
        </div>  
    `
})

class DockAppCmp {
    _id = 'f';
    element
    @Input() dock;
    hideTimeout: any;
    showTimeout: any;
    beforeShowItems = []
    
    constructor(private elementRef: ElementRef){
        this.element = $(this.elementRef.nativeElement)
    }
    
    _mouseenter(){
        clearTimeout(this.hideTimeout)
    }

    mouseenter(items,time = 200)
    {
        if( items.length < 2 )
            return

        clearTimeout(this.hideTimeout)
        this.showTimeout = setTimeout(()=> 
        {
            var left = this.element.find('.dockbar-icon').position().left - (this.element.find('.app-block').width() + 10) /2 + this.element.find('.dockbar-icon').width()/2
            this.element.find('.app-block').css('left', left + 'px')

            if( time === 0 )
                return 

            if( !this.element.find('.app-block').is(':hidden') )
                return 

            this.element.find('.app-block').show()

            this.dock.items.forEach(item => {
                var isHidden = $(`#${item._id}`).children().is(':hidden')
                var zIndex = 0
                if( isHidden ){
                    zIndex = $(`#${item._id}`).children().css('z-index')
                    $(`#${item._id}`).children().css('z-index', -100)
                    $(`#${item._id}`).children().show()
                }

                html2canvas($(`#${item._id}`).find('.dialog-body'), {
                    onrendered: (canvas)=> {
                        if( isHidden ){
                            $(`#${item._id}`).children().hide()
                            $(`#${item._id}`).children().css('z-index', zIndex)
                        }
                        $(`#dock_view_${item._id}`).html(canvas);
                        $(canvas).css('height','100px')
                        $(canvas).css('width','160px')
                    }
                });
            });
        }, time);
    }

    clickIcon(dock)
    {
        if( dock.items.length != 1 )
            return 

        const item = dock.items[0].element.find('.desktop-window')

        if(!item.is('.focus') && !item.is(':hidden')){
            $('.desktop-window').removeClass('focus');
            item.css('z-index', window['zIndex']++);
            return item.addClass('focus');
        }

        $('.desktop-window').removeClass('focus');
        if(item.is(':hidden')){
            item.show();    //如果元素为隐藏,则将它显现
            item.css('z-index', window['zIndex']++);
            item.addClass('focus');
        }else{
            item.hide();     //如果元素为显现,则将其隐藏
        }
    }

    mouseout(time = 150)
    {
        clearTimeout(this.showTimeout)
        this.hideTimeout = setTimeout(()=>{
            this.element.find('.app-block').hide()
        }, time)
    }
    
    item_mouseenter(item)
    {
        $('.desktop-window').each((index, item)=>{
            if( $(item).css('display') == 'block' )
                this.beforeShowItems.push(item)
        })
        
        $('.desktop-window').hide()
        item.element.find('.desktop-window').show()
    }
    
    item_mouseout(item)
    {
        item.element.find('.desktop-window').hide()
        this.beforeShowItems.forEach((item)=>{
            $(item).show()
        })
        
        this.beforeShowItems = []
    }
    
    close(item)
    {
        CmpTool.destroy(item._id)

        // if( this.dock.items.length < 2 ){
        //     this.mouseenter(this.dock.items)
        //     setTimeout(()=> {
        //         this.element.find('.app-block').hide()
        //     });
        //     return 
        // }

        if( this.dock.items.length > 0)
            this.mouseenter(this.dock.items, 0)
    }

    clickItem(item){
        this.element.find('.app-block').hide()
        this.beforeShowItems.push(item.element.find('.desktop-window')[0])
        item.element.find('.desktop-window').css('z-index', window['zIndex']++);
        
        $('.desktop-window').removeClass('focus');
        item.element.find('.desktop-window').addClass('focus');
        item.element.find('.desktop-window').show()
    }
}

@Component({
    selector: 'dock',
    template: `
        <div id="{{_id}}" class="dock">
            <dock-app *ngFor="let dock of dockAppList" [dock]="dock"></dock-app>
        </div>
    `,
    styleUrls: ['./components/desktop/dockbar/dock-item/dock-item.css'],
    directives: [DockAppCmp]
})

export class DockCmp {
    _id = 'dock';
    @Input() docks;
    dockAppList = dockAppList
    constructor(@Inject(ElementRef) elementRef: ElementRef){
    }
}
