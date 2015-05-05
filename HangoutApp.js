/*
	UTILS
*/
function inArray(string, array)
{
    return (array.indexOf(string) > -1);
}

/*
	LISTE DES CIBLES
*/
var target = 
[
    "Etitia Arnaud"
];

var guardian =
[
	"Benjamin LEDRAPPIER"
];

/*
	CHARGEMENT API HANGOUT
*/                                         
gadgets.util.registerOnLoadHandler(init);

function init() 
{                                                      
	gapi.hangout.onApiReady.add(function(eventObj) 
	{
    	if (eventObj.isApiReady)
    	{
			load_participant();
    		if(!isTarget())
	        	document.getElementById('sane_hangout').style.visibility = 'visible';
    		else
	        	document.getElementById('warning').style.visibility = 'visible';
    	}
   	});

	gapi.hangout.onParticipantsChanged.add(load_participant);
	gapi.hangout.data.onStateChanged.add(updateCheckbox);
}

function load_participant()
{
	var participants = gapi.hangout.getParticipants();
	muted = [];
  	if (isTarget())
  		html = '';
  	else if (isGuardian())
  		html = adminLoad(participants);
  	else
  		html = normalLoad(participants);

  	document.getElementById('hangout_participant').innerHTML = html;
  	document.getElementById('hangout_participant').style.visibility = 'visible';
}

function adminLoad(participants)
{
  	var html = '';
  	for (var index in participants) 
  	{
    	var participant = participants[index];
    	if (inArray(participant.person.displayName, target))
    		html += '<p>' + participant.person.displayName + ' <input class="button" type="button" value="DECIBLER" onClick="delTarget(\'' + participant.person.displayName + '\')"/></p>';
	    else if(inArray(participant.person.displayName, guardian))
	    	html += '<p>' + participant.person.displayName + ' (DIEU)</p>';
    	else
	    	html += '<p>' + participant.person.displayName + ' <input class="button" type="button" value="CIBLER" onClick="addTarget(\'' + participant.person.displayName + '\')"/></p>';
  	}
  	return html;
}

function normalLoad()
{
  	var html = '';
  	for (var index in participants) 
  	{
    	var participant = participants[index];
    	if (inArray(participant.person.displayName, target))
    		html += '<p>' + participant.person.displayName + ' (CIBLE)</p>';
	    else if(inArray(participant.person.displayName, guardian))
	    	html += '<p>' + participant.person.displayName + ' (DIEU)</p>';
    	else
	    	html += '<p>' + participant.person.displayName + ' </p>';
  	}
  	return html;
}



function addTarget(name) 
{
	var local = gapi.hangout.getLocalParticipant();
	if (isGuardian())
		realAdd(name);
}

function realAdd(name) 
{
	target.push(name);
	load_participant();
}

function delTarget(name) 
{
	var local = gapi.hangout.getLocalParticipant();
	if (isGuardian())
		realDel(name);
}

function realDel(name)
{
	for(var i = 0; i < target.length ; i++) 
	{
	    if(target[i] == name) 
	    {
    	   target.splice(i, 1);
    	   break;
    	}
	}
}

function isTarget() 
{
	var local = gapi.hangout.getLocalParticipant();
	return inArray(local.person.displayName, target);
}

function isGuardian() 
{
	var local = gapi.hangout.getLocalParticipant();
	return inArray(local.person.displayName, guardian);
}

var BaseURL = 'https://raw.githubusercontent.com/Jebik/Hangout_app/master/static/';
var SoundURL = [];
var SoundHG = [];
var muted = [];

SoundURL.push(BaseURL+'vinou_1.wav');
SoundURL.push(BaseURL+'vinou_2.wav');
SoundURL.push(BaseURL+'kevin_1.wav');
SoundURL.push(BaseURL+'kevin_2.wav');
SoundURL.push(BaseURL+'kevin_4.wav');
SoundURL.push(BaseURL+'kevin_3.wav');
SoundURL.push(BaseURL+'pierre.wav');
for (var index in SoundURL) 
{
	var sound = gapi.hangout.av.effects.createAudioResource(SoundURL[index]).createSound({loop: false, localOnly: false});
	SoundHG.push(sound);
}

function muteArnaud() 
{
	autoMute();
	var length = SoundHG.length;
	var choose = Math.floor(Math.random() * 1000);
	choose = choose%length; 
	SoundHG[choose].play();
}

function autoMute() 
{	
	for (var index in muted) 
  	{
		gapi.hangout.av.muteParticipantMicrophone(muted[index]);
	}
}

function muteLoop() 
{
	var mute = document.querySelector('#AM-checkbox').checked;
    if (mute) 
    {
		window.setTimeout(muteLoop, 100);
		autoMute();
    }
}


function updateCheckbox()
{
	var check = gapi.hangout.data.getValue('AM_statut');
	if (check == 'true')
		document.getElementById('AM-checkbox').checked = true;
	else
		document.getElementById('AM-checkbox').checked = false;
}

function updateAM() 
{
	var check =  document.getElementById('AM-checkbox').checked;
	if (check) 
	{
		gapi.hangout.data.setValue('AM_statut', 'true');
  		muteLoop();
  	}
  	else
  		gapi.hangout.data.setValue('AM_statut', 'false');
}