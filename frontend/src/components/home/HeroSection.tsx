import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useParallax } from '../../utils/animations';

interface HeroSectionProps {
    siteName: string;
    siteSlogan: string;
    backgroundImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ siteName, siteSlogan, backgroundImage }) => {
    const bgImage = backgroundImage || '/images/CHANHDIENTRANGCHU.png';
    const parallaxOffset = useParallax(0.4);

    return (
        <section className="relative h-[460px] flex items-center justify-center overflow-hidden">
            {/* Parallax Background */}
            <div
                className="absolute inset-0 bg-cover bg-center brightness-[1.02] contrast-105"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    transform: `translateY(${parallaxOffset}px)`
                }}
            />

            {/* Animated Gradient Overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/30 animate-gradient-shift"
                style={{ backgroundSize: '200% 200%' }}
            />

            {/* Decorative Element: Subtle ornament */}
            <div className="absolute top-10 right-10 opacity-10 animate-spin-slow pointer-events-none hidden md:block">
                <div className="w-24 h-24 rounded-full border-4 border-gold-500" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-[880px] px-8 animate-fade-in-up">
                <h1 className="text-[2.625rem] font-extrabold 
                               bg-clip-text text-transparent bg-gradient-to-r from-[#FFAE00] via-[#FFFDD0] to-[#FFAE00]
                               filter drop-shadow-[0_5px_5px_rgba(0,0,0,1)]
                               mb-[1.125rem] tracking-[0.05em] leading-[1.4] 
                               font-heading animate-glow">
                    {siteName.toUpperCase()}
                </h1>

                <p className="text-[0.9375rem] text-white mb-[2rem] 
                              text-shadow-md font-medium opacity-95 tracking-wide">
                    {siteSlogan}
                </p>


            </div>
        </section>
    );
};
