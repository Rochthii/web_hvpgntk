import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

interface HeroSectionProps {
    siteName: string;
    siteSlogan: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ siteName, siteSlogan }) => {
    return (
        <section className="relative h-[460px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-100 brightness-[1.02] contrast-105"
                style={{ backgroundImage: 'url(/images/temple-hero.jpg)' }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-secondary/40" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-[880px] px-8 animate-fade-in-up">
                <h1 className="text-[2.625rem] font-extrabold text-[#FFD700] drop-shadow-[0_4px_8px_rgba(0,0,0,1)] mb-[1.125rem] tracking-[0.05em] leading-[1.4] font-heading">
                    {siteName.toUpperCase()}
                </h1>

                <p className="text-[0.9375rem] text-white mb-[2rem] text-shadow-md font-medium opacity-95 tracking-wide">
                    {siteSlogan}
                </p>


            </div>
        </section>
    );
};
