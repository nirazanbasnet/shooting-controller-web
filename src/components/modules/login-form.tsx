import React, {useEffect, useState} from 'react';
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

    useEffect(() => {
        const lastUsername = localStorage.getItem('lastUsername');
        if (lastUsername) {
            setUsername(lastUsername);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(username, userType);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-5">
            <form onSubmit={handleSubmit} className="w-80 bg-white border border-gray-100 p-2 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-lg font-semibold mb-2 text-center text-slate-400">Login</h1>
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="mb-4"
                />
                <div className="mb-4">
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
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/batman-logo.png" alt="Batman" className="w-20 h-20 mb-2"/>
                                <span className="block text-center">Batman</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button type="submit" className="w-full bg-slate-900 text-white">
                    Start Game
                </Button>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            </form>
        </div>
    );
}
