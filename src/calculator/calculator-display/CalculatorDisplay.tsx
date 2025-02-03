import './CalculatorDisplay.css';
import React from 'react';

interface CalculatorDisplayProps {
    sign?: boolean;
    value: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ sign = true, value }: CalculatorDisplayProps): JSX.Element => {
    return (<>
        <link href='https://fonts.googleapis.com/css?family=Roboto Mono' rel='stylesheet'></link>
        <div className="calculator-display">
            {!sign && '-'}{value}
        </div>
    </>);
};

export default CalculatorDisplay;