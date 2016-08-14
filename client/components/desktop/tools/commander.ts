import {Component, Input, Inject, ElementRef, DynamicComponentLoader,ViewContainerRef} from '@angular/core';
import { DockbarCmp, dockAppList } from '../dockbar/dockbar'
import { ReflectiveInjector, provide } from '@angular/core';
declare var $

var idIndex = 100
var dockMap = {}    

export class Commander
{
    dcl: DynamicComponentLoader
    viewContainerRef: ViewContainerRef
    createCmp(cmp, isDock = true)
    {
        window['cmpMap'] = window['cmpMap'] || {}
        window['cmpList'] = window['cmpList'] || {}
        const ref = this.dcl.loadNextToLocation(cmp, this.viewContainerRef)
        
        ref.then(ref=>
        {
                
                var name = ref['_componentType'].name
                const component = ref['_hostElement'].component
                    // console.log( 3333333,name)
                window['cmpList'][name] = window['cmpList'][name] || []
                window['cmpList'][name].push(ref)
                const id = idIndex++
                const element = $(ref['_hostElement']['nativeElement'])
                element.attr('id', id)
                window['cmpMap'][id] = ref
                
                if( !isDock )
                    return




            setTimeout(()=> 
            {
                if( name === 'UrlAppCmp' )
                    name = component.url
                
                ref.onDestroy(()=>{
                    dockMap[name].items.forEach((item, index)=>{
                        if( item._id === id )
                            dockMap[name].items.splice(index, 1)
                    })
                })    
                
                if( dockMap[name] ){
                    var data = { _id: id, title: component.title, element: element }
                    dockMap[name].items.push(data)
                    setTimeout(()=> {
                        data.title = component.title
                    }, 100);
                }
                else{
                    dockMap[name] = {_id: 'folder', items: [{ _id: id, title: component.title, element: element, component: component }], icon: component.dockbar_icon }
                    dockAppList.push(dockMap[name])
                    setTimeout(()=> {
                        dockMap[name].items[0].title = component.title
                    }, 1000);
                }
            })
            
        })
        
        return ref

        // return new 
    }
}

export module CmpTool
{
    export function destroy(id, done?)
    {
        if( window['cmpMap'][id] )
        {
            window['cmpMap'][id].onDestroy(()=>{
                done && done()
            })
            window['cmpMap'][id].destroy()
        }
    }

    export function call(id, fn)
    {
        if( window['cmpMap'][id] && window['cmpMap'][id]['_hostElement']['component'][fn] )
        {
            window['cmpMap'][id]['_hostElement']['component'][fn]()
        }
    }

    export function getCmp(id)
    {
        return window['cmpMap'][id]['_hostElement']['component']
    }
}