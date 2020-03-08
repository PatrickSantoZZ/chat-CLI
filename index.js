const fs = require('fs');
const path = require('path');



module.exports = function WhisperCLI(mod) {
	const {command} = mod.require

//=====================config=======================
	let config = {};
	let settingTimeout = null;
	let settingLock = false;
	
	function settingUpdate() {
		clearTimeout(settingTimeout);
		settingTimeout = setTimeout(settingSave,1000);
	}

	function settingSave() {
		if (settingLock) {
		settingUpdate();
		return;
	}
	fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(config, undefined, '\t'), err => {
	settingLock = false;
	});
	}

	try { config = require('./config.json'); }
		catch (e) {
		config = {};
		settingUpdate();
	}
	//enable chatmod
	let enabled = true;
	if (("enabled" in config)) {
	enabled = config.enabled;
	}
	if (!("enabled" in config)) {
	config.enabled = true;
	settingUpdate();
	}
	//enable whispermode
	let whisper = true;
	if (("whisper" in config)) {
		whisper = config.whisper;
	}
	if (!("whisper" in config)) {
	config.whisper = true;
	settingUpdate();
	}
	//enable partymode
	let party = true;
	if (("party" in config)) {
		party = config.party;
	}
	if (!("party" in config)) {
	config.party = true;
	settingUpdate();
	}
	//enable guildmode
	let guild = true;
	if (("guild" in config)) {
		guild = config.guild;
	}
	if (!("guild" in config)) {
	config.guild = true;
	settingUpdate();
	}
	//enable globalmode
	let global = true;
	if (("global" in config)) {
		global = config.global;
	}
	if (!("global" in config)) {
	config.global = true;
	settingUpdate();
	}
	//enable trademode
	let trade = true;
	if (("trade" in config)) {
		trade = config.trade;
	}
	if (!("trade" in config)) {
	config.trade = true;
	settingUpdate();
	}
	//enable invmode
	let inv = true;
	if (("inv" in config)) {
		inv = config.inv;
	}
	if (!("inv" in config)) {
	config.inv = true;
	settingUpdate();
	}
	//enable saymode
	let say = true;
	if (("say" in config)) {
		say = config.say;
	}
	if (!("say" in config)) {
	config.say = true;
	settingUpdate();
	}
	//enable multicli
	let multicli = false;
	if (("multicli" in config)) {
		multicli = config.multicli;
	}
	if (!("multicli" in config)) {
	config.multicli = false;
	settingUpdate();
	}

	//let area 
	let playername = null,
		gameId = null;

					
//=====================Commands=======================			
	// chat-module stuff config stuff
		command.add("chat", {
			on() {
				enabled = true
				mod.log(`[chat-module enabled]`)
				config.enabled = enabled
				settingUpdate()
				},
			off() {
				enabled = false
				mod.log(`[chat-module disabled]`)
				config.enabled = enabled
				settingUpdate()
				},
			whisp() {
				whisper = !whisper
				mod.log(`chat-module whisper [${whisper ? 'enabled' : 'disabled'}].`)
				config.whisper = whisper
				settingUpdate()
				},
			party() {
				party = !party
				mod.log(`chat-module party [${party ? 'enabled' : 'disabled'}].`)
				config.party = party
				settingUpdate()
				},
			guild() {
				guild = !guild
				mod.log(`chat-module guild [${guild ? 'enabled' : 'disabled'}].`)
				config.guild = guild
				settingUpdate()
				},
			global() {
				global = !global
				mod.log(`chat-module global [${global ? 'enabled' : 'disabled'}].`)
				config.global = global
				settingUpdate()
				},
			trade() {
				trade = !trade
				mod.log(`chat-module trade [${trade ? 'enabled' : 'disabled'}].`)
				config.trade = trade
				settingUpdate()
				},
			say() {
				say = !say
				mod.log(`chat-module say [${say ? 'enabled' : 'disabled'}].`)
				config.say = say
				settingUpdate()
				},
			inv() {
				inv = !inv
				mod.log(`chat-module inv [${inv ? 'enabled' : 'disabled'}].`)
				config.inv = inv
				settingUpdate()
				},
			multi() {
					multicli = !multicli
					mod.log(`chat-module multicli [${multicli ? 'enabled' : 'disabled'}].`)
					config.multicli = multicli
					settingUpdate();
					activatemulticli();
					},
			info() {
				mod.log('---Chat Settings---');			
				mod.log("chatmod: " + config.enabled);
				mod.log("chatmod-whisp: " + config.whisper);
				mod.log("chatmod-party: " + config.party);
				mod.log("chatmod-guild: " + config.guild);
				mod.log("chatmod-global: " + config.global);
				mod.log("chatmod-trade: "   + config.trade);
				mod.log("chatmod-say: " + config.say);
				mod.log("chatmod-inv: " + config.inv);
				mod.log("Multi-CLI: " + config.multicli);	
			}
			
		})

	// chat-modes
	let dataArray = new Buffer.alloc(1, Number());
	command.add("cha", {
			help() {
				mod.log('---Chat help---');
				mod.log('cha whisp - for whisper chat');
				mod.log('cha party - for party chat');
				mod.log('cha global - for global chat');
				mod.log('cha trade - for trade chat');
				mod.log('cha say - for say chat');
				mod.log('cha inv - invite member to your party');
				mod.log('cha add - to add a friend to your list');
				mod.log('cha drop - leave your current party');
				mod.log('cha disband - disband your party');
				mod.log('cha multicli - activate multi cli mode');
				},
			whisp(target, ...message) {
				whisptarget = target;
				if (config.whisper) {
				mod.send('C_WHISPER', 1, {target: target,message: message.join(' ')})  
				} else {
					mod.log('please enabled Whisperchat first');
				}
				},
			guild(...message) {
				if (config.guild) {
				mod.send('C_CHAT', 1, {channel: 2,message: message.join(' ')})
				} else {
					mod.log('please enabled Guildchat first');
				}	
				},
			party(...message) {
				if (config.party) {
				mod.send('C_CHAT', 1, {channel: 1,message: message.join(' ')})
				} else {
					mod.log('please enabled Partychat first');
				}
				},
			trade(...message) {
				if (config.trade) {
				mod.send('C_CHAT', 1, {channel: 4,message: message.join(' ')})
				} else {
					mod.log('please enabled Tradechat first');
				}
				},							
			global(...message) {
				if (config.global) {
				mod.send('C_CHAT', 1, {channel: 27,message: message.join(' ')})
				}else{
					mod.log('please enabled Globalchat first');
				}
				},	
			say(...message) {
				if (config.say) {					
				mod.send('C_CHAT', 1, {channel: 0,message: message.join(' ')})
				}else{
					mod.log('please enabled Saychat first');
				}
				},
			inv(target) {
				if (config.inv) {
				mod.send('C_REQUEST_CONTRACT', 1, { 
					target: target,
					type: 4,
					name: target,
					data: dataArray
				})
					mod.log(target+" "+'invited');
				}else{
					mod.log('please enabled inv first');
				}
				},
			drop() {
				if (config.inv) {
				mod.send('C_LEAVE_PARTY', 1, {})
				mod.log('Left Group');
				}else{
					mod.log('please enabled inv first');
				}
				},
			disband() {
				if (config.inv) {
				mod.send('C_DISMISS_PARTY', 1, {});
				mod.log('Group disbanded')
			}else{
				mod.log('please enabled inv first');}
				},
			add(target, ...message) {
				if (config.inv) {
				mod.send('C_ADD_FRIEND', 1, {
					name: target,
					message: message.join(' ')
				})
					mod.log(target+" "+'added');
				}else{
					mod.log('please enabled inv first');
				}	
				}
				

	})
