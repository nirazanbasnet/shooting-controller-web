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
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('lastUsername', currentUser.username);
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <div className="bg-white py-4 flex flex-col items-center">
            <div className="mb-2 text-center">
                <p className="text-xs font-semibold break-all">{user.username}</p>
                <p className="text-xs text-gray-600">{user.userType}</p>
            </div>
            <div className="flex-1 mt-4">
                {actions.map((action) => (
                    <div key={action} className="relative">
                        <Button
                            id={`button-${action}`}
                            onClick={() => handleActionClick(action)}
                            disabled={cooldowns[action]}
                            className={`w-16 h-16 rounded-none block !p-0 
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
