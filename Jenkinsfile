#!groovy

def REMOTE_HOST = '46.101.122.44'
def LOCAL_HOST = '127.0.0.1'
def REMOTE_PORT = '2375'
def DOCKER_HOST = REMOTE_HOST + ':' + REMOTE_PORT
def APP_PORT = '11666'
def MASTER_BRANCH = env.BRANCH_NAME == "master"
def DEVELOP_BRANCH = env.BRANCH_NAME == "develop"

// It's a kind of magic!
node('ec2-buildrunner1') {

     // Echo environment
    echo "Build tag ${env.BUILD_TAG}"

  stage("Cleanup workspace ${NODE_NAME}") {
       sh "find -name node_modules | xargs rm -fr"
       step([$class: 'WsCleanup', deleteDirs: true, notFailBuild: true, patterns: [[pattern: '*', type: 'INCLUDE']]])
     }
     
     stage('Checkout') {
       checkout scm
     }

     stage('Build Application') {
       timeout(time: 300, unit: 'SECONDS') {
         echo "Branch name: ${env.BRANCH_NAME}"
         echo "Build number name: ${currentBuild.number}"
         sh "/usr/local/maven/bin/mvn clean install"
         sh "(cd test && npm install)"
         stash name: 'source', useDefaultExcludes: true
       }
     }
}

node('itmagix-testrunner1') {
    stage("Cleanup workspace ${NODE_NAME}") {
      sh "find -name node_modules | xargs rm -fr"
      step([$class: 'WsCleanup', deleteDirs: true, notFailBuild: true, patterns: [[pattern: '*', type: 'INCLUDE']]])
     }
     
    stage('Show Environment temp') {
       sh "env"
     }
     
    stage('Starting Application') {
       unstash 'source'
      sh "java -jar target/itmagix-pipeline-dummy-0.0.1.jar --server.port=${APP_PORT} &"
     }

     stage('Waiting for Spring Boot') {
       sh "sh wait.sh ${LOCAL_HOST} ${APP_PORT}"
     }

     stage ('Starting Protractor / Selenium Tests') {
       sh 'chmod +x test/node_modules/.bin/*'
       sh '(cd test && node_modules/protractor/bin/protractor conf.js)'
     }
     
     stage ('Generating Docker image') {
       sh 'echo "FROM openjdk:alpine" > target/Dockerfile'
       sh 'echo "COPY itmagix-pipeline-dummy-0.0.1.jar /itmagix-pipeline-dummy-0.0.1.jar" >> target/Dockerfile'
       sh 'echo "CMD java -jar /itmagix-pipeline-dummy-0.0.1.jar" >> target/Dockerfile'
       sh '(cd target && sudo docker build -t itmagix/itmagix-pipeline-dummy .)'
     }
      
     stage ('Push Docker image to Docker Hub') {
       withCredentials([usernamePassword(credentialsId: 'docker_hub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
         sh "sudo docker login -u $USER -p $PASS"
       }
       sh 'sudo docker push itmagix/itmagix-pipeline-dummy'
       sh "sudo docker logout"
     }

     stage ('Trigger production servers to pull latest version of Docker Image') {
          sh "sudo docker -H tcp://${DOCKER_HOST} run -d -p 80:8080 itmagix/itmagix-pipeline-dummy:latest"
     }

     stage ('Clean up the test environment') {
       sh "kill `ps -ef | grep java | grep pipeline-dummy | head -n1 | awk \$'{print \$2}'`"
       sh 'for i in `sudo docker images -q` ; do sudo docker rmi $i ; done'
       sh "find -name node_modules | xargs rm -fr"
       step([$class: 'WsCleanup', deleteDirs: true, notFailBuild: true, patterns: [[pattern: '*', type: 'INCLUDE']]])
     }
}
