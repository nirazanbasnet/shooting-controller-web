
import { useState, useEffect } from 'react';
import Sidebar from "@/components/modules/sidebar";
import MainScreen from "@/components/modules/main-screen";

interface User {
    username: string;
    userType: string;
}

interface GameScreenProps {
    user: User;
}

type Action = 'speed' | 'size' | 'shield' | 'hit';

export default function GameScreen({ user }: GameScreenProps) {
    const [activeAction, setActiveAction] = useState<Action>(user.userType === 'Batman' ? 'hit' : 'speed');
    const [cooldowns, setCooldowns] = useState<Record<Action, boolean>>({
        speed: false,
        size: false,
        shield: false,
        hit: false,
    });
    const [isInCooldown, setIsInCooldown] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://192.168.0.113:8080/ws';
        const ws = new WebSocket(wsUrl);
        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    useEffect(() => {
        const updateDocumentHeight = () => {
            const doc = document.documentElement
            doc.style.setProperty("--doc-height", `${window.innerHeight}px`)
        }

        window.addEventListener("resize", updateDocumentHeight)
        updateDocumentHeight()

        return () => { window.removeEventListener("resize", updateDocumentHeight) }
    }, [])

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
                    username={user.username}
                    socket={socket}
                />
            </div>
        </div>
    );
}
