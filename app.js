
// Application object.
var app = {};

// Active tabs
app.basicConfigTab = null;
app.advancedConfigTab = null;

// Device list.
app.devices = {};
app.connectedDevice = null;
app.searchDevicesErrorBar = null;
app.batteryErrorBar = null;
app.radioErrorBar = null;
app.radioSuccessBar = null;
app.meosErrorBar = null;
app.meosSuccessBar = null;
app.networkErrorBar = null;
app.networkSuccessBar = null;
app.miscDeviceNameErrorBar = null;
app.miscDeviceNameSuccessBar = null;
app.miscStatusErrorBar = null;
app.miscSettingsErrorBar = null;
app.miscSettingsSuccessBar = null;
app.miscServicesErrorBar = null;
app.miscDatabaseErrorBar = null;
app.miscDatabaseSuccessBar = null;
app.miscDatabaseAdvErrorBar = null;
app.miscDatabaseAdvSuccessBar = null;
app.miscTestPunchesSuccessBar = null;
app.miscTestPunchesErrorBar = null;
app.miscBatteryCharacteristic = null;

app.radioService = 'f6026b69-9254-fd82-0242-60d9aaff57dc';
app.radioService2 =                      'dc57ffaa-d960-4202-82fd-5492696b02f6';
//app.radioService2 =                      'DC57FFAA-D960-4202-82FD-5492696B02F6';
app.radioChannelCharacteristic =         'dc57ffab-d960-4202-82fd-5492696b02f6';
app.radioAcknowledgementCharacteristic = 'dc57ffac-d960-4202-82fd-5492696b02f6';
app.radioDataRateCharacteristic =        'dc57ffad-d960-4202-82fd-5492696b02f6';
app.meosService = 				'6e30b300-be1b-401c-8a6d-1a59d5c23c64';
app.sendToMeosEnabledCharacteristic =         	'6e30b301-be1b-401c-8a6d-1a59d5c23c64';
app.sendToMeosIPCharacteristic = 		'6e30b302-be1b-401c-8a6d-1a59d5c23c64';
app.sendToMeosIPPortCharacteristic =        	'6e30b303-be1b-401c-8a6d-1a59d5c23c64';
app.batteryService = 				'0000180f-0000-1000-8000-00805f9b34fb';
app.batteryLevelCharacteristic =         	'00002a19-0000-1000-8000-00805f9b34fb';
app.networkService = 				'f5ea6200-bcc5-4406-a981-89c6c5fc09cf';
app.networkListWifiCharacteristic =		'f5ea6201-bcc5-4406-a981-89c6c5fc09cf';
app.networkConnectWifiCharacteristic = 		'f5ea6202-bcc5-4406-a981-89c6c5fc09cf';
app.networkDisconnectWifiCharacteristic = 	'f5ea6203-bcc5-4406-a981-89c6c5fc09cf';
app.networkRenewIPCharacteristic = 		'f5ea6204-bcc5-4406-a981-89c6c5fc09cf';
app.miscService = 				'fb880900-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscPunchesCharacteristic = 		'fb880901-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscDebugCharacteristic = 			'fb880902-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscStatusCharacteristic =			'fb880903-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscSettingsCharacteristic = 		'fb880904-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscServicesCharacteristic = 		'fb880905-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscDatabaseCharacteristic = 		'fb880906-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscTestPunchesCharacteristic = 		'fb880907-4ab2-40a2-a8f0-14cc1c2e5608';
app.miscBatteryCharacteristic = 		'fb880908-4ab2-40a2-a8f0-14cc1c2e5608';

// UI methods.
app.ui = {};
app.ui.radio = {};
app.ui.radio.channel = null;
app.ui.radio.dataRate = null;
app.ui.radio.acknowledgementRequested = null;
app.ui.meos = {};
app.ui.meos.sendToMeosEnabled = null;
app.ui.meos.sendToMeosIP = null;
app.ui.meos.sendToMeosIPPort = null;
app.ui.misc = {};
app.ui.misc.deviceName = null;
app.ui.misc.noOfTestPunchesToSend = null;

// Timer that updates the device list and removes inactive
// devices in case no devices are found by scan.
app.ui.updateTimer = null;

app.punches = null;
app.testPunches = null;

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(app.onDeviceReady) },
		false);
};

app.onDeviceReady = function()
{
	console.log('device ready');
	$(":mobile-pagecontainer").pagecontainer( "change", "#page-device-scan", { } );
	app.ui.showPredefinedChannelPage();
};

app.ui.showPredefinedChannelPage = function()
{
	$("#radio-choice-channel-type-custom").prop("checked",false).checkboxradio("refresh");
	$("#radio-choice-channel-type-default").prop("checked",true).checkboxradio("refresh");

	$('#channel-header').removeClass('custom-channel');
	$('#channel-header').addClass('default-channel');
	$('#channel-header').text('Channel');
	$("#radio-choice-data-rate-1").prop("checked",false).checkboxradio("refresh");
	$("#radio-choice-data-rate-2").prop("checked",false).checkboxradio("refresh");
	$("#radio-choice-data-rate-4").prop("checked",false).checkboxradio("refresh");
	$("#radio-choice-data-rate-5").prop("checked",false).checkboxradio("refresh");
	$("#radio-choice-data-rate-3").prop("checked",true).checkboxradio("refresh");

	$("#radio-choice-data-rate-1").checkboxradio("disable");
	$("#radio-choice-data-rate-2").checkboxradio("disable");
	$("#radio-choice-data-rate-4").checkboxradio("disable");
	$("#radio-choice-data-rate-5").checkboxradio("disable");
	$("#radio-choice-data-rate-3").checkboxradio("disable");
	$('.datarate').addClass('datarate-disabled');
};

app.ui.onShowPredefinedChannelPage = function()
{
	$('#channel-header').animate({'opacity': 0, 'font-size': '3vw'}, 600, function () {
		app.ui.showPredefinedChannelPage();
	}).animate({'opacity': 1,'font-size': '10vw'}, 500);
};

app.ui.showCustomChannelPage = function()
{
	$("#radio-choice-channel-type-default").prop("checked",false).checkboxradio("refresh");
	$("#radio-choice-channel-type-custom").prop("checked",true).checkboxradio("refresh");

	$('#channel-header').removeClass('default-channel');
	$('#channel-header').addClass('custom-channel');
	$('#channel-header').text('Frequency channel');
   	$("#radio-choice-data-rate-1").checkboxradio("enable");
	$("#radio-choice-data-rate-2").checkboxradio("enable");
	$("#radio-choice-data-rate-4").checkboxradio("enable");
	$("#radio-choice-data-rate-5").checkboxradio("enable");
	$("#radio-choice-data-rate-3").checkboxradio("enable");

	$('.datarate').removeClass('datarate-disabled');
};

