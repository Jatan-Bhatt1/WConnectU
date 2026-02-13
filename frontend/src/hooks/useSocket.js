
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5173'; // Update if your backend runs elsewhere

export default function useSocket() {
	const socketRef = useRef(null);

	useEffect(() => {
		// Create socket connectionz
		socketRef.current = io(SOCKET_URL, {
			withCredentials: true,
		});

		// Cleanup on unmount
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	return socketRef.current;
}
