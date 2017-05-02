var safariAppId = 'web.app.id';

if('safari' in window && 'pushNotification' in window.safari) {
	var permissionData = window.safari.pushNotification.permission(safariAppId);
	initCheckSafariRemotePermission(permissionData);
}
else {
	initServiceWorker();
}

function initCheckSafariRemotePermission(permissionData) {
	switch(permissionData.permission) {
		case 'default':
			console.log('Asking permission.');
			window.safari.pushNotification.requestPermission(
				'https://localhost:3443',
				safariAppId,
				{},
				initCheckSafariRemotePermission);
			break;
		case 'denied':
			console.log('Permission denied.');
			break;
		case 'granted':
			console.log('Permission granted.');
			console.log('Device token: ', permissionData.deviceToken);
			break;
		default:
			console.log('Error accured.');
			break;
	}
};

function initServiceWorker() {
	var config = {
	    messagingSenderId: "123456789"
	};
	firebase.initializeApp(config);

	const messaging = firebase.messaging();
	messaging.requestPermission()
		   	 .then(function() {
				console.log( 'Notification permission granted' );
				return messaging.getToken();
			 })
			 .then(function(token) {
				console.log(token);
			 })
			 .catch(function (error) {
				console.log('Unable to get permission to notify.', error);
			 });

	messaging.onMessage(function(paylod) {
		console.log('onMessage: ', paylod);
	});
};