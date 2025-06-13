import React from 'react';
import TemperatureChart from './TemperatureChart';
import AskPanel from './AskPanel';

const App: React.FC = () => {
    return (
        <div
            style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                maxWidth: 1200,
                margin: '2rem auto',
                padding: '0 1rem',
                color: '#333',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <header
                style={{
                    backgroundColor: '#005f73',
                    padding: '1rem',
                    borderRadius: 8,
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    flex: '0 0 auto',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    fontWeight: 700,
                }}
            >
                Temperature Monitoring System
            </header>

            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    gap: '1.5rem',
                    marginTop: '1rem',
                    overflow: 'hidden', // 避免滚动条横向溢出
                }}
            >
                <section style={{ flex: 2, minHeight: 0, overflowY: 'auto' }}>
                    <TemperatureChart />
                </section>
                <section
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        backgroundColor: '#f0f4f8',
                        padding: '1rem',
                        borderRadius: 8,
                        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <AskPanel />
                </section>
            </main>
        </div>
    );
};

export default App;
