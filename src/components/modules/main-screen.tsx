import React, { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from "@/lib/utils";

interface MainScreenProps {
    onScreenClick: (x: number, y: number, action?: string) => void;
    activeAction: string;
    isInCooldown: boolean;
    userType: string;
}

interface Ripple {
    x: number;
    y: number;
    size: number;
}

export default function MainScreen({ onScreenClick, activeAction, isInCooldown, userType }: MainScreenProps) {
    const [lastClick, setLastClick] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const mainScreenRef = useRef<HTMLDivElement>(null);

    const handleClick = useCallback(
        debounce((e: React.MouseEvent<HTMLDivElement>) => {
            if (mainScreenRef.current && (userType === 'Batman' || !isInCooldown)) {
                const rect = mainScreenRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setLastClick({ x, y });
                onScreenClick(x, y, userType === 'Batman' ? undefined : activeAction);
                // Add ripple effect
                setRipples(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, size: 0 }]);
            }
        }, 100),
        [onScreenClick, activeAction, isInCooldown, userType]
    );

    useEffect(() => {
        let animationFrame: number;
        const animateRipples = () => {
            setRipples(prev =>
                prev.map(ripple => ({
                    ...ripple,
                    size: ripple.size + 5,
                })).filter(ripple => ripple.size < 100)
            );
            animationFrame = requestAnimationFrame(animateRipples);
        };
        animationFrame = requestAnimationFrame(animateRipples);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    const jokerAvatar = './joker-logo.png';
    const batmanAvatar = './batman-logo.png';

    return (
        <div
            ref={mainScreenRef}
            className={`flex-1 bg-gray-100 relative overflow-hidden ${userType === 'Batman' || !isInCooldown ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={handleClick}
        >
            {ripples.map((ripple, index) => (
                <div
                    key={index}
                    className="absolute rounded-full bg-white opacity-50"
                    style={{
                        left: ripple.x - ripple.size / 2,
                        top: ripple.y - ripple.size / 2,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}

            <div className="absolute inset-0 z-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={userType === 'Joker' ? jokerAvatar : batmanAvatar} alt="User Avatar" className="size-56 opacity-10"/>
            </div>
        </div>
    );
}
