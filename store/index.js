export const APP_STORE = {
	state: {
		serverIp: 'https://chrisrobinserv.site:3030',
		socket: require('socket.io-client')('https://chrisrobinserv.site:3000'),
		email: '',
		name: '',
		role: '',
		banned: '',
		ban_time: [],
		reason: '',
		images: [],
		SessionID: '',
		user_id: '',
		check_text: function(text, size){
			let re = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890~`!@"#№$;%^:&?*()_-=+{};,./<>| ' + "'"
			let text_to_send = ''
			for(let i = 0; i < text.length; i++){
				if(re.lastIndexOf(text[i]) != -1){
					text_to_send += text[i]
				}
			}
			return text_to_send.slice(0, size)
		}
	},
	mutations: {
		GET_USER_EMAIL(state, value) {
			state.email = value;
		},
		GET_USER_SESSIONID(state, value){
			state.SessionID = value;
		},
	},
	getters: {
		email: (state) => state.email,
		SessionID: (state) => state.SessionID,
	},
};