app.ui.onShowCustomChannelPage = function()
{
	$('#channel-header').animate({'opacity': 0, 'font-size': '3vw'}, 600, function () {
		app.ui.showCustomChannelPage();
	}).animate({'opacity': 1, 'font-size': '7vw'}, 500);
};


// Called when Start Scan button is selected.
app.ui.onStartScanButton = function()
{
	app.disconnect();
	app.ui.displayStatus('Scanning...');
	evothings.ble.startScan(
    		app.ui.deviceFound,
		app.ui.scanError,
		{ serviceUUIDs: [app.radioService, app.radioService2] });
	app.ui.updateTimer = setInterval(app.ui.displayDeviceList, 500);
};

// Called when Stop Scan button is selected.
app.ui.onStopScanButton = function()
{
	//app.stopScan();
        evothings.ble.stopScan()
	app.devices = {};
	app.ui.displayStatus('Scan Paused');
	app.ui.displayDeviceList();
	clearInterval(app.ui.updateTimer);
};

// Called when a device is found.
app.ui.deviceFound = function(device) //, errorCode)
{
	//console.log("device: " + JSON.stringify(device));
	//console.log("device.advertisementData" + device.advertisementData);
	//console.log("device.advertisementData connectable" + device.advertisementData.kCBAdvDataIsConnectable);
	//console.log("device.advertisementData.kCBAdvDataServiceUUIDs" + device.advertisementData.kCBAdvDataServiceUUIDs);
	var advertisedServiceUUIDs = device.advertisementData.kCBAdvDataServiceUUIDs;
	if (advertisedServiceUUIDs && advertisedServiceUUIDs.indexOf(app.radioService) > -1)
    	{
		// Set timestamp for device (this is used to remove inactive devices).
		device.timeStamp = Date.now();
		console.log('Found device:' + JSON.stringify(device));
		// Insert the device into table of found devices.
		app.devices[device.address] = device;
    	}
};

app.ui.scanError = function(errorCode)
{
	app.ui.displayStatus('Scan Error: ' + errorCode);
};

app.ui.updateBackgroundColor = function()
{
	// radio
	if (app.ui.radio.channel != app.ui.getChannel() || app.ui.radio.dataRate != app.ui.getDataRate() || app.ui.radio.acknowledgementRequested != app.ui.getAcknowledgementRequested())
	{
		$('#radio').css('background-color','#FFEFD5');
	} else {
		$('#radio').css('background-color','white');
	}
	// meos
	if (app.ui.meos.sendToMeosEnabled != app.ui.getSendToMeosEnabled() || app.ui.meos.sendToMeosIP != app.ui.getSendToMeosIP() || app.ui.meos.sendToMeosIPPort != app.ui.getSendToMeosIPPort())
	{
		$('#meos').css('background-color','#FFEFD5');
	} else {
		$('#meos').css('background-color','white');
	}
	// device name
	console.log(app.ui.misc.deviceName);
	console.log(app.ui.getWiRocDeviceName());
	if (app.ui.misc.deviceName != app.ui.getWiRocDeviceName())
	{
		$('#devicename').css('background-color','#FFEFD5');
	} else {
		$('#devicename').css('background-color','white');
	}
};

// Display the device list.
app.ui.displayDeviceList = function()
{
	// Clear device list.
	$('#found-devices').empty();

	var timeNow = Date.now();
	$.each(app.devices, function(key, device)
	{
		console.log("in loop");
		// Only show devices that are updated during the last 10 seconds.
		if (device.timeStamp + 10000 > timeNow)
		{
			// Map the RSSI value to a width in percent for the indicator.
			var rssiWidth = 100; // Used when RSSI is zero or greater.
			if (device.rssi < -120) { rssiWidth = 0; }
			else if (device.rssi < 0) 
			{ 
				rssiWidth = 120 + device.rssi; 
				if (rssiWidth > 100) { rssiWidth = 100; }
			}

			// Create tag for device data.
			var element = $(
				'<li style="padding:10px" class="device">'
				+	'<span class="device-header">' + device.name + '</span>'
				+   '<a href="#" style="float:right" class="ui-btn connect-button">CONNECT</a>'
				+   '<table style="border:0px;padding:0px;width:100%;">'
				+     '<tr>'
				+       '<td style="white-space:nowrap;">Bluetooth addr:</td>'
				+       '<td>' + device.address + '</td>'
				+     '</tr>'
				+     '<tr>'
				+       '<td style="white-space:nowrap;">Signal ' + device.rssi + ' dBm</td>'
				+       '<td style="background:rgb(150,150,150);margin:0px;padding:4px">'
				+          '<div style="background:rgb(225,0,0);height:20px;width:'+rssiWidth+'%;"></div>'
				+       '</td>'
				+     '</tr>'
				+   '</table>'
				+ '</li>'
			);
			
			element.find('a.connect-button').bind("click",
				{address: device.address, name: device.name},
				app.ui.onConnectButton);

			$('#found-devices').append(element);
		}
	});
};

// Display a status message
app.ui.displayStatus = function(message)
{
	$('#scan-status').html(message);
};

app.ui.onConnectButton = function(event) {
	app.connect(app.devices[event.data.address]);
};

// Channel
app.ui.displayChannel = function(channel)
{
	var raw = new DataView(channel).getUint8(0, true);
	console.log('channel: ' + raw);
	app.ui.radio.channel = raw;
	// Select the relevant option, de-select any others
	$('#channel-select').val(raw).attr('selected', true).siblings('option').removeAttr('selected');

	// jQM refresh
	$('#channel-select').selectmenu("refresh", true);
	app.ui.updateBackgroundColor();
};

app.getChannel = function(callback)
{
	console.log('getchannel');
	var service = evothings.ble.getService(app.connectedDevice, app.radioService2)
	var characteristic = evothings.ble.getCharacteristic(service, app.radioChannelCharacteristic)
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			app.radioErrorBar.show({
				html: 'Error getting radio setting (Channel): ' + error
			});
		}
	);
};

app.ui.getChannel = function() {
	var value = $("#channel-select option:selected").val();
	return value;
};

app.writeChannel = function(callback)
{
        console.log('writeChannel enter');
	var channel = parseInt(app.ui.getChannel());
	var service = evothings.ble.getService(app.connectedDevice, app.radioService2)
	var characteristic = evothings.ble.getCharacteristic(service, app.radioChannelCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		new Uint8Array([channel]),
		callback,
		function(error) {
			console.log('writechannel error: ' + error);
			app.radioErrorBar.show({
				html: 'Error saving radio setting (Channel): ' + error
			});
		}
	);
};


//---- ack

app.getAcknowledgementRequested = function(callback)
{
	console.log('getack');
	var service = evothings.ble.getService(app.connectedDevice, app.radioService2)
	var characteristic = evothings.ble.getCharacteristic(service, app.radioAcknowledgementCharacteristic)
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			console.log('getack error');
			app.radioErrorBar.show({
				html: 'Error getting radio settings (Acknowledgement): ' + error,
			});
		}
	);
};

