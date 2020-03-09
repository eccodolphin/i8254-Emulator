function transformLinesNumbers(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        var lineCommand = lines[i][0];
        if (lineCommand == "mov")
        {
            var secondArg = lines[i][2];
            if (!isRegisterName(secondArg))
            {
                // Если второй аргумент - не регистр, значит - это число.
                lines[i][2] = transformLineNumber(secondArg);
            }
        }
    }
    return lines.slice();
}

function transformLineNumber(lineNumber)
{
    var lineNumberLastSymbol = lineNumber.substr(lineNumber.length - 1);
    if (lineNumberLastSymbol == 'b') return transformBinNumber(lineNumber);
    else if (lineNumberLastSymbol == 'h') return transformHexNumber(lineNumber);
    else return transformDecNumber(lineNumber);
}

function transformBinNumber(binNumber)
{
    var binNumberBody = binNumber.substr(0, binNumber.length - 1);
    var transformedNumber = binNumberBody;
    return transformedNumber;
}

function transformHexNumber(hexNumber)
{
    var hexNumberBody = hexNumber.substr(0, hexNumber.length - 1);
    var transformedNumber = "";
    for (let i = 0; i < hexNumberBody.length; ++i)
    {
        var hexSymbol = hexNumberBody[i];
        var hexSymbolAsBinValue;
        if (hexSymbol == '0') hexSymbolAsBinValue = "0000";
        if (hexSymbol == '1') hexSymbolAsBinValue = "0001";
        if (hexSymbol == '2') hexSymbolAsBinValue = "0010";
        if (hexSymbol == '3') hexSymbolAsBinValue = "0011";
        if (hexSymbol == '4') hexSymbolAsBinValue = "0100";
        if (hexSymbol == '5') hexSymbolAsBinValue = "0101";
        if (hexSymbol == '6') hexSymbolAsBinValue = "0110";
        if (hexSymbol == '7') hexSymbolAsBinValue = "0111";
        if (hexSymbol == '8') hexSymbolAsBinValue = "1000";
        if (hexSymbol == '9') hexSymbolAsBinValue = "1001";
        if (hexSymbol == 'a') hexSymbolAsBinValue = "1010";
        if (hexSymbol == 'b') hexSymbolAsBinValue = "1011";
        if (hexSymbol == 'c') hexSymbolAsBinValue = "1100";
        if (hexSymbol == 'd') hexSymbolAsBinValue = "1101";
        if (hexSymbol == 'e') hexSymbolAsBinValue = "1110";
        if (hexSymbol == 'f') hexSymbolAsBinValue = "1111";
        transformedNumber += hexSymbolAsBinValue;
    }
    return transformedNumber;
}

function transformDecNumber(decNumber)
{
    decNumber = parseInt(decNumber);
    var transformedNumber = "";
    while (decNumber > 0)
    {
        if (decNumber % 2 == 0) transformedNumber += '0';
        else transformedNumber += '1';

        decNumber = parseInt(decNumber / 2);
    }
    transformedNumber = reverseString(transformedNumber);
    return transformedNumber;
}

function reverseString(string)
{
    string = string.split("");
    string = string.reverse();
    string = string.join("");
    return string;
}