#!groovy

def REMOTE_HOST = 'docker.itmagix.nl'
def LOCAL_HOST = '127.0.0.1'
def REMOTE_PORT = '2375'
def DOCKER_HOST = REMOTE_HOST + ':' + REMOTE_PORT
def APP_PORT = '8080'
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

     stage('Waiting for Spring Boot') {
       sh "sh wait.sh ${LOCAL_HOST} ${APP_PORT}"
     }

     stage ('Starting Fitnesse to run Selenium Tests') {
       echo "Starting Fitnesse to run Selenium Tests"
     }
}
