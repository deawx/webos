const path = require('path')
const request = require('request')
import { BASE_CLOUD_API_URL } from './config'
    
export function routes(app)
{
    app.get('/', function(req, res, next){

		console.log(path.join(__dirname, '../public', 'index.html'))
		// res.sendFile('../public/index.html');
		next()
	})
}
 

declare function require(name:string)