app.ui.getAcknowledgementRequested = function() {
	return $('#acknowledgement').prop("checked") ? 1 : 0;
};

app.writeAcknowledgementRequested = function(callback)
{
	console.log('writeack');
	var ack = app.ui.getAcknowledgementRequested();
	console.log(ack);
	var service = evothings.ble.getService(app.connectedDevice, app.radioService2)
	var characteristic = evothings.ble.getCharacteristic(service, app.radioAcknowledgementCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		new Uint8Array([ack]),
		callback,
		function(error) {
			app.radioErrorBar.show({
				html: 'Error saving radio setting (Acknowledgement): ' + error,
			});
		}
	);

};

app.ui.displayAcknowledgementRequested = function(acknowledgement)
{
	var raw = new DataView(acknowledgement).getUint8(0, true);
	app.ui.radio.acknowledgementRequested = raw;
	console.log('ack: ' + raw);
	$('#acknowledgement').prop("checked",raw != 0).checkboxradio("refresh");
	app.ui.updateBackgroundColor();
};

//-- data rate
app.getDataRate = function(callback)
{
	console.log('getdatarate');
	var service = evothings.ble.getService(app.connectedDevice, app.radioService2);
	var characteristic = evothings.ble.getCharacteristic(service, app.radioDataRateCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			console.log(error);
			app.radioErrorBar.show({
			    html: 'Error getting radio setting (data rate): ' + error
			});
		}
	);
};

app.ui.getDataRate = function() {
	var selected = $(".datarate [type='radio']:checked");
	return selected.val();
};

app.writeDataRate = function(callback)
{
	console.log('write data rate');
	var dataRate = parseInt(app.ui.getDataRate());
	console.log(dataRate);
	var service = evothings.ble.getService(app.connectedDevice, app.radioService2);
	console.log('asfd');
	var characteristic = evothings.ble.getCharacteristic(service, app.radioDataRateCharacteristic);

	console.log('asfd');
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		new Uint16Array([dataRate]),
		callback,
		function(error) {
			app.radioErrorBar.show({
			    html: 'Error saving radio setting (data rate): ' + error
			});
		}
	);
};


app.ui.displayDataRate = function(dataRate)
{
	var rawDataRate = new DataView(dataRate).getUint16(0, true);
	console.log('data rate: ' + rawDataRate);
	app.ui.radio.dataRate = rawDataRate;
	$(".datarate [type='radio'][value = '" + rawDataRate + "']").prop("checked", true).checkboxradio("refresh");
	$(".datarate [type='radio']").not( "[value = '" + rawDataRate + "']").prop("checked", false).checkboxradio("refresh");
	if (rawDataRate == 586) {
		app.ui.showPredefinedChannelPage();
	} else {
		app.ui.showCustomChannelPage();
	}
	app.ui.updateBackgroundColor();
};

//-- Battery

app.getBatteryLevel = function(callback)
{
	console.log('getBatteryLevel');
	var service = evothings.ble.getService(app.connectedDevice, app.batteryService);
	var characteristic = evothings.ble.getCharacteristic(service, app.batteryLevelCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			console.log(data);
			callback(data);
		},
		function(error) {
			console.log('getBatteryLevel error: ' + error);
			app.batteryErrorBar.show({
				html: 'Error getting battery'
			});
		}
	);
};


app.ui.displayBatteryLevel = function(batteryLevel)
{
	console.log(batteryLevel.byteLength);
	var dv = new DataView(batteryLevel, 0);
	var rawBatteryLevel = dv.getUint8(0);
	console.log('battery level: ' + rawBatteryLevel);

	levelBar = $('.level');
	levelBar.removeClass('high');
	levelBar.removeClass('med');
	levelBar.removeClass('low');
	if (rawBatteryLevel > 60) {
	  levelBar.addClass('high');
	} else if (rawBatteryLevel >= 30 ) {
	  levelBar.addClass('med');
	} else {
	  levelBar.addClass('low');
	}
	if (rawBatteryLevel > 100) {
		levelBar.css('width', '100%');
	} else {
		levelBar.css('width', rawBatteryLevel + '%');
	}
};


app.getIsCharging = function(callback)
{
	console.log('getIsCharging');
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscBatteryCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			console.log('getIsCharging error: ' + error);
			app.batteryErrorBar.show({
				html: 'Error getting if charging'
			});
		}
	);
};


app.ui.displayIsCharging = function(isCharging)
{
	console.log("displayBatteryCharging");
	var dv = new DataView(isCharging, 0);
	var rawIsCharging = dv.getUint8(0);
	console.log('IsCharging: ' + rawIsCharging);

	levelBar = $('.level');
	if (rawIsCharging > 0) {
	  levelBar.addClass('charging');
        } else {
          levelBar.removeClass('charging');
        }
};


//-- Send to Meos enabled
app.getSendToMeosEnabled = function(callback)
{
	console.log('getSendToMeosEnabled');
	var service = evothings.ble.getService(app.connectedDevice, app.meosService);
	var characteristic = evothings.ble.getCharacteristic(service, app.sendToMeosEnabledCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			app.meosErrorBar.show({
				html: 'Error getting Meos settings (Enabled): ' + error
			});
		}
	);
};

app.ui.getSendToMeosEnabled = function() {
	return $('#sendtomeosenabled').prop("checked") ? 1 : 0;
};


app.writeSendToMeosEnabled = function(callback)
{
	console.log('write send to meos enabled');
	var meosEnabled = app.ui.getSendToMeosEnabled();
	var service = evothings.ble.getService(app.connectedDevice, app.meosService)
	var characteristic = evothings.ble.getCharacteristic(service, app.sendToMeosEnabledCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		new Uint8Array([meosEnabled]),
		callback,
		function(error) {
			app.meosErrorBar.show({
				html: 'Error saving Meos settings (Enabled): ' + error
			});
		}
	);
};

app.ui.displaySendToMeosEnabled = function(meosEnabled)
{
	var raw = new DataView(meosEnabled).getUint8(0, true);
	app.ui.meos.sendToMeosEnabled = raw;
	console.log('send to meos enabled: ' + raw);
	$('#sendtomeosenabled').prop("checked",raw != 0).checkboxradio("refresh");
	app.ui.updateBackgroundColor();
};


app.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

app.validateIPaddress = function(ipaddress)   
{  
	var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  
	if(ipaddress.match(ipformat))  
	{  
		return true;  
	}
	return false;
}

//-- Send to Meos ip
app.getSendToMeosIP = function(callback)
{
	console.log('getSendToMeosIP');
	var service = evothings.ble.getService(app.connectedDevice, app.meosService);
	var characteristic = evothings.ble.getCharacteristic(service, app.sendToMeosIPCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			app.meosErrorBar.show({
				html: 'Error getting Meos settings (IP): ' + error
			});
		}
	);
};

