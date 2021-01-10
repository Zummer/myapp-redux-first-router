# docker-compose filename
f ?= docker-compose.yml

# Запуск докера с удалением volumes
init: docker-down-clear go

# Запуск докера без удаления volumes
init-not-full: docker-down go

go: build-clear npm-ready-clear \
	docker-pull docker-build \
	node-init \
	docker-up
	
up: docker-up
down: docker-down
restart: down up

node-init: npm-install npm-ready

npm-ready-clear:
	docker run --rm -v ${PWD}:/app -w /app alpine sh -c 'rm -rf .npm-ready'

npm-clear:
	docker run --rm -v ${PWD}:/app -w /app alpine sh -c 'rm -rf .npm-ready node_modules'

build-ready:
	docker run --rm -v ${PWD}:/app -w /app alpine touch .build-ready

npm-ready:
	docker run --rm -v ${PWD}:/app -w /app alpine touch .npm-ready

npm-install:
	docker-compose run --rm node-cli npm install --legacy-peer-deps

build-clear:
	docker run --rm -v ${PWD}:/app -w /app alpine sh -c 'rm -rf out .build-ready dist buildClient buildServer'

lint: 
	docker-compose -f ${f} run --rm node-cli npm run eslint
	docker-compose -f ${f} run --rm node-cli npm run stylelint

lint-fix: 
	docker-compose -f ${f} run --rm node-cli npm run eslint-fix

docker-up:
	docker-compose -f ${f} up -d

docker-down:
	docker-compose -f ${f} down --remove-orphans

docker-down-clear:
	docker-compose -f ${f} down -v --remove-orphans

docker-pull:
	docker-compose -f ${f} pull --include-deps

docker-build:
	docker-compose -f ${f} build

build: build-clear build-prod build-gateway build-server build-static

build-gateway:
	docker --log-level=debug build --pull --file=gateway/docker/production/nginx/Dockerfile --tag=${REGISTRY}/rfr-gateway:${IMAGE_TAG} gateway/docker

build-static:
	docker --log-level=debug build --pull --file=static/docker/production/nginx/Dockerfile --tag=${REGISTRY}/rfr-static:${IMAGE_TAG} .

build-server:
	docker --log-level=debug build --pull --file=server/docker/production/Dockerfile --tag=${REGISTRY}/rfr-server:${IMAGE_TAG} .

build-prod:
	docker-compose -f ${f} run --rm node-cli npm run build

try-build:
	REGISTRY=localhost IMAGE_TAG=0 make build

push: push-gateway push-server push-static

push-gateway:
	docker push ${REGISTRY}/rfr-gateway:${IMAGE_TAG}

push-static:
	docker push ${REGISTRY}/rfr-static:${IMAGE_TAG}

push-server:
	docker push ${REGISTRY}/rfr-server:${IMAGE_TAG}

password:
	docker run --rm registry:2 htpasswd -Bbn ${LOGIN} ${PASSWORD} > htpasswd

validate-jenkinsfile:
	curl --user ${USER} -X POST -F "jenkinsfile=<Jenkinsfile" ${HOST}/pipeline-model-converter/validate

deploy:
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'rm -rf site_${BUILD_NUMBER}'
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'mkdir site_${BUILD_NUMBER}'

	envsubst < docker-compose-production.yml > docker-compose-production-env.yml
	scp -o StrictHostKeyChecking=no -P ${PORT} docker-compose-production-env.yml deploy@${HOST}:site_${BUILD_NUMBER}/docker-compose.yml
	rm -f docker-compose-production-env.yml

	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && docker stack deploy --compose-file docker-compose.yml site --with-registry-auth --prune'

deploy-clean:
	rm -f docker-compose-production-env.yml

rollback:
	ssh -o StrictHostKeyChecking=no deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && docker stack deploy --compose-file docker-compose.yml site --with-registry-auth --prune'

logs:
	docker-compose -f ${f} logs -t -f ${s}
