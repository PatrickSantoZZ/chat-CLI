const fs = require('fs');
const path = require('path');



module.exports = function WhisperCLI(mod) {
	const {command} = mod.require

	//let area 
	
	let ownname = null,
		gameId = null;
	
	
	
	//get char name
	mod.hook('S_LOGIN',14, (event) => { ownname = event.name, gameId = event.gameId;})
	
	//message stuff from SYSTEM Message SMT_GENERAL_NOT_IN_THE_WORLD = offline or wrong name / SMT_BANLIST_CANT_CONTRACT_YOUR_SMH = blocked by this person 
		mod.hook('S_SYSTEM_MESSAGE',1 , (event) => {
			if(mod.parseSystemMessage(event.message).id === 'SMT_GENERAL_NOT_IN_THE_WORLD'){mod.log('Player is offline or wrong name')}	
			else if(mod.parseSystemMessage(event.message).id === 'SMT_BANLIST_CANT_CONTRACT_YOUR_SMH'){mod.log('Player has blocked you')} })
	
	//whisper incoming
	mod.hook('S_WHISPER', 3, (event) => {
		mod.log(('[')+(ownname)+(']')+('Whisper from')+ " " +('[')+(event.name)+(']')+ " " +('[')+('Message')+(']:')+ " " +stripOuterHTML(event.message))	
	})

	//whisp command for CLI
	command.add('whisp', (target, ...message)=>{
		mod.send('C_WHISPER', 1, {target: target,message: message.join(' ')	})
			})
	// guild command
	command.add('guild', (...message)=>{
		mod.send('C_CHAT', 1, {channel: 2,message: message.join(' ')	})
			})
	// party command
	command.add('party', (...message)=>{
		mod.send('C_CHAT', 1, {channel: 1,message: message.join(' ')})
	})
	// trade command
	command.add('trade', (...message)=>{
		mod.send('C_CHAT', 1, {channel: 4,message: message.join(' ')	})
			})
	//global command
	command.add('global', (...message)=>{
		mod.send('C_CHAT', 1, {channel: 27,message: message.join(' ')	})
			})
	command.add('say', (...message)=>{
		mod.send('C_CHAT', 1, {channel: 0,message: message.join(' ')	})
			})
	
	mod.hook('S_CHAT',3 , (event) => {
			if((event.channel) === 2){mod.log('[Guild] '+event.name+ " "+ stripOuterHTML(event.message) )}	
			else if ((event.channel) === 1){mod.log('[Party] '+event.name+ " "+ stripOuterHTML(event.message)) }
			else if ((event.channel) === 213){mod.log('[Megaphone] '+event.name+ " "+ stripOuterHTML(event.message)) }
			else if ((event.channel) === 0){mod.log('[Say] '+event.name+ " "+ stripOuterHTML(event.message)) }
			else if ((event.channel) === 4){mod.log('[Trade] '+event.name+ " "+ stripOuterHTML(event.message)) }
			else if ((event.channel) === 27){mod.log('[Global] '+event.name+ " "+ stripOuterHTML(event.message)) }
	})
	

	  var dataArray = new Buffer.alloc(1, Number());
	  command.add('inv', (target)=>{
		mod.send('C_REQUEST_CONTRACT', 1, { 
			target: target,
            type: 4,
            name: target,
            data: dataArray
		})
		mod.log(('[')+(target)+(']')+('Invited') )	
	  })

	  command.add('drop', ()=>{
		mod.send('C_LEAVE_PARTY', 1, {
		})
	  })

	  command.add('add', (target, ...message) => {
		mod.send('C_ADD_FRIEND', 1, {
			name: target,
			message: message.join(' ')

		})
		mod.log(('[')+(target)+(']')+('Added') )	
	})
	
	command.add('disband', () => {
		mod.send('C_DISMISS_PARTY', 1, {})
	})

	function stripOuterHTML(str) {
		return str.replace(/^<[^>]+>|<\/[^>]+><[^\/][^>]*>|<\/[^>]+>$/g, '')
		}

}