import React, { useReducer } from 'react';
//import CalculatorDisplay from './calculator-display/CalculatorDisplay';
import './calculator-display/CalculatorDisplay.css';

interface CalculatorProps {

}


/* calculator actions */
enum CalculatorActionType {
    META_OPERATION = 'META_OPERATION',
    UNARY_OPERATION = 'UNARY_OPERATION',
    BINARY_OPERATION = 'BINARY_OPERATION',
}

enum MetaOperationType {
    NONE = 'NONE',
    CLEAR_ALL = 'CLEAR_ALL',
    CLEAR_ENTRY = 'CLEAR_ENTRY',
    SWAP = 'SWAP',
    TOGGLE_SIGN = 'TOGGLE_SIGN',
    PUSH_DIGIT = 'PUSH_DIGIT',
    PUSH_DECIMAL_POINT = 'PUSH_DECIMAL_POINT',
    POP_CHAR = 'POP_CHAR',
    CHANGE_BINARY_OPERATION = 'CHANGE_BINARY_OPERATION',
    EVALUATE = 'EVALUATE',
}

enum UnaryOperationType {
    NONE = 'NONE',
    INVERSION = 'INVERSION',
    SQUARE = 'SQUARE',
    SQUARE_ROOT = 'SQUARE_ROOT',
    NATURAL_EXPONENTIATION = 'NATURAL_EXPONENTIATION',
    NATURAL_LOGARITHM = 'NATURAL_LOGARITHM',
    BASE10_EXPONENTIATION = 'BASE10_EXPONENTIATION',
    BASE10_LOGARITHM = 'BASE10_LOGARITHM',
    TRIG_SINE = 'TRIG_SINE',
    TRIG_ARCSINE = 'TRIG_ARCSINE',
    TRIG_COSINE = 'TRIG_COSINE',
    TRIG_ARCCOSINE = 'TRIG_ARCCOSINE',
    TRIG_TANGENT = 'TRIG_TANGENT',
    TRIG_ARCTANGENT = 'TRIG_ARCTANGENT',
    TRIG_COSECANT = 'TRIG_COSECANT',
    TRIG_ARCCOSECANT = 'TRIG_ARCCOSECANT',
    TRIG_SECANT = 'TRIG_SECANT',
    TRIG_ARCSECANT = 'TRIG_ARCSECANT',
    TRIG_COTANGENT = 'TRIG_COTANGENT',
    TRIG_ARCCOTANGENT = 'TRIG_ARCCOTANGENT',
}

enum BinaryOperationType {
    NONE = 'NONE',
    ADDITION = 'ADDITION',
    SUBTRACTION = 'SUBTRACTION',
    MULTIPLICATION = 'MULTIPLICATION',
    DIVISION = 'DIVISION',
    POWER = 'POWER',
    LOGARITHM = 'LOGARITHM',
    MODULO = 'MODULO',
}


/* calculator state */
interface CalculatorValueAsNumber {
    value: number;
}

const defaultCalculatorValueAsNumber: CalculatorValueAsNumber = {
    value: 0,
}

interface CalculatorValueAsString {
    sign: boolean;
    magnitude: string;
}

const defaultCalculatorValueAsString: CalculatorValueAsString = {
    sign: true,
    magnitude: '0',
}

interface CalculatorState {
    stored: CalculatorValueAsNumber;
    current: CalculatorValueAsString;
    binaryOperationType: BinaryOperationType;
}

const defaultCalculatorState: CalculatorState = {
    stored: defaultCalculatorValueAsNumber,
    current: defaultCalculatorValueAsString,
    binaryOperationType: BinaryOperationType.NONE,
}

function getCalculatorStateAsNumber(state: CalculatorValueAsString): CalculatorValueAsNumber {
    return state.sign ? {value: Number(state.magnitude)} : {value: -Number(state.magnitude)};
}

function getCalculatorStateAsString(state: CalculatorValueAsNumber): CalculatorValueAsString {
    return {sign: (state.value >= 0), magnitude: Math.abs(state.value).toString()};
}

