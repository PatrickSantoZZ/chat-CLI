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

	//let area 
	let ownname = null,
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
			info() {			
				mod.log("chatmod: " + config.enabled);
				mod.log("chatmod-whisp: " + config.whisper);
				mod.log("chatmod-party: " + config.party);
				mod.log("chatmod-guild: " + config.guild);
				mod.log("chatmod-global: " + config.global);
				mod.log("chatmod-trade: "   + config.trade);
				mod.log("chatmod-say: " + config.say);
				mod.log("chatmod-inv: " + config.inv);	
			}
			
		})

	// chat-modes
	let dataArray = new Buffer.alloc(1, Number());
	command.add("c", {
			help() {
				mod.log('---Chat help---');
				mod.log('c whisp - for whisper chat');
				mod.log('c party - for party chat');
				mod.log('c global - for global chat');
				mod.log('c trade - for trade chat');
				mod.log('c say - for say chat');
				mod.log('c inv - invite member to your party');
				mod.log('c add - to add a friend to your list');
				mod.log('c drop - leave your current party');
				mod.log('c disband - disband your party');
				},
			whisp(target, ...message) {
				mod.send('C_WHISPER', 1, {target: target,message: message.join(' ')})
				},
			guild(...message) {
				mod.send('C_CHAT', 1, {channel: 2,message: message.join(' ')})
				},
			party(...message) {
				mod.send('C_CHAT', 1, {channel: 1,message: message.join(' ')})
				},
			trade(...message) {
				mod.send('C_CHAT', 1, {channel: 4,message: message.join(' ')})
				},							
			global(...message) {
				mod.send('C_CHAT', 1, {channel: 27,message: message.join(' ')})
				},	
			say(...message) {						
				mod.send('C_CHAT', 1, {channel: 0,message: message.join(' ')})
				},
			inv(target) {
				mod.send('C_REQUEST_CONTRACT', 1, { 
					target: target,
					type: 4,
					name: target,
					data: dataArray
				})
					mod.log(target+" "+'invited');
				},
			drop() {
				mod.send('C_LEAVE_PARTY', 1, {})
				mod.log('Left Group');
				},
			disband() {
				mod.send('C_DISMISS_PARTY', 1, {});
				mod.log('Group disbanded')
				},
			add(target, ...message) {
				mod.send('C_ADD_FRIEND', 1, {
					name: target,
					message: message.join(' ')
				})
					mod.log(target+" "+'added');	
				}
				

	})
//=====================Hooks==========================	

	//whisper incoming better overview soon tm 
	mod.hook('S_WHISPER', 3, (event) => {
		mod.log(('[')+(ownname)+(']')+('Whisper from')+ " " +('[')+(event.name)+(']')+ " " +('[')+('Message')+(']:')+ " " +stripOuterHTML(event.message))	
	})

	mod.hook('S_CHAT',3 , (event) => {
		if((event.channel) === 2){mod.log('[Guild] '+event.name+ " "+ stripOuterHTML(event.message) )}	
		else if ((event.channel) === 1){mod.log('[Party] '+event.name+ " "+ stripOuterHTML(event.message)) }
		else if ((event.channel) === 213){mod.log('[Megaphone] '+event.name+ " "+ stripOuterHTML(event.message)) }
		else if ((event.channel) === 0){mod.log('[Say] '+event.name+ " "+ stripOuterHTML(event.message)) }
		else if ((event.channel) === 4){mod.log('[Trade] '+event.name+ " "+ stripOuterHTML(event.message)) }
		else if ((event.channel) === 27){mod.log('[Global] '+event.name+ " "+ stripOuterHTML(event.message)) }
	})
	//get char name
	mod.hook('S_LOGIN',14, (event) => { ownname = event.name, gameId = event.gameId;})
			
	//message stuff from SYSTEM Message SMT_GENERAL_NOT_IN_THE_WORLD = offline or wrong name / SMT_BANLIST_CANT_CONTRACT_YOUR_SMH = blocked by this person 
	mod.hook('S_SYSTEM_MESSAGE',1 , (event) => {
		if(mod.parseSystemMessage(event.message).id === 'SMT_GENERAL_NOT_IN_THE_WORLD'){mod.log('Player is offline or wrong name')}	
		else if(mod.parseSystemMessage(event.message).id === 'SMT_BANLIST_CANT_CONTRACT_YOUR_SMH'){mod.log('Player has blocked you')} 
	})
//=====================Functions==========================
	
function stripOuterHTML(str) {
		return str.replace(/^<[^>]+>|<\/[^>]+><[^\/][^>]*>|<\/[^>]+>$/g, '')
}

}
