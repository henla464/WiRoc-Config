
evothings.loadScript('libs/evothings/easyble/easyble.dist.js');


// Application object.
var app = {};

// Device list.
app.devices = {};
app.connectedDevice = null;
app.radioService = 'f6026b69-9254-fd82-0242-60d9aaff57dc';
app.radioService2 =                      'dc57ffaa-d960-4202-82fd-5492696b02f6';
app.radioChannelCharacteristic =         'dc57ffab-d960-4202-82fd-5492696b02f6';
app.radioAcknowledgementCharacteristic = 'dc57ffac-d960-4202-82fd-5492696b02f6';
app.radioDataRateCharacteristic =        'dc57ffad-d960-4202-82fd-5492696b02f6';
app.meosService = '6e30b300-be1b-401c-8a6d-1a59d5c23c64';
app.sendToMeosEnabledCharacteristic =         	'6e30b301-be1b-401c-8a6d-1a59d5c23c64';
app.sendToMeosIPCharacteristic = 		'6e30b302-be1b-401c-8a6d-1a59d5c23c64';
app.sendToMeosIPPortCharacteristic =        	'6e30b303-be1b-401c-8a6d-1a59d5c23c64';
app.batteryService = '0000180f-0000-1000-8000-00805f9b34fb';
app.batteryLevelCharacteristic =         	'00002a19-0000-1000-8000-00805f9b34fb';
// UI methods.
app.ui = {};

// Timer that updates the device list and removes inactive
// devices in case no devices are found by scan.
app.ui.updateTimer = null;

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(app.onDeviceReady) },
		false);
};

app.onDeviceReady = function()
{
	//alert('device ready');
	app.ui.showPredefinedChannelPage();
	app.ui.onStartScanButton();
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
}

app.ui.onShowPredefinedChannelPage = function()
{
	$('#channel-header').animate({'opacity': 0, 'font-size': '3vw'}, 600, function () {
		app.ui.showPredefinedChannelPage();
	}).animate({'opacity': 1,'font-size': '10vw'}, 500);
}

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
}

app.ui.onShowCustomChannelPage = function()
{
	$('#channel-header').animate({'opacity': 0, 'font-size': '3vw'}, 600, function () {
		app.ui.showCustomChannelPage();
	}).animate({'opacity': 1, 'font-size': '7vw'}, 500);
}

// Start the scan. Call the callback function when a device is found.
// Format:
//   callbackFun(deviceInfo, errorCode)
//   deviceInfo: address, rssi, name
//   errorCode: String
app.startScan = function(callbackFun)
{
	app.stopScan();
	//alert(JSON.stringify(evothings));
	evothings.easyble.startScan(
			function(device)
			{
				// Report success. Sometimes an RSSI of +127 is reported.
				// We filter out these values here.
				//alert(JSON.stringify(device));
				if (device.rssi <= 0)
				{
					callbackFun(device, null);
				}
			},
			function(errorCode)
			{
				// Report error.
				callbackFun(null, errorCode);
			}
	);
};

// Stop scanning for devices.
app.stopScan = function()
{
	evothings.easyble.stopScan();
};

// Called when Start Scan button is selected.
app.ui.onStartScanButton = function()
{
	app.startScan(app.ui.deviceFound);
	app.ui.displayStatus('Scanning...');
	app.ui.updateTimer = setInterval(app.ui.displayDeviceList, 500);
};

// Called when Stop Scan button is selected.
app.ui.onStopScanButton = function()
{
	app.stopScan();
	app.devices = {};
	app.ui.displayStatus('Scan Paused');
	app.ui.displayDeviceList();
	clearInterval(app.ui.updateTimer);
};

// Called when a device is found.
app.ui.deviceFound = function(device, errorCode)
{
	if (device && app.ui.deviceFilter(device))
	{
		// Set timestamp for device (this is used to remove
		// inactive devices).
		device.timeStamp = Date.now();

		// Insert the device into table of found devices.
		app.devices[device.address] = device;
	}
	else if (errorCode)
	{
		app.ui.displayStatus('Scan Error: ' + errorCode);
	}
};

// Used to filter devices
app.ui.deviceFilter = function(device)
{
	
	if (device.advertisementData && device.advertisementData.kCBAdvDataServiceUUIDs)
	{
		var advertisedServiceUUIDs = device.advertisementData.kCBAdvDataServiceUUIDs
		console.log(JSON.stringify(advertisedServiceUUIDs));
		if (advertisedServiceUUIDs.indexOf(app.radioService) > -1 ||
				advertisedServiceUUIDs.indexOf(app.radioService2) > -1)
	    {
	        console.log('WiRoc found')
	        return true;
	    }
		return false;
	}
	
	return false;
};

