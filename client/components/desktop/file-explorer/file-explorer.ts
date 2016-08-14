import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { NgClass } from '@angular/common';
import { ShortcutCmp } from '../shortcut/shortcut'
import { Dialog } from '../../../directives/dialog'
import { Bash } from '../applications/terminal'
declare var $ , fefef

var iconMap = {
    'inode/directory': 'icon-folder',
    'text/plain': 'icon-textfile',
    'inode/x-empty': 'icon-textfile',
    'image/x-icon':'icon-photo',
    'image/png':'icon-photo',
    'image/jpeg':'icon-photo',
    'application/pdf':'icon-pdf',
    'application/zip':'icon-zip',
}

@Component({
    selector: 'file-explorer',
    template: `
        <div dialog title="{{title}}" style="width:900px;height:400px">
            <div class="fb-tool" style="">
                <div class="icon fb-icon-go" [ngClass]="{'fb-icon-back-active': backs.length, 'fb-icon-back': !backs.length}" (click)="back()"></div>
                <div class="icon fb-icon-go fb-icon-ahead" [ngClass]="{'fb-icon-ahead-active': aheads.length, 'fb-icon-ahead': !aheads.length}" (click)="ahead()"></div>
                <div class="fb-src-input">
                    <div class="fb-icon-computer"></div>
                    <input type="text" class="fb-path-input" readonly="readonly" value="{{path}}" />
                </div>
                <div class="fb-icon-refresh" (click)="refresh()" style=""> 
                    <div class="refresh"></div>
                </div>
            </div>
            <div class="body dialog-body" style="overflow-y: auto;height:100%;width:100%;padding-top: 40px;" (contextmenu)="rightClick($event)" (click)="hideMenu()">
                <div class="layout-table" *ngIf="fileList">
                    <shortcut style="float:left" *ngFor="let shortcut of fileList" [shortcut]="shortcut"></shortcut>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./components/file-explorer/file-explorer.css'],
    directives: [ Dialog, ShortcutCmp, NgClass ]
})

export class FileExplorerCmp implements OnDestroy
{
    title = 'File Explorer'
    shortcuts = []
    dockbar_icon = 'dockbar-icon-folder'
    element: any
    @Input() config
    width = 810
    bash: Bash
	height = 500
    path = '/'
    backs = []
    aheads = []
    uploadUrl = ''
    fileList = []
	constructor(elementRef: ElementRef){
        this.element = $(elementRef.nativeElement)
	}

    ngAfterViewInit(){
        if( this.uploadUrl )
            this.dropbox()
    }

    onResize(){
        this.element.find('.dialog-body').height(this.element.find('.dialog-body').height()-41)
        this.element.find('.dialog-body').width(this.element.find('.dialog-body').width())
    }
    
    setContainer(host_ip, container_id){
        this.bash = new Bash(host_ip, container_id)
        this.bash.afterInit = (()=>{
            this.setPath(this.path, false)
        })
    }

    setPath(path, isPush = true)
    {
        this.fileList = []
        if( isPush ){
            this.backs.push(this.path)
        }
        this.path = path
        this.bash.ls(path, data=>
        {
            data.forEach((item)=>
            {
                item.text = item.name

                item.icon = iconMap[item.type] || 'icon-file'

                if( item.icon === 'icon-folder' ){
                    item.dblclick = (data)=>{
                        this.setPath(data.path.replace('//', '/'))
                    }
                }

                this.fileList.push(item)
            })
        })
    }

    ngOnDestroy(){
        // alert('destroy')
        
    }
    
    rightClick(event){
        
    }
    
    hideMenu(){
        
    }
    
    dropbox(){
        
        var dropbox = $(this.element).find('.body')[0]
        
        dropbox.addEventListener("dragenter", function(e){  
            dropbox.style.background = '#f2f2f2';  
        }, false);  
        dropbox.addEventListener("dragleave", function(e){  
            dropbox.style.background = '#fff';  
        }, false);  
        dropbox.addEventListener("dragenter", function(e){  
            e.stopPropagation();  
            e.preventDefault();  
        }, false);  
        dropbox.addEventListener("dragover", function(e){  
            e.stopPropagation();  
            e.preventDefault();  
        }, false);  
        dropbox.addEventListener("drop", (e)=>{  
            e.stopPropagation();  
            e.preventDefault();  
            dropbox.style.background = '#fff';  
            console.log(e.dataTransfer.files[0])
            // handleFiles(e.dataTransfer.files);  
            this.uploadFile(e.dataTransfer.files[0],1)
            // submit.disabled = false;  
        }, false);  
    }
     
    uploadFile(file, status) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.uploadUrl + '?path='+this.path);
        xhr.onload = ()=> {
            this.refresh()
        };
        xhr.onerror = function() {
            console.log(this.responseText)
            console.log(file.size);
        };
        xhr.upload.onprogress = function(event) {
            // handleProgress(event);
            console.log(event)
        }
        xhr.upload.onloadstart = function(event) {
            
        }
        
        // prepare FormData
        var formData = new FormData();
        formData.append('myfile', file);
        xhr.send(formData);
    }
    
    refresh(){
        this.setPath(this.path, false)
    }
    
    back()
    {
        if (this.backs.length) 
        {
            var path = this.backs.pop()
            this.aheads.push(this.path)
            this.setPath(path, false)
        }
    } 
    
    ahead()
    {
        if (this.aheads.length)
        {
            var path = this.aheads.pop()
            this.backs.push(this.path)
            this.setPath(path, false)
        }
    }
}
