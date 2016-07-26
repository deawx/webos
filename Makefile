build:
	webpack;docker build -t dhub.yunpro.cn/yoo-cloud/webos:0.1 .

push:
	docker push dhub.yunpro.cn/yoo-cloud/webos:0.1 

run:
	docker run -it  -p 8003:8003 --rm dhub.yunpro.cn/yoo-cloud/webos:0.1  /bin/bash