function isCalculatorStateValid(state: CalculatorState): boolean {
    const storedValue: number = state.stored.value;
    const currentValue: number = getCalculatorStateAsNumber(state.current).value;
    return isFinite(storedValue) && isFinite(currentValue);
}


/* dispatch */
interface CalculatorAction {
    actionType: CalculatorActionType;
    metaOperationType?: MetaOperationType;
    metaOperationData?: number | BinaryOperationType;
    unaryOperationType?: UnaryOperationType;
    binaryOperationType?: BinaryOperationType;
}

function handleMetaOperation(state: CalculatorState, type: MetaOperationType, data: number | BinaryOperationType = 0): CalculatorState {
    var newState = {...state};
    switch (type) {
        case MetaOperationType.CLEAR_ALL:
            newState = {
                ...newState, 
                stored: defaultCalculatorValueAsNumber, 
                current: defaultCalculatorValueAsString, 
                binaryOperationType: BinaryOperationType.NONE
            };
            break;
        case MetaOperationType.CLEAR_ENTRY:
            newState = {
                ...newState, 
                current: defaultCalculatorValueAsString, 
                binaryOperationType: BinaryOperationType.NONE};
            break;
        case MetaOperationType.SWAP:
            newState = {
                ...newState, 
                stored: getCalculatorStateAsNumber(newState.current), 
                current: getCalculatorStateAsString(newState.stored)
            };
            break;
        case MetaOperationType.TOGGLE_SIGN:
            newState.current = {
                ...newState.current, 
                sign: !newState.current.sign
            };
            break;
        case MetaOperationType.PUSH_DIGIT:
            if (newState.current.magnitude === '0') {
                newState.current = {
                    ...newState.current, 
                    magnitude: data.toString()
                };
            } else {
                newState.current = {
                    ...newState.current, 
                    magnitude: newState.current.magnitude.concat(data.toString())
                };
            }
            break;
        case MetaOperationType.PUSH_DECIMAL_POINT:
            if (newState.current.magnitude.split('.').length === 1) {
                newState.current = {
                    ...newState.current, 
                    magnitude: newState.current.magnitude.toString().concat('.')
                };
            }
            break;
        case MetaOperationType.POP_CHAR:
            if (newState.current.magnitude.length === 1) {
                newState.current = defaultCalculatorValueAsString;
            } else {
                newState.current = {
                    ...newState.current, 
                    magnitude: newState.current.magnitude.slice(0,-1)
                };
            }
            break;
        case MetaOperationType.CHANGE_BINARY_OPERATION:
            if (Object.values(BinaryOperationType).includes(data as BinaryOperationType)) {
                newState = {
                    ...newState, 
                    binaryOperationType: data as BinaryOperationType};
            }
            break;
        case MetaOperationType.EVALUATE:
            newState = handleBinaryOperation(newState);
            break;
    }
    return newState;
}

function handleUnaryOperation(state: CalculatorState, type: UnaryOperationType): CalculatorState {
    var newState = {...state};
    const currentValue: number = getCalculatorStateAsNumber(newState.current).value;
    var newValue: number = currentValue;
    switch (type) {
        case UnaryOperationType.INVERSION:
            newValue = 1 / currentValue;
            break;
        case UnaryOperationType.SQUARE:
            newValue = currentValue * currentValue;
            break;
        case UnaryOperationType.SQUARE_ROOT:
            newValue = Math.sqrt(currentValue);
            break;
        case UnaryOperationType.NATURAL_EXPONENTIATION:
            newValue = Math.exp(currentValue);
            break;
        case UnaryOperationType.NATURAL_LOGARITHM:
            newValue = Math.log(currentValue);
            break;
        case UnaryOperationType.BASE10_EXPONENTIATION:
            newValue = Math.pow(10, currentValue);
            break;
        case UnaryOperationType.BASE10_LOGARITHM:
            newValue = Math.log10(currentValue);
            break;
        case UnaryOperationType.TRIG_SINE:
            newValue = Math.sin(currentValue);
            break;
        case UnaryOperationType.TRIG_ARCSINE:
            newValue = Math.asin(currentValue);
            break;
        case UnaryOperationType.TRIG_COSINE:
            newValue = Math.cos(currentValue);
            break;
        case UnaryOperationType.TRIG_ARCCOSINE:
            newValue = Math.acos(currentValue);
            break;
        case UnaryOperationType.TRIG_TANGENT:
            newValue = Math.tan(currentValue);
            break;
        case UnaryOperationType.TRIG_ARCTANGENT:
            newValue = Math.atan(currentValue);
            break;
        case UnaryOperationType.TRIG_COSECANT:
            newValue = 1/Math.sin(currentValue);
            break;
        case UnaryOperationType.TRIG_ARCCOSECANT:
            newValue = Math.asin(1 / currentValue);
            break;
        case UnaryOperationType.TRIG_SECANT:
            newValue = 1/Math.cos(currentValue);
            break;
        case UnaryOperationType.TRIG_ARCSECANT:
            newValue = Math.acos(1 / currentValue);
            break;
        case UnaryOperationType.TRIG_COTANGENT:
            newValue = 1/Math.tan(currentValue);
            break;
        case UnaryOperationType.TRIG_ARCCOTANGENT:
            newValue = Math.atan(1 / currentValue);
            break;
    }
    newState = {
        ...newState, 
        current: getCalculatorStateAsString( {value: newValue} ), 
    };
    return newState;
}

