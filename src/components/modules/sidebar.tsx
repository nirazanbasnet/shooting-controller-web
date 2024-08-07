import React from 'react';
import { Button } from '@/components/ui/button';

type ActionType = 'slow' | 'size' | 'shield' | 'hit';

interface User {
    username: string;
    userType: string;
}

interface SidebarProps {
    onActionClick: (action: ActionType) => void;
    activeAction: ActionType;
    cooldowns: Record<ActionType, boolean>;
    user: User
}

export default function Sidebar({ onActionClick, activeAction, cooldowns, user }: SidebarProps) {
    const handleActionClick = (action: ActionType) => {
        if (!cooldowns[action]) {
            onActionClick(action);
        } else {
            // Vibration effect
            const button = document.getElementById(`button-${action}`);
            if (button) {
                button.classList.add('vibrate');
                setTimeout(() => button.classList.remove('vibrate'), 500);
            }
        }
    };

    const actions: ActionType[] = user.userType === 'Batman' ? ['hit'] : ['slow', 'size', 'shield'];
    const jokerAvatar = './joker-logo.png';
    const batmanAvatar = './batman-logo.png';

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <div className="w-[100px] bg-white p-4 flex flex-col items-center">
            <div>
                <div className="flex items-center justify-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={user.userType === 'Joker' ? jokerAvatar : batmanAvatar}
                        alt="User Avatar"
                        className="size-16"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://avatars.dicebear.com/api/avataaars/fallback.svg'; // Fallback avatar
                        }}
                    />
                </div>
                <div className="mb-2 text-center">
                    <p className="text-xs font-semibold break-all">{user.username}</p>
                    <p className="text-xs text-gray-600">{user.userType}</p>
                </div>
            </div>
            <div className="flex-1">
                {actions.map((action) => (
                    <div key={action} className="mb-4 relative">
                        <Button
                            id={`button-${action}`}
                            onClick={() => handleActionClick(action)}
                            disabled={cooldowns[action]}
                            className={`w-16 h-16 rounded-full block !p-0 
                            ${activeAction === action ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`
                            }
                        >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                        </Button>
                        {cooldowns[action] && (
                            <div className="absolute size-16 inset-0 rounded-full border-4 border-blue-500 animate-progress"/>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-sm text-slate-500 cursor-pointer" onClick={handleLogout}>Logout</div>
        </div>
    );
}
