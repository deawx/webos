import { Directive, Inject, ElementRef } from '@angular/core'
import { dialog } from '../components/tools/util'

import { Commander, CmpTool } from '../components/tools/commander'
declare var $, componentHandler,editormd,localStorage,_

window['zIndex'] = 100

@Directive({
  	selector: '[dialog]'
})

export class Dialog 
{
    dialog: any
	element 
	constructor(private elementRef: ElementRef){}
	
	ngAfterViewInit()
	{
		this.element = $(this.elementRef.nativeElement)
		
		this.addHtml()
		this.addStyle()
		this.addEvent()
		this.dialog = dialog(
		{
            top: 10+ (Math.random()*10),
            left: 100 + (Math.random()*100),
            taskBarHeight: window['web-desktop'] ? 42 : 0,
            element: $(this.elementRef.nativeElement)[0],
            eventEl: $(this.elementRef.nativeElement).find('.header')[0],
            onMove: () => {},
			onMouseUp: () => {},
            onResize: () => {
				this.element.find('.dialog-body').height(this.element.height()-30)
				this.element.find('.dialog-body').width(this.element.width())
				this.element.find('.move-block').height(this.element.height()-30)
				this.element.find('.move-block').width(this.element.width())
				CmpTool.call(this.element.parent().attr('id'), 'onResize')
			}
        })

		this.element.find('.dialog-body').height(this.element.height()-30)
		this.element.find('.dialog-body').width(this.element.width())
		this.element.find('.move-block').height(this.element.height()-30)
		this.element.find('.move-block').width(this.element.width())

		

		CmpTool.call(this.element.parent().attr('id'), 'onResize')

		const cmp = CmpTool.getCmp(this.element.parent().attr('id'))

		this.element.find('.icon').addClass(cmp.dockbar_icon)

		this.focus()

		if( cmp.max )
			this.max()
	}
	
	addStyle(){
		this.element.addClass('panel desktop-window')
		// this.element.css({width: '500px', height: '200px'})
		var title = this.element.attr('title')
		this.element.find('.title').html(title || '')
	}
	
	addHtml(){
		this.element.prepend(`
			<div class="header" > 
				<div class="icon "></div> 
				<div class="title">  </div> 
				<div class="panel-title-buttons"> 
					<div class="icon-min"> </div> 
					<div class="icon-max"> </div> 
					<div class="icon-close"> </div> 
				</div> 
			</div>
			<div class="move-block" style="position: absolute;"></div>
		`)
		
		this.element.append(`
			<div class="design-resize-left design-resize"></div>
			<div class="design-resize-right design-resize"></div>
			<div class="design-resize-bottom design-resize"></div>
			<div class="design-resize-right-bottom design-resize"></div>
			<div class="design-resize-left-bottom design-resize"></div>
		`)
	}
	
	addEvent()
	{
		$(this.elementRef.nativeElement).find('.icon-max').click(()=>{
			this.max()
		})
		
		$(this.elementRef.nativeElement).find('.icon-min').click(()=>{
			this.min()
		})
		
		$(this.elementRef.nativeElement).find('.icon-close').click(()=>{
			this.destroy()
		})
		
		this.element.mousedown(()=>{
			this.focus()
		})

	}
	
	focus(){
        $(this.element).css('z-index', window['zIndex']++)
        $('.panel').removeClass('focus')
        $(this.element).addClass('focus')
    }
	
    destroy(){
		CmpTool.destroy(this.element.parent().attr('id'))
		// window['cmpMap'][this.element.parent().attr('id')].destroy()
    }
	
    min(){
        $(this.elementRef.nativeElement).hide()
    }
	
    max(){
        this.dialog.max()   
    }
}