app.ui.getSendToMeosIP = function() {
	var meosIP = $("#sendtomeosip").val();
	return meosIP;
};

app.writeSendToMeosIP = function(callback)
{
	console.log('write meos ip');
	var meosIP = app.ui.getSendToMeosIP();
	if (!app.validateIPaddress(meosIP)) {
		app.meosErrorBar.show({
			html: 'Meos IP Address incorrect format'
		});
	} else {
		var te = new TextEncoder("utf-8").encode(meosIP);
		var meosIPArray = new Uint8Array(te);
		var service = evothings.ble.getService(app.connectedDevice, app.meosService)
		var characteristic = evothings.ble.getCharacteristic(service, app.sendToMeosIPCharacteristic)
		evothings.ble.writeCharacteristic(
			app.connectedDevice,
			characteristic,
			meosIPArray,
			callback,
			function(error) {
				app.meosErrorBar.show({
					html: 'Error saving Meos settings (IP): ' + error
				});
			}
		);
	}
};

app.ui.displaySendToMeosIP = function(meosIP)
{
	var meosIPString = new TextDecoder("utf-8").decode(meosIP);
	app.ui.meos.sendToMeosIP = meosIPString;
	console.log('meos ip: ' + meosIPString);
	$("#sendtomeosip").val(meosIPString);
	app.ui.updateBackgroundColor();
};

//-- Send to Meos ip port
app.getSendToMeosIPPort = function(callback)
{
	console.log('getSendToMeosIPPort');
	var service = evothings.ble.getService(app.connectedDevice, app.meosService);
	var characteristic = evothings.ble.getCharacteristic(service, app.sendToMeosIPPortCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			app.meosErrorBar.show({
				html: 'Error getting Meos settings (Port): ' + error
			});
		}
	);
};



app.ui.getSendToMeosIPPort = function() {
	var meosIPPort = $("#sendtomeosipport").val();
	meosIPPortInteger = parseInt(meosIPPort);
	console.log("meosIPPortInteger: " + meosIPPortInteger);
	if (app.isNumber(meosIPPortInteger)) {
		return meosIPPortInteger;
	}
	return 0;
};

app.writeSendToMeosIPPort = function(callback, errorCallback)
{
	console.log('write meos ip port');
	var meosIPPort = app.ui.getSendToMeosIPPort();
 	if (meosIPPort == 0) {
		app.meosErrorBar.show({
			html: 'Meos Port must be an integer'
		});
		errorCallback();
	} else {
		var service = evothings.ble.getService(app.connectedDevice, app.meosService)
		var characteristic = evothings.ble.getCharacteristic(service, app.sendToMeosIPPortCharacteristic)
		evothings.ble.writeCharacteristic(
			app.connectedDevice,
			characteristic,
			new Uint16Array([meosIPPort]),
			callback,
			function(error) {
				app.meosErrorBar.show({
					html: 'Error saving Meos settings (Port): ' + error
				});
			}
		);
	}
};

app.ui.displaySendToMeosIPPort = function(meosIPPort)
{
	var rawMeosIPPort = new DataView(meosIPPort).getUint16(0, true);
	app.ui.meos.sendToMeosIPPort = rawMeosIPPort;
	console.log('meos ip port: ' + rawMeosIPPort);
	$("#sendtomeosipport").val(rawMeosIPPort);
	app.ui.updateBackgroundColor();
};

//-- Get Wifi networks
app.getNetworkWifiList = function(callback)
{
	console.log('getNetworkWifiList');
	var service = evothings.ble.getService(app.connectedDevice, app.networkService);
	var characteristic = evothings.ble.getCharacteristic(service, app.networkListWifiCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			app.networkErrorBar.show({
			    html: 'Error getting wifi list: ' + error
			});
		}
	);
};

app.ui.displayNetworkWifiList = function(wifiList)
{
	var rawWifiList = new TextDecoder("utf-8").decode(wifiList);
	console.log('wifi list: ' + rawWifiList);
	var rowList = rawWifiList.split(/\r?\n/);
	var table = $('<table style="border:0px;padding:0px;width:100%;table-layout:fixed"></table>');
	$('#wifi-networks').html(table);
	for (var i = 0; i < rowList.length; i += 3) {
		var networkName = rowList[i];
		networkName = $('<div/>').text(networkName).html();
		var isConnected = (rowList[i+1] == 'yes');
		var signalStrength = rowList[i+2];
		var buttonText = "CONNECT";
		if (isConnected) {
			buttonText = "DISCONNECT";
		}
		// Create tag for device data.
		var element = $('<tr>'
			+       '<td style="white-space:nowrap;overflow:hidden;width:50%;">' +networkName +'</td>'
			+       '<td style="width:15%;text-align:center">' + signalStrength + '</td>'
			+       '<td><a href="#" class="ui-btn wifi-connect-button">' + buttonText + '</a></td>'
			+     '</tr>'
		);
		
		element.find('a.wifi-connect-button').bind("click",
			{name: networkName, isConnected: isConnected},
			app.ui.onWifiConnectButton);
		table.append(element);
	}
};

//-- Wifi connect/ disconnect
app.ui.onWifiConnectButton = function(event) {
	var networkName = event.data.name;
	var isConnected = event.data.isConnected;
	if (isConnected) {
		app.writeDisconnectWifi(networkName, function() {
			app.networkInfoBar.settings.autohide = true;
			app.networkInfoBar.settings.onHide = function() {
			        app.getNetworkWifiList(app.ui.displayNetworkWifiList);
    			};
			app.networkInfoBar.show({
				html: 'Disconnecting Wifi'
			});
		});
	} else {
		$('#popupWifiLogin').data('networkName', networkName);
		$('#popupWifiLogin').popup('open');
	}
};

app.ui.onWifiPasswordConnectButton = function(event) {
	$('#popupWifiLogin').popup('close');
	app.networkInfoBar.settings.autohide = false;
	app.networkInfoBar.settings.onHide = function() {
	        app.getNetworkWifiList(app.ui.displayNetworkWifiList);
	};
	app.networkInfoBar.show({
		html: 'Connecting Wifi'
	});
	var networkName = $('#popupWifiLogin').data('networkName');
	var password = $('#wifiPassword').val();
	app.writeConnectWifi(networkName, password, function() {
		setTimeout(function () { app.networkInfoBar.hide();}, 6000);			
	});
};

//-- Wifi connect

app.writeConnectWifi = function(networkName, password, callback)
{
	console.log('writeConnectWifi: ' + networkName);
	var te = new TextEncoder("utf-8").encode(networkName + '\n' + password);
	var networkNameArray = new Uint8Array(te);
	console.log('writeConnectWifi 2: ' + networkNameArray);
	var service = evothings.ble.getService(app.connectedDevice, app.networkService)
	var characteristic = evothings.ble.getCharacteristic(service, app.networkConnectWifiCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		networkNameArray,
		callback,
		function(error) {
			app.networkErrorBar.show({
			    html: 'Error connecting to wifi: ' + error
			});
			app.networkInfoBar.hide();
		}
	);
};