function handleBinaryOperation(state: CalculatorState): CalculatorState {
    var newState = {...state};
    const storedValue: number = newState.stored.value;
    const currentValue: number = getCalculatorStateAsNumber(newState.current).value;
    var newValue: number = currentValue;
    switch (newState.binaryOperationType) {
        case BinaryOperationType.ADDITION:
            newValue = storedValue + currentValue;
            break;
        case BinaryOperationType.SUBTRACTION:
            newValue = storedValue - currentValue;
            break;
        case BinaryOperationType.MULTIPLICATION:
            newValue = storedValue * currentValue;
            break;
        case BinaryOperationType.DIVISION:
            newValue = storedValue / currentValue;
            break;
        case BinaryOperationType.POWER:
            newValue = Math.pow(storedValue, currentValue);
            break;
        case BinaryOperationType.LOGARITHM:
            newValue = Math.log(storedValue) / Math.log(currentValue);
            break;
        case BinaryOperationType.MODULO:
            newValue = storedValue % currentValue;
            break;
    }
    newState = {
        ...newState, 
        stored: {...newState.stored, value: newValue}, 
        current: defaultCalculatorValueAsString, 
        binaryOperationType: BinaryOperationType.NONE,
    };
    return newState;
}

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
    const { actionType, metaOperationType = MetaOperationType.NONE, metaOperationData = 0, unaryOperationType = UnaryOperationType.NONE } = action;
    var newState = {...state};
    
    switch (actionType) {
        case CalculatorActionType.META_OPERATION:
            newState = handleMetaOperation(state, metaOperationType, metaOperationData);
            break;
        case CalculatorActionType.UNARY_OPERATION:
            newState = handleUnaryOperation(state, unaryOperationType);
            break;
        case CalculatorActionType.BINARY_OPERATION:
            newState = handleBinaryOperation(state);
            break;
    }

    return newState;
}

function operationSymbol(type: BinaryOperationType): string {
    switch (type) {
        case BinaryOperationType.ADDITION:
            return '+';
        case BinaryOperationType.SUBTRACTION:
            return '-';
        case BinaryOperationType.MULTIPLICATION:
            return '*';
        case BinaryOperationType.DIVISION:
            return '/';
        case BinaryOperationType.POWER:
            return '^';
        case BinaryOperationType.LOGARITHM:
            return '_';
        case BinaryOperationType.MODULO:
            return '%';
    }
    return '=';
}

