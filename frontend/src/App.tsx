import React from 'react';
import TemperatureChart from './TemperatureChart';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Temperature Monitoring System</h1>
            </header>
            <main>
                <TemperatureChart />
            </main>
        </div>
    );
};

export default App;