//-- Wifi disconnect
app.writeDisconnectWifi = function(networkName, callback)
{
	console.log('writeDisconnectWifi: ' + networkName);
	var te = new TextEncoder("utf-8").encode(networkName);
	var networkNameArray = new Uint8Array(te);
	var service = evothings.ble.getService(app.connectedDevice, app.networkService)
	var characteristic = evothings.ble.getCharacteristic(service, app.networkDisconnectWifiCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		networkNameArray,
		callback,
		function(error) {
			app.networkErrorBar.show({
			    html: 'Error disconnecting wifi: ' + error
			});
		}
	);
};

//-- get IP
app.getIPAddress = function(callback)
{
	console.log('getIPAddress');
	var service = evothings.ble.getService(app.connectedDevice, app.networkService);
	var characteristic = evothings.ble.getCharacteristic(service, app.networkRenewIPCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			console.log('getipaddress error');
			app.networkErrorBar.show({
				html: 'Error getting ip address: ' + error,
			});
		}
	);
};

app.ui.displayIPAddress = function(IPAddress)
{
	var rawIPAddress = new TextDecoder("utf-8").decode(IPAddress);
	console.log('ip address: ' + rawIPAddress);
	$("#ipaddress").text(rawIPAddress);
};


//-- Renew IP
app.ui.onRenewIPWifi = function(event)
{
	console.log('onRenewIPWifi');
	var te = new TextEncoder("utf-8").encode('wifi');
	var networkType = new Uint8Array(te);
	console.log('onRenewIPWifi 2');
	var service = evothings.ble.getService(app.connectedDevice, app.networkService)
	var characteristic = evothings.ble.getCharacteristic(service, app.networkRenewIPCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		networkType,
		function() {
				console.log('IP renewed');
				app.networkInfoBar.settings.autohide = true;
				app.networkInfoBar.show({
				    html: 'Renew IP command issued'
				});
			},
		function(error) {
			console.log('Renewing IP failed: ' + error);
			app.networkErrorBar.show({
			    html: 'Renewing IP failed'
			});
		}
	);
};

app.ui.onRenewIPEthernet = function(event)
{
	console.log('onRenewIPEthernet');
	var te = new TextEncoder("utf-8").encode('ethernet');
	var networkType = new Uint8Array(te);
	console.log('onRenewIPEthernet 2');
	var service = evothings.ble.getService(app.connectedDevice, app.networkService)
	var characteristic = evothings.ble.getCharacteristic(service, app.networkRenewIPCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		networkType,
		function() {
				console.log('IP renewed');
				app.networkInfoBar.settings.autohide = true;
				app.networkInfoBar.show({
				    html: 'Renew IP command issued'
				});
			},
		function(error) {
			console.log('Renewing IP failed: ' + error);
			app.networkErrorBar.show({
			    html: 'Renewing IP failed'
			});
		}
	);
};


app.readBasicSettings = function() {
	app.getBatteryLevel(app.ui.displayBatteryLevel);
	app.getIsCharging(app.ui.displayIsCharging);
	app.getDataRate(app.ui.displayDataRate);
	app.getChannel(app.ui.displayChannel);
	app.getAcknowledgementRequested(app.ui.displayAcknowledgementRequested);
	app.getIPAddress(app.ui.displayIPAddress);
};

app.ui.onReadBasicButton = function() {
	app.readBasicSettings();
};

app.ui.onApplyBasicButton = function() {
        console.log('onApplyBasicButton');
	app.writeChannel(function() {
        	console.log('writeChannel2');
		app.writeAcknowledgementRequested(function() {
			app.writeDataRate(function() {
				app.radioSuccessBar.show({
			    		html: 'Radio settings saved'
				});

				app.getChannel(app.ui.displayChannel);
				app.getAcknowledgementRequested(app.ui.displayAcknowledgementRequested);
				app.getDataRate(app.ui.displayDataRate);
			});
		});
	});
};

app.readMeosSettings = function() {
	app.getBatteryLevel(app.ui.displayBatteryLevel);
	app.getSendToMeosEnabled(app.ui.displaySendToMeosEnabled);
	app.getSendToMeosIP(app.ui.displaySendToMeosIP);
	app.getSendToMeosIPPort(app.ui.displaySendToMeosIPPort);
};

app.ui.onReadMeosButton = function() {
	app.readMeosSettings();
};

app.ui.onApplyMeosButton = function() {
	app.writeSendToMeosEnabled(function() {
		app.writeSendToMeosIP(function() {
			app.writeSendToMeosIPPort(function() {
				app.meosSuccessBar.show({
			    		html: 'Meos settings saved'
				});
				app.getSendToMeosEnabled(app.ui.displaySendToMeosEnabled);
				app.getSendToMeosIP(app.ui.displaySendToMeosIP);
				app.getSendToMeosIPPort(app.ui.displaySendToMeosIPPort);
			}, function() {
				app.getSendToMeosEnabled(app.ui.displaySendToMeosEnabled);
				app.getSendToMeosIP(app.ui.displaySendToMeosIP);
				app.getSendToMeosIPPort(app.ui.displaySendToMeosIPPort);
			});
		});
	});
};



app.ui.onGetNetworkWifiListButton = function() {
	app.getNetworkWifiList(app.ui.displayNetworkWifiList);
};

// Device name
app.ui.onApplyDeviceNameButton = function()
{
	var devName = app.ui.getWiRocDeviceName();
	console.log("Device name entered: " + devName);
	app.writeWiRocSetting('WiRocDeviceName', devName,  function() {
		app.miscDeviceNameSuccessBar.show({
			html: 'Device name saved (reboot required)'
		});
		app.getWiRocSettings(app.ui.displayWiRocSettings);
	}, function(error) {
		app.miscDeviceNameErrorBar.show({
			html: 'Error saving device name: ' + error,
		});
	});
};

app.ui.getWiRocDeviceName = function()
{
	var devName = $('#wirocdevicename').val();
	return devName;
};

app.ui.onReadDeviceNameButton = function()
{
	app.getWiRocSettings(app.ui.displayWiRocSettings);
};

// Status
app.writeWiRocStatus = function(offset, callback)
{
	console.log('writeWiRocStatus: ' + offset);
	var te = new TextEncoder("utf-8").encode(offset+'');
	var offsetArr = new Uint8Array(te);
	var service = evothings.ble.getService(app.connectedDevice, app.miscService)
	var characteristic = evothings.ble.getCharacteristic(service, app.miscStatusCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		offsetArr,
		callback,
		function(error) {
			app.miscStatusErrorBar.show({
			    html: 'Error getting status 1: ' + error
			});
		}
	);
};

app.wiRocStatus = '';