const Calculator: React.FC<CalculatorProps> = (): JSX.Element => {
    const [state, dispatch] = useReducer(calculatorReducer, defaultCalculatorState);

    const isStateValid: boolean = isCalculatorStateValid(state);

    function handleClickMetaOperation( metaOperationType: MetaOperationType ) {
        dispatch({actionType: CalculatorActionType.META_OPERATION, metaOperationType: metaOperationType});
    }

    function handleClickUnaryOperation( unaryOperationType: UnaryOperationType ) {
        dispatch({actionType: CalculatorActionType.UNARY_OPERATION, unaryOperationType: unaryOperationType});
    }

    function handleClickChangeBinaryOperation( type: BinaryOperationType ) {
        dispatch({actionType: CalculatorActionType.META_OPERATION, metaOperationType: MetaOperationType.CHANGE_BINARY_OPERATION, metaOperationData: type});
    }

    function handleClickPushDigit( value: number ) {
        dispatch({actionType: CalculatorActionType.META_OPERATION, metaOperationType: MetaOperationType.PUSH_DIGIT, metaOperationData: value});
    }

    return (<>
        <link href='https://fonts.googleapis.com/css?family=Roboto Mono' rel='stylesheet'></link>
        
        <div className="calculator">
            <div className="calculator-display">
                {state.stored.value} {operationSymbol(state.binaryOperationType)}
            </div>
            <div className="calculator-display">
                {!state.current.sign && '-'}{state.current.magnitude}
            </div>
            <div className="calculator-buttons">
                <table>
                    <tr>
                        <td>
                            <table>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickPushDigit(1)} disabled={!isStateValid}>1</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(2)} disabled={!isStateValid}>2</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(3)} disabled={!isStateValid}>3</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickPushDigit(4)} disabled={!isStateValid}>4</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(5)} disabled={!isStateValid}>5</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(6)} disabled={!isStateValid}>6</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickPushDigit(7)} disabled={!isStateValid}>7</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(8)} disabled={!isStateValid}>8</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(9)} disabled={!isStateValid}>9</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.TOGGLE_SIGN)} disabled={!isStateValid}>±</button></td>
                                    <td><button type="button" onClick={() => handleClickPushDigit(0)} disabled={!isStateValid}>0</button></td>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.PUSH_DECIMAL_POINT)} disabled={!isStateValid}>.</button></td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.POP_CHAR)} disabled={!isStateValid}>⌫</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.CLEAR_ALL)}>CA</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.CLEAR_ENTRY)} disabled={!isStateValid}>CE</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.EVALUATE)} disabled={!isStateValid}>=</button></td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.ADDITION)} disabled={!isStateValid}>+</button></td>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.SUBTRACTION)} disabled={!isStateValid}>-</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.MULTIPLICATION)} disabled={!isStateValid}>*</button></td>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.DIVISION)} disabled={!isStateValid}>/</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.POWER)} disabled={!isStateValid}>x<sup>y</sup></button></td>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.LOGARITHM)} disabled={!isStateValid}>log<sub>y</sub> x</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickMetaOperation(MetaOperationType.SWAP)} disabled={!isStateValid}>SWAP</button></td>
                                    <td><button type="button" onClick={() => handleClickChangeBinaryOperation(BinaryOperationType.MODULO)} disabled={!isStateValid}>x mod y</button></td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.INVERSION)} disabled={!isStateValid}>1/x</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.NATURAL_EXPONENTIATION)} disabled={!isStateValid}>e<sup>x</sup></button></td>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.NATURAL_LOGARITHM)} disabled={!isStateValid}>ln x</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.BASE10_EXPONENTIATION)} disabled={!isStateValid}>10<sup>x</sup></button></td>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.BASE10_LOGARITHM)} disabled={!isStateValid}>log<sub>10</sub> x</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.TRIG_SINE)} disabled={!isStateValid}>sin x</button></td>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.TRIG_ARCSINE)} disabled={!isStateValid}>sin<sup>-1</sup> x</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.TRIG_COSINE)} disabled={!isStateValid}>cos x</button></td>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.TRIG_ARCCOSINE)} disabled={!isStateValid}>cos<sup>-1</sup> x</button></td>
                                </tr>
                                <tr>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.TRIG_TANGENT)} disabled={!isStateValid}>tan x</button></td>
                                    <td><button type="button" onClick={() => handleClickUnaryOperation(UnaryOperationType.TRIG_ARCTANGENT)} disabled={!isStateValid}>tan<sup>-1</sup> x</button></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </>);
}

export default Calculator;