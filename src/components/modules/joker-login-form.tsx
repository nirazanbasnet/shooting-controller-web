import React, {useEffect, useState} from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
    onSubmit: (username: string, userType: string) => void;
    error: string;
}

export default function JokerLoginForm({ onSubmit, error }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('Joker');

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
        <div className="flex flex-col items-center justify-center h-screen py-5">
            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-5 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="mb-6"
                />
                <div className="mb-6">
                    <Label className="mb-3 block text-center">Choose your team:</Label>
                    <RadioGroup
                        defaultValue="Batman"
                        onValueChange={setUserType}
                        className="flex justify-center space-x-4"
                    >
                        <div className="flex flex-col items-center">
                            <RadioGroupItem value="Joker" id="Joker" className="sr-only"/>
                            <Label
                                htmlFor="Joker"
                                className={`cursor-pointer p-4 rounded-lg border-2 ${userType === 'Joker' ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
                            >
                                <img src="/joker-logo.png" alt="Joker" className="w-20 h-20 mb-2"/>
                                <span className="block text-center">Joker</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button type="submit" className="w-full bg-slate-900 text-white">
                    Start Game
                </Button>
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </form>
        </div>
    );
}