// Display the device list.
app.ui.displayDeviceList = function()
{
	// Clear device list.
	$('#found-devices').empty();

	var timeNow = Date.now();

	$.each(app.devices, function(key, device)
	{
		// Only show devices that are updated during the last 10 seconds.
		if (device.timeStamp + 10000 > timeNow)
		{
			// Map the RSSI value to a width in percent for the indicator.
			var rssiWidth = 100; // Used when RSSI is zero or greater.
			if (device.rssi < -100) { rssiWidth = 0; }
			else if (device.rssi < 0) { rssiWidth = 100 + device.rssi; }

			// Create tag for device data.
			var element = $(
				'<li style="padding:10px" class="device">'
				+	'<strong>' + device.name + '</strong>'
				+   '<a href="#" style="float:right" class="button connect-button">CONNECT &gt;</a>'
				+   '<table style="border:0px;padding:0px;width:100%;">'
				+     '<tr>'
				+       '<td style="white-space:nowrap;">Bluetooth addr:</td>'
				+       '<td>' + device.address + '</td>'
				+     '</tr>'
				+     '<tr>'
				+       '<td style="white-space:nowrap;">Signal ' + device.rssi + ' dBm</td>'
				+       '<td style="background:rgb(150,150,150);margin:0px;padding:4px">'
				+          '<div style="background:rgb(225,0,0);height:20px;width:'	+ 	rssiWidth + '%;"></div>'
				+       '</td>'
				+     '</tr>'
				+   '</table>'
				+ '</li>'
			);
			
			element.find('a.button').bind("click",
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

app.ui.displayChannel = function(channel)
{
	var raw = new DataView(channel).getUint8(0, true);
	console.log('channel: ' + raw);
	// Select the relevant option, de-select any others
	$('#channel-select').val(raw).attr('selected', true).siblings('option').removeAttr('selected');

	// jQM refresh
	$('#channel-select').selectmenu("refresh", true);
};

app.getChannel = function(callback)
{
	console.log('getchannel');
	app.connectedDevice.readCharacteristic(
			app.radioService2,
			app.radioChannelCharacteristic,
		    function(channel) {
				callback(channel);
			},
		    function(error) {
				alert('GetChannel errror: ' + error);
			});
};

app.ui.getChannel = function() {
	var value = $("#channel-select option:selected").val();
	return value;
}

app.writeChannel = function(callback)
{
	console.log('writechannel');
	var channel = parseInt(app.ui.getChannel());
	app.connectedDevice.writeCharacteristic(
			app.radioService2,
			app.radioChannelCharacteristic,
			new Uint8Array([channel]),
		    callback,
		    function(error) {
				alert('writeChannel error: ' + error);
			});
};


//---- ack

app.getAcknowledgementRequested = function(callback)
{
	console.log('getack');
	app.connectedDevice.readCharacteristic(
			app.radioService2,
			app.radioAcknowledgementCharacteristic,
		    function(acknowledgement) {
				callback(acknowledgement);
			},
		    function(error) {
				alert('getAcknowledmentRequested error: ' + error);
			});
};

app.ui.getAcknowledgementRequested = function() {
	return $('#acknowledgement').prop("checked") ? 1 : 0;
}

app.writeAcknowledgementRequested = function(callback)
{
	console.log('writeack');
	var ack = app.ui.getAcknowledgementRequested();
	app.connectedDevice.writeCharacteristic(
			app.radioService2,
			app.radioAcknowledgementCharacteristic,
			new Uint8Array([ack]),
		    callback,
		    function(error) {
				alert('writeAcknowledmentRequested error: ' + error);
			});
};

app.ui.displayAcknowledgementRequested = function(acknowledgement)
{
	var raw = new DataView(acknowledgement).getUint8(0, true);
	console.log('ack: ' + raw);
	$('#acknowledgement').prop("checked",raw != 0).checkboxradio("refresh");
};

//-- data rate
app.getDataRate = function(callback)
{
	console.log('getdatarate');
	app.connectedDevice.readCharacteristic(
			app.radioService2,
			app.radioDataRateCharacteristic,
		    function(dataRate) {
				callback(dataRate);
			},
		    function(error) {
				alert('getDataRate error: ' + error);
			});
};

app.ui.getDataRate = function() {
	var selected = $(".datarate [type='radio']:checked");
	return selected.val();
}

app.writeDataRate = function(callback)
{
	console.log('write data rate');
	var dataRate = parseInt(app.ui.getDataRate());
	app.connectedDevice.writeCharacteristic(
			app.radioService2,
			app.radioDataRateCharacteristic,
			new Uint16Array([dataRate]),
		    callback,
		    function(error) {
				alert('writeDataRate error: ' + error);
			});
};

app.ui.displayDataRate = function(dataRate)
{
	var rawDataRate = new DataView(dataRate).getUint16(0, true);
	console.log('data rate: ' + rawDataRate);
	$(".datarate [type='radio'][value = '" + rawDataRate + "']").prop("checked", true).checkboxradio("refresh");
	$(".datarate [type='radio']").not( "[value = '" + rawDataRate + "']").prop("checked", false).checkboxradio("refresh");
	if (rawDataRate == 586) {
		app.ui.showPredefinedChannelPage();
	} else {
		app.ui.showCustomChannelPage();
	}
};

//-- Battery

app.getBatteryLevel = function(callback)
{
	console.log('getBatteryLevel');
	app.connectedDevice.readCharacteristic(
			app.batteryService,
			app.batteryLevelCharacteristic,
		    function(batteryLevel) {
				console.log(batteryLevel);
				callback(batteryLevel);
			},
		    function(error) {
				alert('getBatteryLevel error: ' + error);
			});

};


app.ui.displayBatteryLevel = function(batteryLevel)
{
	var rawBatteryLevel = new DataView(batteryLevel).getUint8(0, true);
	console.log('battery level: ' + rawBatteryLevel);

	levelBar = $('.level');
	var isCharging = false;
	levelBar.removeClass('high');
	levelBar.removeClass('med');
	levelBar.removeClass('low');
	if (isCharging) {
	  levelBar.addClass('charging');
	} else if (rawBatteryLevel > 60) {
	  levelBar.addClass('high');
	} else if (rawBatteryLevel >= 30 ) {
	  levelBar.addClass('med');
	} else {
	  levelBar.addClass('low');
	};
	levelBar.css('width', rawBatteryLevel + '%');

	var label = $('#batterylabel');
	label.text(rawBatteryLevel+"%");
};


//-- Send to Meos enabled
app.getSendToMeosEnabled = function(callback)
{
	console.log('getSendToMeosEnabled');
	app.connectedDevice.readCharacteristic(
			app.meosService,
			app.sendToMeosEnabledCharacteristic,
		    function(meosEnabled) {
				callback(meosEnabled);
			},
		    function(error) {
				alert('getSendToMeosEnabled error:' + error);
			});
};

app.ui.getSendToMeosEnabled = function() {
	return $('#sendtomeosenabled').prop("checked") ? 1 : 0;
}

app.writeSendToMeosEnabled = function(callback)
{
	console.log('write send to meos enabled');
	var meosEnabled = app.ui.getSendToMeosEnabled();
	app.connectedDevice.writeCharacteristic(
			app.meosService,
			app.sendToMeosEnabledCharacteristic,
			new Uint8Array([meosEnabled]),
		    callback,
		    function(error) {
				alert('writeSendToMeosEnabled error: ' + error);
			});
};

app.ui.displaySendToMeosEnabled = function(meosEnabled)
{
	var raw = new DataView(meosEnabled).getUint8(0, true);
	console.log('send to meos enabled: ' + raw);
	$('#sendtomeosenabled').prop("checked",raw != 0).checkboxradio("refresh");
};


//-- Send to Meos ip
app.getSendToMeosIP = function(callback)
{
	console.log('getSendToMeosIP');
	app.connectedDevice.readCharacteristic(
			app.meosService,
			app.sendToMeosIPCharacteristic,
		    function(meosIP) {
				callback(meosIP);
			},
		    function(error) {
				alert('getSendToMeosIP error: ' + error);
			});
};

app.ui.getSendToMeosIP = function() {
	var meosIP = $("#sendtomeosip").val();
	return meosIP;
}

app.writeSendToMeosIP = function(callback)
{
	console.log('write meos ip');
	var meosIP = app.ui.getSendToMeosIP();
	var te = new TextEncoder("utf-8").encode(meosIP);
	var meosIPArray = new Uint8Array(te);

	app.connectedDevice.writeCharacteristic(
			app.meosService,
			app.sendToMeosIPCharacteristic,
			meosIPArray,
			callback,
		    function(error) {
				alert('writeSendToMeosIP error: ' + error);
			});
};

app.ui.displaySendToMeosIP = function(meosIP)
{
	var meosIPString = new TextDecoder("utf-8").decode(meosIP);
	console.log('meos ip: ' + meosIPString);
	$("#sendtomeosip").val(meosIPString);
};

//-- Send to Meos ip port
app.getSendToMeosIPPort = function(callback)
{
	console.log('getSendToMeosIPPort');
	app.connectedDevice.readCharacteristic(
			app.meosService,
			app.sendToMeosIPPortCharacteristic,
		    function(meosIPPort) {
				callback(meosIPPort);
			},
		    function(error) {
				alert('getSendToMeosIPPort error: ' + error);
			});
};

app.ui.getSendToMeosIPPort = function() {
	var meosIPPort = $("#sendtomeosipport").val();
	return meosIPPort;
}

app.writeSendToMeosIPPort = function(callback)
{
	console.log('write meos ip port');
	var meosIPPort = parseInt(app.ui.getSendToMeosIPPort());
	app.connectedDevice.writeCharacteristic(
			app.meosService,
			app.sendToMeosIPPortCharacteristic,
			new Uint16Array([meosIPPort]),
		    callback,
		    function(error) {
				alert('writeSendToMeosIPPort error: ' + error);
			});
};

app.ui.displaySendToMeosIPPort = function(meosIPPort)
{
	var rawMeosIPPort = new DataView(meosIPPort).getUint16(0, true);
	console.log('meos ip port: ' + rawMeosIPPort);
	$("#sendtomeosipport").val(rawMeosIPPort);
};

//--

app.readBasicSettings = function() {
	app.getBatteryLevel(app.ui.displayBatteryLevel);
	app.getDataRate(app.ui.displayDataRate);
	app.getChannel(app.ui.displayChannel);
	app.getAcknowledgementRequested(app.ui.displayAcknowledgementRequested);
}

app.ui.onReadBasicButton = function() {
	app.readBasicSettings();
}

app.ui.onApplyBasicButton = function() {
	app.writeChannel(function() {
		app.writeAcknowledgementRequested(function() {
			app.writeDataRate(function() {
				alert('success');
				app.getChannel(app.ui.displayChannel);
				app.getAcknowledgementRequested(app.ui.displayAcknowledgementRequested);
				app.getDataRate(app.ui.displayDataRate);
			});
		});
	});
}

app.readAdvancedSettings = function() {
	app.getBatteryLevel(app.ui.displayBatteryLevel);
	app.getSendToMeosEnabled(app.ui.displaySendToMeosEnabled);
	app.getSendToMeosIP(app.ui.displaySendToMeosIP);
	app.getSendToMeosIPPort(app.ui.displaySendToMeosIPPort);
}

app.ui.onReadAdvancedButton = function() {
	app.readAdvancedSettings();
}

app.ui.onApplyAdvancedButton = function() {
	app.writeSendToMeosEnabled(function() {
		app.writeSendToMeosIP(function() {
			app.writeSendToMeosIPPort(function() {
				alert('success');
				app.getSendToMeosEnabled(app.ui.displaySendToMeosEnabled);
				app.getSendToMeosIP(app.ui.displaySendToMeosIP);
				app.getSendToMeosIPPort(app.ui.displaySendToMeosIPPort);
			});
		});
	});
}

app.connect = function(device)
{
	app.stopScan();
	app.ui.displayStatus('Scan Paused');
	clearInterval(app.ui.updateTimer);
	
	console.log('connect('+device.address+')');
	device.connect(function(device)
	{
		app.connectedDevice = device;
		console.log('Connected');
		$(":mobile-pagecontainer").pagecontainer( "change", "#page-basic-config", { } );
		$('#device-name').text(device.name);
		
		device.readServices(function(device)
			{
			    console.log('Read services completed: ' + JSON.stringify(device));
			    // We can now read/write to the device.
			    app.readBasicSettings();
			},
			function(error)
			{
				alert('services error');
			    console.log('Read services error: ' + error)
			}
		);
		console.log('after readservices');
	}, function(errorCode)
	{
		if (errorCode == evothings.easyble.error.DISCONNECTED)
	    {
	        console.log('Device disconnected')
	    }
	    else
	    {
	        console.log('Connect error: ' + errorCode)
	    }
	}, 
	{ serviceUUIDs: [app.radioService] }	
	);
};

app.disconnect = function()
{
	if (app.connectedDevice) {
		console.log('disconnect');
		app.connectedDevice.close();
	}
};

app.initialize();
