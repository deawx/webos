const pty = require('pty.js')
const sio = require('socket.io')
import { endpoint } from '../conf/config'
    
function fn(server)
{
    var tid = 0
    
    sio.listen(server).sockets.on('connection', function(socket)
    {
        socket.on('createTerminal', function(term_id, func)
        {
            var name = term_id.split('§')[0]
            var host_ip = term_id.split('§')[1]
            var cmd:any

            if( !process.env.PRODUCTION ){
                //name = "hello-world2" //'-H', host_ip+':2375', 
                // cmd = ['exec', '-it', name, '/bin/bash']
            }
            cmd = ['-H', host_ip, 'exec', '-it', name, '/bin/bash'] 
            term_id = tid++

            console.log(cmd.join(' '))
            var term = pty.spawn('docker', cmd, {cwd: '/'})

            .on('data', function(data){
                socket.emit('data'+ term_id, data)
            })

            .on('exit', function(){
                socket.emit('exit', {})
            })
            
            socket.on('data'+ term_id, function(data){ 
                console.log(data)
                term.write(data)
            })
            .on('resize'+term_id, function(data){
                console.log(data)
                term.resize(data.cols, data.rows)
            })
            .on('disconnect', function(){
                term.destroy()
            })
            
            func(term_id) 
        })
        
    })
}

export = fn

declare function require(name:string);
