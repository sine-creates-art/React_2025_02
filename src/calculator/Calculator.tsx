import React, { useState } from 'react';
import CalculatorDisplay from './calculator-display/CalculatorDisplay';

interface CalculatorProps {

}

const Calculator: React.FC<CalculatorProps> = (): JSX.Element => {
    const [value, setValue] = useState(1234567890);

    return (<>
        <div className="calculator">
            <CalculatorDisplay value={value}/>
        </div>
    </>);
}

export default Calculator;