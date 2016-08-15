
#### Using angular2 + nodejs + docker development web desktop

#### You can open a file to write code, and open terminal run you code 

#### All the operation on the website is just like the operation on a real computer. But the fact is you're using a docket container 


![](https://github.com/junjun16818/webos/blob/master/resource/images/demo/demo.jpeg?raw=true)


# build

```
  git clone 
  cd webos
  npm install 
  npm run typings-install
  npm start
  
  # url http://localhost:8119/#/desktop/{{docker_host}}/{{container}}
  # example http://localhost:8119/#/desktop/127.0.0.1:2375/helloworld
  
```
# use docker

```
  docker run -it --name helloworld1 -d  junjun16818/hello-world
  docker run -it -d  --name webos  -p 8119:8119  junjun16818/webos:0.1
  http://localhost:8119/#/desktop/{{docker_host}}/helloworld
```

# demo (please use chrome open it!)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld1](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld1)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld2](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld2)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld3](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld3)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld4](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld4)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld5](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld5)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld6](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld6)

[http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld7](http://cncloud.io/#/desktop/118.193.87.6:2376/helloworld7)