//=====================Hooks==========================	
	let whisptarget;
	let clientnum;
	
	//whisper incoming better overview soon tm 
	mod.hook('S_WHISPER', 3, (event) => {
		if( config.enabled && config.whisper && event.name == playername){ mod.log((playername+' -> '+whisptarget+': '+removeShit(event.message)))}
			else if (config.enabled && config.whisper){ mod.log(event.name+' -> '+playername+': '+removeShit(event.message))}
				//else if ( config.enabled && config.whisper && config.multicli && event.name == playername){ mod.log(('['+clientnum+']'+playername+' -> '+whisptarget+': '+removeShit(event.message)))}
				//	else if (config.enabled && config.whisper && config.multicli){ mod.log(('['+clientnum+']'+event.name+' -> '+playername+': '+removeShit(event.message)))}	
				// unused shit i fix this soonTM
	})

	mod.hook('S_CHAT',3 , (event) => {
		if( config.enabled && config.guild && (event.channel) === 2){mod.log('[Guild] '+'<'+event.name+'>'+" "+removeShit(event.message) )}	
		else if (config.enabled && config.party && (event.channel) === 1){mod.log('[Party] '+'<'+event.name+'>'+" "+removeShit(event.message)) }
		else if (config.enabled && (event.channel) === 213){mod.log('[Megaphone] '+'<'+event.name+'>'+" "+removeShit(event.message)) }
		else if (config.enabled && config.say &&(event.channel) === 0){mod.log('[Say] '+'<'+event.name+'>'+" "+removeShit(event.message)) }
		else if (config.enabled && config.trade && (event.channel) === 4){mod.log('[Trade] '+'<'+event.name+'>'+" "+removeShit(event.message)) }
		else if (config.enabled && config.global && (event.channel) === 27){mod.log('[Global] '+'<'+event.name+'>'+" "+removeShit(event.message)) }
	})
	//get char name
	mod.hook('S_LOGIN',14, (event) => { playername = event.name, gameId = event.gameId; })
			
	//message stuff from SYSTEM Message SMT_GENERAL_NOT_IN_THE_WORLD = offline or wrong name / SMT_BANLIST_CANT_CONTRACT_YOUR_SMH = blocked by this person 
	mod.hook('S_SYSTEM_MESSAGE',1 , (event) => {
		if(mod.parseSystemMessage(event.message).id === 'SMT_GENERAL_NOT_IN_THE_WORLD'){mod.log('Player is offline or wrong name')}	
		else if(mod.parseSystemMessage(event.message).id === 'SMT_BANLIST_CANT_CONTRACT_YOUR_SMH'){mod.log('Player has blocked you')} 
	})
//=====================Functions==========================
	//currently unused cuz removeShit() works better
	function stripOuterHTML(str) {
			return str.replace(/^<[^>]+>|<\/[^>]+><[^\/][^>]*>|<\/[^>]+>$/g, '')
	}
		function removeShit(str) {
			return str.replace(/<[^>]*>/g, "").replace(/&.{3}/g, "")
		}
			//currently unused cuz idk xD fucked something up with the multi cli stuff
		/*	function activatemulticli() {
				if (config.enabled && config.whisper && config.multicli) {
					const {client} = mod.require;
					const clientnum = client.getIndex()+1;
					clientnum = clientnum;
				}
			}
		*/
}