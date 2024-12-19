import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = ({ leadId, onClose, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Connect to socket
        socket.connect();

        // Join the chat room
        socket.emit('joinRoom', { 
            roomId: leadId,
            userId: currentUserId 
        });

        // Connection status handlers
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        // Message handlers
        socket.on('receiveMessage', (newMessage) => {
            setMessages(prevMessages => [...prevMessages, {
                ...newMessage,
                timestamp: new Date(newMessage.timestamp),
                status: 'received'
            }]);
        });

        // Typing indicators
        socket.on('userTyping', (userId) => {
            if (userId !== currentUserId) {
                setIsTyping(true);
                // Clear typing indicator after 2 seconds
                setTimeout(() => setIsTyping(false), 2000);
            }
        });

        // Error handler
        socket.on('error', (error) => {
            console.error('Socket error:', error);
            // You could add UI feedback here
        });

        // Load previous messages
        const loadPreviousMessages = async () => {
            try {
                const response = await fetch(`/api/messages/${leadId}`);
                const data = await response.json();
                setMessages(data.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                    status: 'received'
                })));
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        loadPreviousMessages();

        // Cleanup
        return () => {
            socket.emit('leaveRoom', { roomId: leadId, userId: currentUserId });
            socket.off('connect');
            socket.off('disconnect');
            socket.off('receiveMessage');
            socket.off('userTyping');
            socket.off('error');
            socket.disconnect();
        };
    }, [leadId, currentUserId]);

    // Scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTyping = () => {
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Emit typing event
        socket.emit('typing', { roomId: leadId, userId: currentUserId });

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stopTyping', { roomId: leadId, userId: currentUserId });
        }, 1000);
    };

    const sendMessage = () => {
        if (!message.trim() || !isConnected) return;

        const newMessage = {
            content: message.trim(),
            senderId: currentUserId,
            timestamp: new Date(),
            roomId: leadId
        };

        // Optimistically add message to UI
        setMessages(prevMessages => [...prevMessages, {
            ...newMessage,
            status: 'sending'
        }]);

        // Emit message
        socket.emit('sendMessage', newMessage, (acknowledgement) => {
            if (acknowledgement.error) {
                // Handle error - update message status
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.timestamp === newMessage.timestamp
                            ? { ...msg, status: 'error' }
                            : msg
                    )
                );
            } else {
                // Update message status to sent
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.timestamp === newMessage.timestamp
                            ? { ...msg, status: 'sent' }
                            : msg
                    )
                );
            }
        });

        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date) => {
        return new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Chat</h2>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto border border-gray-300 p-2 mb-4 rounded">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 mb-2 rounded max-w-[80%] ${
                                msg.senderId === currentUserId
                                    ? 'ml-auto bg-blue-500 text-white'
                                    : 'bg-gray-100'
                            }`}
                        >
                            <div className="break-words">{msg.content}</div>
                            <div className={`text-xs mt-1 ${
                                msg.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                                {formatTime(msg.timestamp)}
                                {msg.senderId === currentUserId && (
                                    <span className="ml-2">
                                        {msg.status === 'sending' && '⋯'}
                                        {msg.status === 'sent' && '✓'}
                                        {msg.status === 'error' && '!'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="text-gray-500 text-sm">Someone is typing...</div>
                    )}
                    <div ref={messageEndRef} />
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            handleTyping();
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder={isConnected ? "Type your message..." : "Connecting..."}
                        disabled={!isConnected}
                        className="border border-gray-300 rounded flex-1 p-2"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!isConnected || !message.trim()}
                        className={`px-4 py-2 rounded text-white ${
                            isConnected && message.trim()
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-300'
                        }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;