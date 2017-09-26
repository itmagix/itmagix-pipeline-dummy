#!groovy

// This is just a test Jenkinsfile for use as Dummy to show-off our pipeline environment

def REMOTE_HOST = 'lsrv6769.linux.rabobank.nl'
def REMOTE_PORT = '2375'
def DOCKER_HOST = REMOTE_HOST + ':' + REMOTE_PORT
def MASTER_BRANCH = env.BRANCH_NAME == "master"
def DEVELOP_BRANCH = env.BRANCH_NAME == "develop"

// Don't run on the master node
node('slave1') {

     // Echo environment
     sh "echo Running as user \$(whoami)
     sh "echo Running from \$(pwd)
     echo "Build tag ${env.BUILD_TAG}"

     stage('Checkout') {
       checkout scm
     }

     def helper = load 'build-helper.groovy'

     stage('BiertjeHalen') {
       timeout(time: 15, unit: 'SECONDS') {
         echo "Branch name: ${env.BRANCH_NAME}"
         echo "Build number name: ${currentBuild.number}"

         sh "echo laten we een lekker biertje pakken vrienden"
         sh "sleep 4"
       }
     }

     stage('BeersAndBarrels') {
       sh "echo Tafeltje zoeken bij BandB"
       sh "sleep 5"
     }

     stage('DronkenNaarHuis') {
       sh "echo Lamlazerus op het fietsje naar huis"
       sh "sleep 6"
     }
}
