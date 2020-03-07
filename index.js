const fs = require('fs');
const path = require('path');



module.exports = function WhisperCLI(mod) {
	const {command} = mod.require

	// import config stuff
	let config = require('./config.json'),
		enabled = true,
		whisper = true,
	 	party = true,
		guild = true,
		global = true,
		trade = true,
		inv = true,
		say = true;


	//let area 
	let ownname = null,
		gameId = null;
	
	
	
	//get char name
	mod.hook('S_LOGIN',14, (event) => { ownname = event.name, gameId = event.gameId;})
	
	//message stuff from SYSTEM Message SMT_GENERAL_NOT_IN_THE_WORLD = offline or wrong name / SMT_BANLIST_CANT_CONTRACT_YOUR_SMH = blocked by this person 
		mod.hook('S_SYSTEM_MESSAGE',1 , (event) => {
			if(mod.parseSystemMessage(event.message).id === 'SMT_GENERAL_NOT_IN_THE_WORLD'){mod.log('Player is offline or wrong name')}	
			else if(mod.parseSystemMessage(event.message).id === 'SMT_BANLIST_CANT_CONTRACT_YOUR_SMH'){mod.log('Player has blocked you')} })
			
			
			// chat-module stuff config stuff
			mod.command.add('chat', (arg) => {
				if (!arg) {
					enabled = !enabled;
					mod.log("chat-module " + (Enabled ? "enabled" : "disabled"));
				} else {
					switch (arg) {
						case "whisp":
							whisper = !whisper;
							mod.log("chat-module whisper " + (Enabled ? "enabled" : "disabled"));
							break;
						case "party":
							party = !party;
							mod.log("chat-module party " + (Enabled ? "enabled" : "disabled"));
							break;
						case "guild":
							guild = !guild;
							mod.log("chat-module guild" + (Enabled ? "enabled" : "disabled"));
							break;
							case "global":
								global = !global;
								mod.log("chat-module global" + (Enabled ? "enabled" : "disabled"));
								break;
							case "trade":
								trade = !trade;
								mod.log("chat-module trade" + (Enabled ? "enabled" : "disabled"));
							break;
								case "say":
								say = !say;
								mod.log("chat-module say" + (Enabled ? "enabled" : "disabled"));
							break;
								case "inv":
								inv = !inv;
								mod.log("chat-module inv" + (Enabled ? "enabled" : "disabled"));
							break;
								case "info":
									mod.log("chatmod: " + Enabled);
									mod.log("chatmod-whisp: " + SendToStream);
									mod.log("chatmod-party: " + whichzone);
									mod.log("chatmod-guild: " + whichmode);
									mod.log("chatmod-global: " + whichboss);
									mod.log("chatmod-trade: "   + boss_GameID);
									mod.log("chatmod-say: " + partyMembers.length);
									mod.log("chatmod-inv: " + partyMembers.length);
								break;
									default :
										mod.log("invalid parameter!");
									break;
					}
				}
			});
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
