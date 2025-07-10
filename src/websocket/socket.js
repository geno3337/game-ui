import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS(process.env.REACT_APP_API_URL +'/ws');
const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => {
        console.log(str);
    },
});

export default stompClient;
