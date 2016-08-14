import { Component, ElementRef } from '@angular/core'
import { WinMenuCmp } from '../win-menu/win-menu'

export var searchEvent = { search: function(value){} } 
declare var $
@Component({
    selector: 'start',
    template: `
        <div class="dockbar-start"> 
            <div class="start-button" [ngClass]="{'start-butto-active': isShow}" (click)="clickStart()"></div> 
            <div class="dockbar-search"> 
                <input (focus)="clickStart(true)" (click)="$event.stopPropagation()" #searchValue (keydown.enter)="search(searchValue.value)" type="text" placeholder="Search the web and Windows">  
            </div>

            <win-menu *ngIf="isShow" ></win-menu>
        </div>
    `,
    styleUrls: ['./components/desktop/dockbar/start/start.css'],
    directives: [ WinMenuCmp ]
})

export class StartCmp {
    _id = 'start'; 
    isShow=false
    element

    constructor(private elementRef: ElementRef){
        this.element = $(this.elementRef.nativeElement)
    }

    search(value){
        searchEvent.search(value)
    }
    
    clickStart(isShow)
    {
        this.isShow = isShow || !this.isShow

        if( !this.isShow )
            return 
        
        this.element.find('input').focus()

        setTimeout(()=> {
            $(document).one('click', ()=>{
                this.isShow = false
                this.element.find('input').val('')
            })
        });
    }
}
