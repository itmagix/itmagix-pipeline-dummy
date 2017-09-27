#!groovy

def REMOTE_HOST = 'docker.itmagix.nl'
def REMOTE_PORT = '2375'
def DOCKER_HOST = REMOTE_HOST + ':' + REMOTE_PORT
def MASTER_BRANCH = env.BRANCH_NAME == "master"
def DEVELOP_BRANCH = env.BRANCH_NAME == "develop"

// Don't run on the master node
node('slave1') {

     // Echo environment
    echo "Build tag ${env.BUILD_TAG}"

     stage('Checkout') {
       checkout scm
     }

     stage('Build Application') {
       timeout(time: 15, unit: 'SECONDS') {
         echo "Branch name: ${env.BRANCH_NAME}"
         echo "Build number name: ${currentBuild.number}"

         sh "./gradlew build"
       }
     }

     stage('Starting Application') {
       sh "java -jar build/libs/itmagix-pipeline-dummy-0.0.1.jar &"
     }

     stage('Testing Application Startup') {
       sh "netstat -plnt | grep ':8080'"
     }
}
