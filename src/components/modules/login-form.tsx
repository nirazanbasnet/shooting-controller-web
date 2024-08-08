import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
    onSubmit: (username: string, userType: string) => void;
    error: string;
}

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('Batman');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [wsError, setWsError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);

    useEffect(() => {
        const lastUsername = localStorage.getItem('lastUsername');
        if (lastUsername) {
            setUsername(lastUsername);
        }
    }, []);

    useEffect(() => {
        let ws: WebSocket;

        const connectWebSocket = () => {
            const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://192.168.0.113:8080/ws';
            ws = new WebSocket(wsUrl);
            setSocket(ws);
            setWsError(null); // Reset error state on new connection attempt

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setWsError('Failed to connect to game server. Please try again.');
            };

            ws.onclose = (event) => {
                if (!event.wasClean) {
                    console.error('WebSocket connection closed unexpectedly');
                    setWsError('Connection to game server lost. Please refresh the page.');
                }
            };

            ws.onopen = () => {
                console.log('WebSocket connection established');
                setWsError(null); // Clear any previous errors on successful connection
            };
        };

        connectWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.length > 8) {
            setUsernameError('Username should be less than 8 characters');
            return;
        }
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                user: username,
                type: "connect",
                message: userType === 'Batman' ? 'goodguys' : 'badguys'
            });
            socket.send(message);
            onSubmit(username, userType);
        } else {
            setWsError('Not connected to game server. Please try again.');
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (e.target.value.length <= 8) {
            setUsernameError(null);
        } else {
            setUsernameError('Username should be less than 8 characters');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen py-4">
            <form onSubmit={handleSubmit}
                  className="w-96 bg-white border border-gray-100 p-5 rounded-lg shadow-md max-w-md">
                <h1 className="text-lg font-semibold mb-4 text-center">Login</h1>
                <div className="mb-6">
                    <Input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter your username (max 8 characters)"
                        className={`${usernameError ? 'border-red-500' : ''}`}
                    />
                    {usernameError && <p className="text-red-500 mt-1 text-sm">{usernameError}</p>}
                </div>
                <div className="mb-6">
                    <Label className="mb-3 block text-center">Choose your team:</Label>
                    <RadioGroup
                        defaultValue="Batman"
                        onValueChange={setUserType}
                        className="flex justify-center space-x-4"
                    >
                        <div className="flex flex-col items-center">
                            <RadioGroupItem value="Batman" id="Batman" className="sr-only"/>
                            <Label
                                htmlFor="Batman"
                                className={`cursor-pointer p-4 rounded-lg border-2 ${userType === 'Batman' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
                            >
                                <img src="/batman-logo.png" alt="Batman" className="w-20 h-20 mb-2"/>
                                <span className="block text-center">Batman</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button type="submit" className="w-full bg-slate-900 text-white">
                    Start Game
                </Button>
                {(error || wsError) && <p className="text-red-500 mt-1 text-xs text-center">{error || wsError}</p>}
            </form>
        </div>
    );
}
