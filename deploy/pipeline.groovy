pipeline { 
    agent any 

    tools { 
        nodejs 'node 12.10' // configure NodeJS plugin with this name
    }
    
    environment {
       FIRESTORE_EMULATOR_HOST = 'localhost:8081'
    }

    stages {
        stage('Preparation') { // for display purposes
            steps {
                sh "node --version"
                sh "npm --version"
                git "https://github.com/ricardotejo/firebase-nestjs-demo.git"
                dir ('api/functions') {
                    sh "npm i"
                }
                dir ('app') {
                    sh "npm i"
                }
            }
        }

        stage('Emulator') {
            steps {
                dir ('api/functions') {
                    sh 'JENKINS_NODE_COOKIE=dontKillMe nohup firebase emulators:start --only firestore >> /var/../firestore-process.log 2>&1 &'
                }
                timeout(1) {
                    waitUntil {
                        script {
                            def r = sh script: 'wget -q http://localhost:8081 -O /dev/null', returnStatus: true
                            return (r == 0);
                        }
                    }
                }
            }
        }

        stage('Testing API') {
            steps {
                dir ('api/functions') {
                    sh "node node_modules/jest/bin/jest.js --coverage --force-exit"
                    sh "npm run test:e2e"
                    cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
               }
            }
        }
        

        stage('Testing WEB') {
            steps {
                dir ('app') {
                    sh "npm run ng test -- --watch false"
               }
            }
        }

    }

}
