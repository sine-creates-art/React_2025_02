import './CalculatorDisplay.css';
import React from 'react';

interface CalculatorDisplayProps {
    value: number;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value }: CalculatorDisplayProps): JSX.Element => {
    return (<>
        <link href='https://fonts.googleapis.com/css?family=Roboto Mono' rel='stylesheet'></link>
        <div className="calculator-display">
            {value}
        </div>
    </>);
};

export default CalculatorDisplay;