const path = require('path')
const request = require('request')
import { BASE_CLOUD_API_URL, endpoint } from './config'
    
var tar =  require('tar')
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()
var exec = require('child_process').exec
var dockerCommand = 'docker -H '//106.187.50.189:2375 '// + endpoint + ' '

export function routes(app)
{
    app.get('/', function(req, res, next){

		console.log(path.join(__dirname, '../public', 'index.html'))
		// res.sendFile('../public/index.html');
		next()
	})

    app.get('/torrent/:keyword', function(req, res, next){

		console.log(path.join(__dirname, '../public', 'index.html'))
		// res.sendFile('../public/index.html');
		next()
	})

	app.post('/upload/:host_ip/:name', multipartMiddleware, function(req, res)
	{
		for( var key in req.files )
		{
			var cmd = `docker -H ${req.params.host_ip} ` + 'cp ' + req.files[key].path + ' '+req.params.name +':'+ req.query.path +'/' +req.files[key].name
			console.log(cmd)
            exec(cmd, function(err, stdout){
				if( err )
					return res.json(400, {error: err.toString()})
				else
					res.json(200, {})
			})
		}
	})
	
	app.get('/getFile/:host_ip/:name', function(req, res)
	{
        if( / /.test(req.query.url.trim()) )
            return res.json(500, {})
        
		res.writeHead(200, { 
			'Content-Type' : req.query.type
		})
		 
		 console.log(req.query)
        try{
			console.log(`http://${req.params.host_ip}/containers/${req.params.name}/archive?path=${req.query.url}`)
			request.get(`http://${req.params.host_ip}/containers/${req.params.name}/archive?path=${req.query.url}`).pipe(tar.Parse()).pipe(res)
        }catch(e){ 
            res.json(500, {})        
        }
	})
}

declare function require(name:string)

