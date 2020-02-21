#!groovy

stage ('Trigger Build') {
	build job: 'Build-Tag-Push-Deploy-QA', wait: true, parameters: [
		[$class: 'StringParameterValue', name: 'PROJECT', value: 'sonora']
	]
}