app.getWiRocStatus = function(callback) {
	console.log('getStatus');
	var readWiRocStatus = function() {
	  var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	  var characteristic = evothings.ble.getCharacteristic(service, app.miscStatusCharacteristic);
	  evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			var rawStatus = new TextDecoder("utf-8").decode(data);
			app.wiRocStatus += rawStatus;
			if (rawStatus.length == 600) {
				app.writeWiRocStatus(rawStatus.length, readWiRocStatus);
			} else {
				callback(app.wiRocStatus);
			}
		},
		function(error) {
			console.log('getStatus error');
			app.miscStatusErrorBar.show({
				html: 'Error getting status 2: ' + error
			});
		}
	  );
        };

	app.wiRocStatus = '';
	app.writeWiRocStatus(0, readWiRocStatus);
};

app.ui.displayWiRocStatus = function(status) {
	console.log(status);
	console.log(status.length);
	var statusObj = JSON.parse(status);
	var html = "<h2>Input:</h2><table width=\"100%\" border=1><thead>";
	html += "<tr><th align=\"left\">Type</th><th align=\"left\">Instance</th></tr></thead><tbody>";
	for (var i = 0; i < statusObj.inputAdapters.length; i++) {
		var inputAdapter = statusObj.inputAdapters[i];
		html += "<tr><td>" + inputAdapter.TypeName + "</td><td>" + inputAdapter.InstanceName + "</td></tr>";
	}
	html += "</tbody></table>";

	html += "<h2>Output:</h2><table width=\"100%\" border=1><thead>";
	html += "<tr><th align=\"left\">Type</th><th align=\"left\">Instance</th><th align=\"left\">Msg In</th><th align=\"left\">Msg Out</th><th align=\"left\">Enabled</th></tr></thead><tbody>";
	for (var i = 0; i < statusObj.subscriberAdapters.length ; i++) {
		var subscriber = statusObj.subscriberAdapters[i];
		html += "<tr><td>" + subscriber.TypeName + "</td><td>" + subscriber.InstanceName + "</td><td>" + subscriber.MessageInName + "</td><td>" + subscriber.MessageOutName + "</td><td>" + subscriber.Enabled + "</td></tr>";
	}
	html += "</tbody></table>";
	$('#wiroc-status-content').html(html);
};

app.ui.onRefreshStatusButton = function() {
	$('#wiroc-status-content').html('');
	app.getWiRocStatus(app.ui.displayWiRocStatus);
};

// Services
app.getServices = function(callback) {
	console.log('getServices');
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscServicesCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			console.log('getServices error');
			app.miscServicesErrorBar.show({
				html: 'Error getting services: ' + error
			});
		}
	);
};


app.ui.displayServices = function(services) {
	var rawServices = new TextDecoder("utf-8").decode(services);
	var servicesObj = JSON.parse(rawServices);
	var html = "<table width=\"100%\" border=1><thead>";
	html += "<tr><th align=\"left\">Name</th><th align=\"left\">Status</th></tr></thead><tbody>";
	for (var i = 0; i < servicesObj.services.length; i++) {
		var service = servicesObj.services[i];
		html += "<tr><td>" + service.Name + "</td><td>" + service.Status + "</td></tr>";
	}
	html += "</tbody></table>";

	$('#wiroc-services-content').html(html);
};

app.ui.onRefreshServicesButton = function() {
	$('#wiroc-services-content').html('');
	app.getServices(app.ui.displayServices);
};


// Settings
app.writeWiRocSetting = function(key, value, callback, errorCallback)
{
	console.log('write setting');
	var errorCB = errorCallback;
	if (errorCallback == null) {
		errorCB = function(error) {
			app.miscSettingsErrorBar.show({
				html: 'Error saving setting: ' + error,
			});
		};
	}
	var te = new TextEncoder("utf-8").encode(key+';'+value);
	var settingArray = new Uint8Array(te);
	var service = evothings.ble.getService(app.connectedDevice, app.miscService)
	var characteristic = evothings.ble.getCharacteristic(service, app.miscSettingsCharacteristic)
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		settingArray,
		callback,
		errorCB
	);
};

app.getWiRocSettings = function(callback) {
	console.log('getSettings');
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscSettingsCharacteristic);
	evothings.ble.readCharacteristic(
        	app.connectedDevice,
        	characteristic,
        	function(data) {
			callback(data);
		},
		function(error) {
			console.log('getSettings error');
			app.miscSettingsErrorBar.show({
				html: 'Error getting setting: ' + error
			});
		}
	);
};

app.ui.displayWiRocSettings = function(settings) {
	var rawSettings = new TextDecoder("utf-8").decode(settings);
	var settingsObj = JSON.parse(rawSettings);
	var table = $("<table width=\"100%\" border=1><thead><tr><th align=\"left\">Key</th><th align=\"left\">Value</th><th></td></tr></thead><tbody></tbody></table>");
	for (var i = 0; i < settingsObj.settings.length; i++) {
		var setting = settingsObj.settings[i];
		var element = $('<tr><td>' + setting.Key + '</td><td>' + setting.Value + '</td><td><a href="javascript:void(0)" class="edit-setting">Edit</a></td></tr>');
		
		element.find('a.edit-setting').bind("click",
			{Key: setting.Key, Value: setting.Value},
			app.ui.onEditSetting);
		table.append(element);

		if (setting.Key == 'WiRocDeviceName') {
			$('#wirocdevicename').val(setting.Value);
			app.ui.misc.deviceName = setting.Value;
		}
	}
	$('#wiroc-settings-content').append(table);
	app.ui.updateBackgroundColor();
};

app.ui.onRefreshSettingsButton = function() {
	$('#wiroc-settings-content').html('');
	app.getWiRocSettings(app.ui.displayWiRocSettings);
};

app.ui.onEditSetting = function(event)
{
	var key = event.data.Key;
	var value = event.data.Value;
	$('#settingKey').val(key);
	$('#settingValue').val(value);
	$('#popupAddEditSetting').data('Key', key);
	$('#popupAddEditSetting').data('Value', value);
	$('#popupAddEditSetting').popup('open');
};

app.ui.onEditSettingSaveButton = function(event) {
	$('#popupAddEditSetting').popup('close');
	var key = $('#settingKey').val();
	var value = $('#settingValue').val();
	app.writeWiRocSetting(key, value, function() {
		app.miscSettingsSuccessBar.show({
			html: 'Setting saved'
		});
		$('#wiroc-settings-content').html('');
		app.getWiRocSettings(app.ui.displayWiRocSettings);
	}, null);
};

app.appendBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};


