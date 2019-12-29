const fs = require('fs'),
      path = require('path')

let uwuname = null;

module.exports = function WhisperCLI(mod) {
	const {command} = mod.require

	mod.hook('S_LOGIN',14, (event) => {
	uwuname = event.name
	})

	//message when target is offline
	mod.hook('S_SYSTEM_MESSAGE',1 , (event) => {
		if(event.message.includes('@831')) 
		console.log('Spieler ist nicht online')
	  })

	//whisper incoming
	mod.hook('S_WHISPER', 3, (event) => {
		fs.appendFileSync(path.join(__dirname, 'whispers.txt'), `${msgdatetime()} ${event.name} -> ${event.recipient}: ${stripOuterHTML(event.message)}\n`),
		console.log(('[')+(uwuname)+(']')+('Whisper von')+ " " +('[')+(event.name)+(']')+ " " +('[')+('Nachicht')+(']:')+ " " +stripOuterHTML(event.message))	
	})

	//whisp command for CLI
	command.add('whisp', (target, ...message)=>{
		mod.send('C_WHISPER', 1, {
		  target: target,
		  message: message.join(' ')
		})
	  })

function stripOuterHTML(str) {
	return str.replace(/^<[^>]+>|<\/[^>]+><[^\/][^>]*>|<\/[^>]+>$/g, '')
	}

function msgdatetime(str) {
	var MsgDate = new Date();
	var MsgDateString;
	
	MsgDate.setDate(MsgDate.getDate());
	
	MsgDateString = ('0' + MsgDate.getDate()).slice(-2) + '/' + ('0' + (MsgDate.getMonth()+1)).slice(-2) + '/' + MsgDate.getFullYear() + ' ' + ('0' + MsgDate.getHours()).slice(-2) + ':' + ('0' + MsgDate.getMinutes()).slice(-2) + ':' + ('0' + MsgDate.getSeconds()).slice(-2);
	
	return MsgDateString
}

}