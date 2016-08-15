import { Component, ElementRef, Input, OnDestroy } from '@angular/core'
import { ShortcutCmp } from '../shortcut/shortcut'
import { Dialog } from '../../../directives/dialog'
import { getUid } from '../tools/util'
declare var $, Terminal, io

@Component({
    selector: 'file-browser',
    template: `
        <div dialog class="" title="{{title}}" style="width:700px;height:400px">
            <div class="terminal-window dialog-body" ></div>
        </div>
    `,
    styleUrls: [],
    directives: [ Dialog ]
})

export class TerminalCmp 
{
    title = 'Terminal'
    element 
    max = false
    host_ip: ''
    container_id = '7d6de8abe4f9'
    dockbar_icon = 'icon-terminal'
    _id = getUid(16)
    term 
    socket
    timeout
    term_id
	constructor(elementRef: ElementRef){
        
        this.element = elementRef.nativeElement
        var isLoad = $(this.element).find('.panel').attr('dialog') === 'dialog'
        
		setTimeout(()=> {
            if( isLoad )
                return ;
			this.setTerminal()
		}, 100);
	}
    onresize(){
    }
	afterDestroy(){
        
    }
	setTerminal(){
		this.term = new Terminal({}) 
		this.socket = io.connect("http://"+(window.location.host || '127.0.0.1:8004'))
		var term_id = this.container_id+'§'+ this.host_ip+'§' + this._id


		this.socket.emit('createTerminal', term_id, (term_id)=>
		{
            this.term_id = term_id
			this.term.on('data', (data)=>{
				this.socket.emit('data'+term_id, data)
			})
            
			this.term.open($(this.element).find('.terminal-window')[0])
			
			this.socket.on('data'+term_id, (data)=>{ 
				this.term.write(data)
			})
			
			$(window).resize(()=>{
				this.term.sizeToFit()
				this.socket.emit('resize'+term_id, {
					cols: this.term.cols,
					rows: this.term.rows
				})
			})
			
			$(window).trigger('resize')
		});
	}

    onResize(){
        clearTimeout(this.timeout)
        this.timeout = setTimeout(()=> {
            if( !this.term )
                return 
            this.term.sizeToFit()
            
            this.socket.emit('resize'+this.term_id, {
                cols: this.term.cols,
                rows: this.term.rows
            })
        }, 10);
    }
}



export class Bash
{
    socket;term_id;callback;_id = getUid(16)
    container_id
    host_ip
    constructor(host_ip, container_id){
        this.container_id = container_id
        this.host_ip = host_ip
        if( container_id )
            this.setTerminal()
    }
    
    afterInit(){

    }

    setTerminal()
    {
        var term_id = this.container_id +'§' + this.host_ip +'§' + this._id
		this.socket = io.connect("http://"+(window.location.host || '127.0.0.1:8004'))
        this.socket.emit('createTerminal', term_id, (term_id)=>
        {
            var str = ''
            
            this.term_id = term_id
            this.socket.on('data'+term_id, (data)=>{
                // console.log(data.toString().replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, ''))
                str += data.toString().replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '')
                if ( /[\d\w]+:\//.test(str.trim()) && /#$/.test(str.trim())){
                    // console.log('nathch ', !!this.callback)
                    this.callback && this.callback(str)
                    str = ''
                }else{
                    // console.log(data.toString())
                }
            })
            this.afterInit()
        })
    }

    public cat(path, done){
        this.callback = (data)=>{
            this.callback = null
            done(null, data.split('\n').slice(1, -1).join('\n'))
        }
        this.socket.emit('data'+this.term_id, 'cat '+ path +'\n')
    }

    public ls(name, done){
        console.log('ls')
        this.callback = (data)=>{
            console.log(data.split('\n').length)
            if( data.split('\n').length <= 2)
                return 

            this.callback = null
            done(this.parse(data))
        }
        setTimeout(()=> {
            this.socket.emit('data'+this.term_id, 'file '+name+'/* --mime \n')
        });
    }

    public write(path, text, done){
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        this.socket.emit('data'+this.term_id, `echo "${text}" > ${path} \n`)
    }

    public rm(path, done){
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        this.socket.emit('data'+this.term_id, `rm -r  ${path} \n`)
    }
    
    public cp(path, newPath, done){
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        this.socket.emit('data'+this.term_id, `cp -r  ${path} ${newPath} \n`)
    }
    
    public mv(path, newPath, done){
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        this.socket.emit('data'+this.term_id, `mv '${path}' '${newPath}' \n`)
    }

    public mkdir(path, done){
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        console.log(path)
        this.socket.emit('data'+this.term_id, `mkdir ${path} \n`)
    }

    public touch(path, done){
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        console.log(path)
        this.socket.emit('data'+this.term_id, `touch ${path} \n`)
    }
    
    public unzip(path, topath, done){
        // unzip -o -d ' + paths + ' ' + req.query.path
        this.callback = (data)=>{
            this.callback = null
            done()
        }
        console.log(`unzip -o -d ${topath} ${path}`)
        this.socket.emit('data'+this.term_id, `unzip -o -d ${topath} ${path} \n`)
    }

    public parse(str){
        var list = str.split('\n')
        var list2 = [] , list3 = []
        list.forEach(function(item) {
            if( item.indexOf('/') === 0 ){
                list2 = list2 || []
                
                list2.push(item)
            }
        })
        // list2.pop()
        
        list2.forEach(function(item, index)
        {
            item = item.replace(/ /g, '')
            if( !item )
                return
            
            var str = item.split(':')
            
            if( str[0].split('/').pop() === '*' )
                return 
            
            list3.push({
                type: str[1]? str[1].split(';')[0]: '',
                name: str[0]? str[0].split('/').pop(): '',
                path: str[0].replace(/\/\//g, '/')
            })
        })
        
        return list3
    }
}