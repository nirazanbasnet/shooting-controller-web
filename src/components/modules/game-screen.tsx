import { useState } from 'react';
import Sidebar from "@/components/modules/sidebar";
import MainScreen from "@/components/modules/main-screen";

interface User {
    username: string;
    userType: string;
}

interface GameScreenProps {
    user: User;
}

type Action = 'slow' | 'size' | 'shield' | 'hit';

export default function GameScreen({ user }: GameScreenProps) {
    const [activeAction, setActiveAction] = useState<Action>(user.userType === 'Batman' ? 'hit' : 'slow');
    const [cooldowns, setCooldowns] = useState<Record<Action, boolean>>({
        slow: false,
        size: false,
        shield: false,
        hit: false,
    });
    const [isInCooldown, setIsInCooldown] = useState(false);

    const handleActionClick = (action: Action) => {
        setActiveAction(action);
    };

    const handleScreenClick = (xPos: number, yPos: number) => {
        if (!isInCooldown) {
            console.log('Click data:', { xPos, yPos, action: activeAction });
            // Here you would send the data to your server

            // Start cooldown
            setIsInCooldown(true);
            setCooldowns(prev => ({ ...prev, [activeAction]: true }));

            // Cooldown timer
            setTimeout(() => {
                setIsInCooldown(false);
                setCooldowns(prev => ({ ...prev, [activeAction]: false }));
            }, 500); // 0.5 seconds cooldown
        } else {
            console.log('Action in cooldown, click ignored');
        }
    };

    return (
        <div className="h-full">
            <div className="flex flex-1 h-full">
                <Sidebar
                    onActionClick={handleActionClick}
                    activeAction={activeAction}
                    cooldowns={cooldowns}
                    user={user}
                />
                <MainScreen
                    onScreenClick={handleScreenClick}
                    activeAction={activeAction}
                    isInCooldown={isInCooldown}
                    userType={user.userType}
                />
            </div>
        </div>
    );
}
