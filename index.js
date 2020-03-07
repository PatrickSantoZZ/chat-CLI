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
					else if(mod.parseSystemMessage(event.message).id === 'SMT_BANLIST_CANT_CONTRACT_YOUR_SMH'){mod.log('Player has blocked you')} 
				})
					
			
			// chat-module stuff config stuff
			mod.command.add('chat', (arg) => {
				if (!arg) {
					enabled = !enabled;
					mod.log("chat-module " + (enabled ? "enabled" : "disabled"));
				} else {
					switch (arg) {
						case "whisp":
							whisper = !whisper;
							mod.log("chat-module whisper " + (whisper ? "enabled" : "disabled"));
							break;
						case "party":
							party = !party;
							mod.log("chat-module party " + (party ? "enabled" : "disabled"));
							break;
						case "guild":
							guild = !guild;
							mod.log("chat-module guild" + (guild ? "enabled" : "disabled"));
							break;
						case "global":
							global = !global;
							mod.log("chat-module global" + (global ? "enabled" : "disabled"));
							break;
						case "trade":
							trade = !trade;
							mod.log("chat-module trade" + (trade ? "enabled" : "disabled"));
							break;
						case "say":
							say = !say;
							mod.log("chat-module say" + (say ? "enabled" : "disabled"));
							break;
						case "inv":
							inv = !inv;
							mod.log("chat-module inv" + (inv ? "enabled" : "disabled"));
							break;
						case "info":
								mod.log("chatmod: " + enabled);
								mod.log("chatmod-whisp: " + whisper);
								mod.log("chatmod-party: " + party);
								mod.log("chatmod-guild: " + guild);
								mod.log("chatmod-global: " + global);
								mod.log("chatmod-trade: "   + trade);
								mod.log("chatmod-say: " + say);
								mod.log("chatmod-inv: " + inv);
								break;
						default:
							mod.log("invalid parameter!");
							break;
					}
				}
			});

							// chat-modes
							mod.command.add('c', (arg) => {
								if (!arg) {
									mod.log('---Chat help---'));
									mod.log('c whisp - for whisper chat');
									mod.log('c party - for party chat');
									mod.log('c global - for global chat');
									mod.log('c trade - for trade chat');
									mod.log('c say - for say chat');
									mod.log('c inv - invite member to your party');
									mod.log('c add - to add a friend to your list');
									mod.log('c drop - leave your current party');
									mod.log('c disband - disband your party');
								} else {
									switch (arg) {
										case "whisp":
											whisper = !whisper;
											mod.log("chat-module whisper " + (whisper ? "enabled" : "disabled"));
											break;
										case "party":
											party = !party;
											mod.log("chat-module party " + (party ? "enabled" : "disabled"));
											break;
										case "guild":
											guild = !guild;
											mod.log("chat-module guild" + (guild ? "enabled" : "disabled"));
											break;
											case "global":
												global = !global;
												mod.log("chat-module global" + (global ? "enabled" : "disabled"));
												break;
											case "trade":
												trade = !trade;
												mod.log("chat-module trade" + (trade ? "enabled" : "disabled"));
											break;
												case "say":
												say = !say;
												mod.log("chat-module say" + (say ? "enabled" : "disabled"));
											break;
												case "inv":
												inv = !inv;
												mod.log("chat-module inv" + (inv ? "enabled" : "disabled"));
											break;
												case "info":
													mod.log("chatmod: " + enabled);
													mod.log("chatmod-whisp: " + whisper);
													mod.log("chatmod-party: " + party);
													mod.log("chatmod-guild: " + guild);
													mod.log("chatmod-global: " + global);
													mod.log("chatmod-trade: "   + trade);
													mod.log("chatmod-say: " + say);
													mod.log("chatmod-inv: " + inv);
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