app.ui.displayPunches = function(punches) {
	console.log('displayPunches');
	if (app.punches == null) {
		app.punches = punches;
	} else {
		app.punches = app.appendBuffer(app.punches, punches);
	}
	if (punches.byteLength < 20) {
		// we received all data
		var rawPunches =  evothings.ble.fromUtf8(app.punches);
		app.punches = null; // reset buffer
		console.log('displayPunches: ' + rawPunches);
		var punchesObj = JSON.parse(rawPunches);
		var table = $("#wiroc-punches-table tbody");
		for (var i = 0; i < punchesObj.punches.length; i++) {
			var punch = punchesObj.punches[i];
			var element = $('<tr><td>' + punch.StationNumber + '</td><td>' + punch.SICardNumber + '</td><td>' + punch.Time + '</td></tr>');
			table.append(element);
		}
	}
};

app.subscribePunches = function() {
	console.log("subscribePunches / unsubscribe: '" + $('#btnSubscribePunches').data('subscribe') + "'");
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscPunchesCharacteristic);

	if ($('#btnSubscribePunches').data('subscribe'))
	{
		evothings.ble.enableNotification(
			app.connectedDevice,
			characteristic,
			function(data) {
				console.log('subscribePunches data');
				app.ui.displayPunches(data);
			},
			function(error) {
				console.log('subscribePunches error');
				app.miscPunchesErrorBar.show({
					html: 'Error subscribePunches: ' + error
				});
			}
		);
		$('#btnSubscribePunches').text("Unsubscribe");
		$('#btnSubscribePunches').data("subscribe", false);
	} else {
		app.punches = null;
		evothings.ble.disableNotification(
			app.connectedDevice,
			characteristic,
			function(data) {
				console.log('unsubscribe punches');
				$('#btnSubscribePunches').text("Subscribe");
				$('#btnSubscribePunches').data("subscribe", true);
			},
			function(error) {
				console.log('unsubscribePunches error');
				app.miscPunchesErrorBar.show({
					html: 'Error unsubscribePunches: ' + error
				});
			}
		);
	}
};

app.ui.onSubscribePunchesButton = function() {
	app.subscribePunches();
};

// Delete Punches
app.deletePunches = function() {
	console.log('Delete punches');
	var te = new TextEncoder("utf-8").encode('deletepunches');
	var operationName = new Uint8Array(te);
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscDatabaseCharacteristic);
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		operationName,
		function() {
			console.log('Punches deleted');
			app.miscDatabaseSuccessBar.settings.autohide = true;
			app.miscDatabaseSuccessBar.show({
			    html: 'Punches deleted'
			});
		},
		function(error) {
			app.miscDatabaseErrorBar.show({
			    html: 'Error when deleting punches: ' + error
			});
			app.miscDatabaseErrorBar.hide();
		}
	);
};

app.ui.onDeletePunchesButton = function() {
	app.deletePunches();
};

// Drop tables
app.dropAllTables = function() {
	console.log('Delete punches');
	var te = new TextEncoder("utf-8").encode('dropalltables');
	var operationName = new Uint8Array(te);
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscDatabaseCharacteristic);
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		operationName,
		function() {
			console.log('Tables dropped');
			app.miscDatabaseAdvSuccessBar.settings.autohide = true;
			app.miscDatabaseAdvSuccessBar.show({
			    html: 'Tables dropped'
			});
		},
		function(error) {
			app.miscDatabaseAdvErrorBar.show({
			    html: 'Error when dropping tables: ' + error
			});
			app.miscDatabaseAdvErrorBar.hide();
		}
	);
};

app.ui.onDropAllTablesButton = function() {
	app.dropAllTables();
};

app.ui.displayTestPunches = function(testPunches) {
	console.log('displayTestPunches 1: ' +  evothings.ble.fromUtf8(testPunches));
	if (app.testPunches == null) {
		app.testPunches = testPunches;
	} else {
		app.testPunches = app.appendBuffer(app.testPunches, testPunches);
	}
	if (testPunches.byteLength < 20) {
		// we received all data from this push

		var rawTestPunches =  evothings.ble.fromUtf8(app.testPunches);
		app.testPunches = null; // reset buffer
		console.log('displayTestPunches: ' + rawTestPunches);
		var punchesObj = JSON.parse(rawTestPunches);

		var table = $("#wiroc-test-punches-table tbody");
		for (var i = 0; i < punchesObj.punches.length; i++) {
			var punch = punchesObj.punches[i];
			var trs = table.find('tr[data-id="' + punch.Id + '"]');
			var ackReq = $('#acknowledgement').prop("checked");
			var noOfSendTriesColor = "";
			if (punch.NoOfSendTries == 1 && ((punch.Status == 'Acked' && ackReq) || (punch.Status == 'Not acked' && !ackReq))) {
				// Success
				noOfSendTriesColor = ' style="background-color:#2ECC71"';
			} else if (punch.NoOfSendTries > 1) {
				noOfSendTriesColor = ' style="background-color:#E74C3C"';
			}
			var statusColor = "";
			if ((punch.Status == 'Acked' && ackReq) || (punch.Status == 'Not acked' && !ackReq)) {
				// Success
				statusColor = ' style="background-color:#2ECC71"';
			} else if (punch.NoOfSendTries > 1 && (punch.Status == 'Not sent' || punch.Status == 'Not acked')) {
				statusColor = ' style="background-color:#E74C3C"';
			}
			var rowText = '<tr data-id="' + punch.Id + '" data-subscrId="' + punch.SubscrId + '"><td>' + punch.SINo + '</td><td>' + punch.Time + '</td><td' + noOfSendTriesColor +'>' + punch.NoOfSendTries + '</td><td'+ statusColor + '>' + punch.Status + '</td></tr>';
			var rowElement = $(rowText);
			if (trs.length > 0) {
				trs[0].replaceWith(rowElement[0]);
				console.log("replace");
			} else {
				table.append(rowElement);
				console.log("append");
			}
		}

		// calculate percentages
		var allTrs = table.find('tr');
		var triesPercentage = "Unknown";
		var statusPercentage = "Unknown"
		if (ackReq) {
			var sumNoOfFailedTries = 0;
			var sumNoOfSuccessTries = 0;
			var sumNoOfTries = 0;
			for (var j = 0; j < allTrs.length; j++) {
				var noOfSendTries = $(allTrs[j]).find('td').eq(2).html();
				var status = $(allTrs[j]).find('td').eq(3).html();
				console.log("noOfSendTries: " + noOfSendTries);
				console.log("status: " + status);
				if (status == 'Not sent' || status == 'Not acked') {
					sumNoOfTries += parseInt(noOfSendTries);
					sumNoOfFailedTries += parseInt(noOfSendTries);
				} else if (status == 'Acked') {
					sumNoOfTries += parseInt(noOfSendTries);
					sumNoOfFailedTries += parseInt(noOfSendTries) - 1;
					sumNoOfSuccessTries += 1;
				}
			}
		
			triesPercentage = 0;
			if (sumNoOfTries > 0) { triesPercentage = Math.round(sumNoOfSuccessTries*100 / sumNoOfTries); }
			statusPercentage = 0;
			if (allTrs.length > 0) { statusPercentage = Math.round(sumNoOfSuccessTries*100 / allTrs.length); }
			
		}
		var tfoot = $("#wiroc-test-punches-table tfoot");
		var summaryTrs = tfoot.find('tr[data-id="summary"]');
		var sumRowElement = $('<tr data-id="summary"><td colspan="2">Success %</td><td>' + triesPercentage + '%</td><td>' + statusPercentage + '%</td></tr>');
		if (summaryTrs.length > 0) {
			summaryTrs[0].replaceWith(sumRowElement[0]);
		}
	

		var noOfCompletedRows = 0;
		for (var j = 0; j < allTrs.length; j++) {
			var noOfSendTries = $(allTrs[j]).find('td').eq(2).html();
			var status = $(allTrs[j]).find('td').eq(3).html();
			console.log("noOfSendTries: " + noOfSendTries);
			console.log("status: " + status);
			if ((status == 'Acked' && ackReq) || (status =='Not acked' && !ackReq) || 
				(parseInt(noOfSendTries) > 1 && (status == 'Not sent' || status == 'Not acked'))) {
				noOfCompletedRows++;
			}
		}

		// Check if we received all
		console.log("No of rows: " + allTrs.length);
		console.log("No of punches to send: " + app.ui.misc.noOfTestPunchesToSend);
		console.log("No of completed rows: " + noOfCompletedRows);
		if (allTrs.length == app.ui.misc.noOfTestPunchesToSend 
			&& app.ui.misc.noOfTestPunchesToSend == noOfCompletedRows)
		{
			console.log("we received all");
			var service = evothings.ble.getService(app.connectedDevice, app.miscService);
			var characteristic = evothings.ble.getCharacteristic(service, app.miscTestPunchesCharacteristic);
			evothings.ble.disableNotification(
				app.connectedDevice,
				characteristic,
				function(data) {
					console.log('unsubscribe test punches');
					$('#stopTestPunch').addClass('ui-disabled');
					$('#testPunchLoading').hide();
				},
				function(error) {
					console.log('unsubscribe test punches error');
					app.miscTestPunchesErrorBar.show({
						html: 'Error unsubscribe: ' + error
					});
				}
			);
		}
	}
	console.log("displaytestPunches end");
};

