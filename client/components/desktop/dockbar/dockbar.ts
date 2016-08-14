import {Component, Input} from '@angular/core';
// import {NgStyle} from 'angular2/common';

import { StartCmp, searchEvent } from './start/start';
import { DockCmp, dockAppList } from './dock-item/dock-item';


export { searchEvent }

@Component({
    selector: 'dockbar',
    template: `
        <div id="{{_id}}" class="dockbar">
            <div class="dockbar-block">
                <start></start>
                <div class="dockbar-work" (click)="work()"><div></div></div>
                <dock></dock>
                <div class="dockbar-clock" (click)="clickTime()">
                    <div id="time">{{time | date:'HH'}}:{{time | date:'mm'}}</div>
                    <div id="date">{{time | date:'yyyy'}}-{{time | date:'MM'}}-{{time | date:'dd'}}</div>
                </div>
            </div>
        </div>
    `,   
    styleUrls: ['./components/desktop/dockbar/dockbar.css'], 
    directives: [StartCmp, DockCmp]
})

export class DockbarCmp {
    _id = 'dockbar';
    // @Input() docks;
    time = new Date
    work(){
        alert('to be continued')
    }
    clickTime(){
        alert('to be continued')
    }
    constructor(){
        setTimeout(()=> {
            this.time = new Date
        }, 1000);
    }
}

export { dockAppList }