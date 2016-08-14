import { Component, ElementRef, Input, OnDestroy } from '@angular/core'
import { ShortcutCmp } from '../shortcut/shortcut'
import { Dialog } from '../../../directives/dialog'
import { getUid } from '../tools/util'
declare var $, ace

@Component({
    selector: 'vs-code',
    template: `
        <div dialog class="" title="{{title}}" style="width:630px;height:400px">
            <div id="{{_id}}" class="dialog-body" style=""></div>
        </div>
    `,
    styleUrls: [],
    directives: [ Dialog ]
})

export class VsCodeCmp 
{
    title = 'Visual Studio Code'
    editor
    text
    _id = getUid(16)
    dockbar_icon = 'icon-vscode'
    constructor(){
        document.onkeydown = (event)=>
        {
            if ((event.altKey)&&(event.keyCode==83))
            {
                event['returnValue'] = false;

                if( !this.editor.isFocused() )
                    return

                this.onSave && this.onSave(this.editor.getValue())
            }
        }
    }

    onSave(value){

    }

    onResize(){
        if( this.editor)
            this.editor.resize(true)
    }
    ngAfterViewInit(){
        this.editor = ace.edit(this._id)
        this.editor.setValue(this.text)
        setTimeout(()=> {
            this.editor.clearSelection()
        });
        // editor.setTheme("ace/theme/twilight");
    }
}
