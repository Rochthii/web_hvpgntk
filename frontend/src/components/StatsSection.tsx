import React from 'react';

interface StatCardProps {
    number: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
    return (
        <div
            className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{
                background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF3E0 100%)',
                border: '3px solid #D4AF37',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}
        >
            <div
                style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: '#FFA726',
                    fontFamily: '"Noto Serif Khmer", "Merriweather", Georgia, serif',
                    lineHeight: 1,
                    marginBottom: '0.75rem',
                    textShadow: '2px 2px 4px rgba(255, 167, 38, 0.3)'
                }}
            >
                {number}
            </div>
            <div
                style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#5D4037',
                    letterSpacing: '0.02em'
                }}
            >
                {label}
            </div>
        </div>
    );
};

const StatsSection: React.FC = () => {
    return (
        <section className="px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard number="1992" label="Năm thành lập" />
                    <StatCard number="150+" label="Tăng tín đồ" />
                    <StatCard number="30+" label="Khóa học" />
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