app.ui.onSendTestPunchesStopButton = function(event) {
	app.testPunches = null;
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscTestPunchesCharacteristic);
	evothings.ble.disableNotification(
		app.connectedDevice,
		characteristic,
		function(data) {
			console.log('unsubscribe test punches');
			$('#stopTestPunch').addClass('ui-disabled');
			$('#testPunchLoading').hide();
		},
		function(error) {
			console.log('unsubscribe test punches error');
			app.miscTestPunchesErrorBar.show({
				html: 'Error unsubscribe: ' + error
			});
		}
	);
};

app.ui.onSendTestPunchesButton = function(event) {
	console.log('onSendTestPunchesButton');
	app.testPunches = null;

	$("#wiroc-test-punches-table tbody").html('');
	$('#stopTestPunch').removeClass('ui-disabled');
	$('#testPunchLoading').show();


	app.ui.misc.noOfTestPunchesToSend = $("#noOfTestPunches option:selected").val();
	var siNumber = $("#siNumber").val();
	var sendInterval = $("#sendInterval").val();
	var ackReq = $('#acknowledgement').prop("checked") ? 1 : 0;
	var param = app.ui.misc.noOfTestPunchesToSend + ';' + sendInterval + ';' + siNumber + ';' + ackReq;

	var te = new TextEncoder("utf-8").encode(param);
	var parameters = new Uint8Array(te);
	var service = evothings.ble.getService(app.connectedDevice, app.miscService);
	var characteristic = evothings.ble.getCharacteristic(service, app.miscTestPunchesCharacteristic);
	evothings.ble.writeCharacteristic(
		app.connectedDevice,
		characteristic,
		parameters,
		function() {
			console.log('Sending test punches initiated');
			app.miscTestPunchesSuccessBar.settings.autohide = true;
			app.miscTestPunchesSuccessBar.show({
			    html: 'Sending test punches initiated'
			});
			evothings.ble.enableNotification(
				app.connectedDevice,
				characteristic,
				function(data) {
					console.log('subscribe test punches, data received');
					app.ui.displayTestPunches(data);
				},
				function(error) {
					console.log('subscribe test punches error');
					app.miscTestPunchesErrorBar.show({
						html: 'Error subscribePunches: ' + error
					});
				}
			);
		},
		function(error) {
			app.miscTestPunchesErrorBar.show({
			    html: 'Error sending test punches: ' + error
			});
			app.miscTestPunchesErrorBar.hide();
		}
	);
};

app.connect = function(device)
{
        evothings.ble.stopScan()
	app.ui.displayStatus('Scan Paused');
	clearInterval(app.ui.updateTimer);

	console.log('connect('+device.address+')');
	$('#wiroc-status-content').html('');
	$('#wiroc-services-content').html('');
	$('#wiroc-settings-content').html('');
	$("#wiroc-punches-table tbody").html('');
	$("#wiroc-test-punches-table tbody").html('');
	app.testPunches = null;
	app.punches = null;
	$('#stopTestPunch').addClass('ui-disabled');
	$('#testPunchLoading').hide();
	
        evothings.ble.connectToDevice(
		device,
		app.onConnected,
		app.onDisconnected,
		app.onConnectError,
		{ discoverServices: true });
};


// Called when device is connected.
app.onConnected = function(device)
{
    	console.log('Connected to device');
	app.devices = {};
	app.ui.displayDeviceList();

	app.connectedDevice = device;
	$(":mobile-pagecontainer").pagecontainer( "change", "#page-basic-config", { } );
	$('#device-name').text(device.name);
	$('#wirocdevicename').val(device.name);
	$('#tab-radio').css('ui-btn-active');
	$('#tab-radio').trigger('click');
	app.readBasicSettings();
};

// Called if device disconnects.
app.onDisconnected = function(device)
{
	console.log('Disconnected from device');
	app.connectedDevice = null;
	$.mobile.pageContainer.pagecontainer("change", "#page-device-scan", { });
	evothings.ble.reset(function() { console.log('reset success'); },function() { console.log('reset fail'); });
	app.searchDevicesErrorBar.show({
		html: 'Device disconnected'
	});
};


// Called when a connect error occurs.
app.onConnectError = function(error)
{
    console.log('Connect error: ' + error);
    app.searchDevicesErrorBar.show({
		html: 'Connect error: ' + error
    });
    evothings.ble.reset(function() { console.log('reset success'); },function() { console.log('reset fail'); });
};

app.disconnect = function()
{
	if (app.connectedDevice) {
		console.log('disconnect');
		evothings.ble.close(app.connectedDevice);
		app.connectedDevice = null;
	}	
};

app.initialize();

