function Assemblerer ()
{
    this.$linesTextarea = $('#assemblerer textarea');
    this.getLines = () =>
    {
        return this.$linesTextarea.prop("value").match(/[^\r\n]+/g);
    }
    this.setLines = (lines) =>
    {
        if (lines == undefined)
        {
            lines = "";
        }
        this.$linesTextarea.prop("value", lines);
    }

    this.$runButton = $("#assemblerer button");
    this.$runButton.click(function()
    {
        var lines = assemblerer.getLines();
        if (lines == null) return;
        assemblerer.run(lines);
    }); 

    this.run = (lines) =>
    {
        lines = splitLines(lines);
        lines = formatLines(lines);
        if (!isValidLines(lines)) return false;
        lines = transformLinesNumbers(lines);
        if (!isValidLogic(lines)) return false;
        lines = addZeroes(lines);
        interpretLines(lines);
        showResults();
    }
}



// --- Services --- //

function showLines(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        console.log(lines[i]);
    }
}

function showResults()
{
    var resultsMessage = "";

    resultsMessage += "Готово!\r\n";;
    resultsMessage += "Текущие значения регистров:\r\n";
    resultsMessage += `AX: ${registers["ah"].value} ${registers["al"].value}\r\n`;
    resultsMessage += `BX: ${registers["bh"].value} ${registers["bl"].value}\r\n`;
    resultsMessage += `CX: ${registers["ch"].value} ${registers["cl"].value}\r\n`;
    resultsMessage += `DX: ${registers["dh"].value} ${registers["dl"].value}\r\n`;

    alert(resultsMessage);
}

// --- //



// --- Split lines --- //

function splitLines(lines)
{
    var splittedLines = [];
    for (let i = 0; i < lines.length; ++i)
    {
        var line = splitLine(lines[i]);
        if (!isEmptyLine(line)) 
        {
            splittedLines.push(line);
        }
    }
    return splittedLines.slice();
}

function splitLine(line)
{
    return line.replace(/\s+/g,' ').trim().split(' ');
}

function isEmptyLine(line)
{
    return line == "" || line == ",";
}

// --- //



// --- Formating lines --- //

function formatLines(lines)
{
    lines = toLowerCaseLines(lines);
    lines = removeCommas(lines);
    
    return lines.slice();
}

function toLowerCaseLines(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        for (let j = 0; j < lines[i].length; ++j)
        {
            lines[i][j] = lines[i][j].toLowerCase();
        }
    }

    return lines.slice();
}

function removeCommas(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        for (let j = 0; j < lines[i].length; ++j)
        {
            var lastSymbol = lines[i][j].substr(lines[i][j].length - 1);
            if (lastSymbol == ",")
            {
                lines[i][j] = lines[i][j].substr(0, lines[i][j].length - 1);
            }
        }
    }

    return lines.slice();
}

// --- //



// --- Validating lines --- //

var curValidatingLineNum;

function isRegisterName(candidateName)
{
    return candidateName == "al" || candidateName == "ah" || candidateName == "ax" ||
           candidateName == "bl" || candidateName == "bh" || candidateName == "bx" ||
           candidateName == "cl" || candidateName == "ch" || candidateName == "cx" ||
           candidateName == "dl" || candidateName == "dh" || candidateName == "dx";
}

function isTimerDeviceName(candidateName)
{
    return candidateName == "40h" || candidateName == "41h" ||
           candidateName == "42h" || candidateName == "43h";
}

function isAL(candidateName)
{
    return candidateName == "al";
}

function isValidLines(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        curValidatingLineNum = i + 1;

        if (!isValidLine(lines[i]))
        {
            return false;
        }
    }

    return true;
}

function isValidLine(line)
{
    var command = line[0];

    if (!isValidCommand(command)) return false;
    if (!isValidArgumentsQuantity(line)) return false;

    var firstArgument = line[1];
    var secondArgument = line[2];

    if (!isValidFirstArg(command, firstArgument)) return false;
    if (!isValidSecondArg(command, secondArgument)) return false;

    return true;
}

function isValidCommand(command)
{
    var commandValidity = (command == "mov" || command == "out" || command == "in");
    
    if (commandValidity)
    {
        return true;
    }
    else
    {
        var alertMessage = "Ошибка!\r\n";
        alertMessage += `Строка ${curValidatingLineNum}: неизвестная команда.\r\n`;
        alertMessage += "Допустимые команды: mov, out, in.\r\n";
        alert(alertMessage);

        return false;
    }
}

function isValidArgumentsQuantity(line)
{
    var argumentsQuantity = line.length - 1;
    
    if (argumentsQuantity == 2)
    {
        return true;
    }
    else
    {
        var alertMessage = "Ошибка!\r\n";
        alertMessage += `Строка ${curValidatingLineNum}: некорректное число аргументов.\r\n`;
        alertMessage += "Должно быть ровно два.\r\n";
        alert(alertMessage);

        return false;
    }
}

function isValidFirstArg(command, firstArg)
{
    if (command == "mov")
    {
        if (isRegisterName(firstArg))
        {
            return true;
        }
        else
        {
            var alertMessage = "Ошибка!\r\n";
            alertMessage += `Строка ${curValidatingLineNum}: некорректное имя регистра.\r\n`;
            alertMessage += "Допустимые значения:\r\n";
            alertMessage += "al, ah, ax,\r\n";
            alertMessage += "bl, bh, bx,\r\n";
            alertMessage += "cl, ch, cx,\r\n";
            alertMessage += "dl, dh, dx.\r\n";
            alert(alertMessage);
    
            return false;
        }
    }
    else if (command == "out")
    {
        if (isTimerDeviceName(firstArg))
        {
            return true;
        }
        else
        {
            var alertMessage = "Ошибка!\r\n";
            alertMessage += `Строка ${curValidatingLineNum}: некорректный адрес устройства таймера.\r\n`;
            alertMessage += "Допустимые значения:\r\n";
            alertMessage += "40h, 41h, 42h, 43h.\r\n";
            alert(alertMessage);
    
            return false;
        }
    }
    else if (command == "in")
    {
        if (isAL(firstArg))
        {
            return true;
        }
        else
        {
            var alertMessage = "Ошибка!\r\n";
            alertMessage += `Строка ${curValidatingLineNum}: некорректный адрес регистра для загрузки из устройства.\r\n`;
            alertMessage += "Допустимое значение: al.\r\n";
            alertMessage += "С таймером можно взаимодействовать ТОЛЬКО через этот регистр!\r\n";
            alert(alertMessage);
    
            return false;
        }
    }
}

function isValidSecondArg(command, secondArg)
{
    if (command == "mov")
    {
        if (isCorrectNumber(secondArg))
        {
            return true;
        }
        else if (isRegisterName(secondArg))
        {
            return true;
        }
        else
        {
            var alertMessage = "Ошибка!\r\n";
            alertMessage += `Строка ${curValidatingLineNum}: некорректное число для загрузки в регистр.\r\n`;
            alertMessage += "Допустимые значения (например):\r\n";
            alertMessage += "100,\r\n";
            alertMessage += "01100100b,\r\n";
            alertMessage += "54h.\r\n";
            alert(alertMessage);
    
            return false;
        }
    }
    else if (command == "out")
    {
        if (isAL(secondArg))
        {
            return true;
        }
        else
        {
            var alertMessage = "Ошибка!\r\n";
            alertMessage += `Строка ${curValidatingLineNum}: некорректное имя регистра для записи в устрйство.\r\n`;
            alertMessage += "Допустимое значение: al.\r\n";
            alertMessage += "С таймером можно взаимодействовать ТОЛЬКО через этот регистр!\r\n";
            alert(alertMessage);
    
            return false;
        }
    }
    else if (command == "in")
    {
        if (isTimerDeviceName(secondArg))
        {
            return true;
        }
        else
        {
            var alertMessage = "Ошибка!\r\n";
            alertMessage += `Строка ${curValidatingLineNum}: некорректный адрес устройства для чтения в регистр.\r\n`;
            alertMessage += "Допустимые значения:\r\n";
            alertMessage += "40h, 41h, 42h, 43h.\r\n";
            alert(alertMessage);
    
            return false;
        }
    }
}

// --- //



// --- Validating logic --- //

function isByteRegister(register)
{
    return register == "al" || register == "ah" ||
           register == "bl" || register == "bh" ||
           register == "cl" || register == "ch" ||
           register == "dl" || register == "dh";
}

function isDoubleWordRegister(register)
{
    return register == "ax" || 
           register == "bx" ||
           register == "cx" || 
           register == "dx";
}

function isValidLogic(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        var lineCommand = lines[i][0];

        if (lineCommand == "mov")
        {    
            var firstArg = lines[i][1];
            var secondArg = lines[i][2];

            if (isRegisterName(secondArg))
            {
                var lineFirstReg = firstArg;
                var lineSecondReg = secondArg;

                if (isByteRegister(lineFirstReg) && isDoubleWordRegister(lineSecondReg) || 
                    isDoubleWordRegister(lineFirstReg) && isByteRegister(lineSecondReg))
                {
                    var alertMessage = "Ошибка!\r\n";
                    alertMessage += `Строка ${curValidatingLineNum}: размерность регистров не одинакова.\r\n`;
                    alertMessage += `Выполнить команду MOV невозможно.\r\n`;
                    alert(alertMessage);
            
                    return false;
                }
                else
                {
                    continue;
                }
            }

            var lineRegister = firstArg;
            var lineNumber = secondArg;

            if (isByteRegister(lineRegister))
            {
                if (lineNumber.length > 8) 
                {
                    var alertMessage = "Ошибка!\r\n";
                    alertMessage += `Строка ${curValidatingLineNum}: число не помещается в регистр.\r\n`;
                    alert(alertMessage);
            
                    return false;
                }
            }
            else if (isDoubleWordRegister(lineRegister))
            {
                if (lineNumber.length > 16)
                {
                    var alertMessage = "Ошибка!\r\n";
                    alertMessage += `Строка ${curValidatingLineNum}: число не помещается в регистр.\r\n`;
                    alert(alertMessage);
            
                    return false;
                }
            }
        }

        if (lineCommand == "in")
        {
            var lineFromAddress = lines[i][2];

            if (lineFromAddress == "43h")
            {
                var alertMessage = "Ошибка!\r\n";
                alertMessage += `Строка ${curValidatingLineNum}: невозможно читать из РУС.\r\n`;
                alert(alertMessage);
        
                return false;
            }
        }
    }

    return true;
}

// --- //



// --- Adding zeroes --- //

function addZeoresToByte(byte)
{
    while (byte.length < 8)
    {
        byte = '0' + byte;
    }
    return byte;
}

function addZeroesToDoubleWord(doubleWord)
{
    while (doubleWord.length < 16)
    {
        doubleWord = '0' + doubleWord;
    }
    return doubleWord;
}

function addZeroes(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        var lineCommand = lines[i][0];

        if (lineCommand == "mov")
        {
            var secondArg = lines[i][2];

            if (isRegisterName(secondArg))
            {
                continue;
            }

            var lineRegister = lines[i][1];
            var lineNumber = lines[i][2];

            if (isByteRegister(lineRegister))
            {
                if (lineNumber.length < 8)
                {
                    lines[i][2] = addZeoresToByte(lineNumber);
                }
            }
            else if (isDoubleWordRegister(lineRegister))
            {
                if (lineNumber.length < 16)
                {
                    lines[i][2] = addZeroesToDoubleWord(lineNumber);
                }

            }
        }
    }

    return lines.slice();
}

// --- //



// --- Interpreting --- //

function interpretLines(lines)
{
    for (let i = 0; i < lines.length; ++i)
    {
        var line = lines[i];
        interpretLine(line);
    }
}

function interpretLine(line)
{
    var lineCommand = line[0];
    if (lineCommand == "mov")
    {
        var firstArg = line[1];
        var secondArg = line[2];
        interpretMov(firstArg, secondArg);
    }
    else if (lineCommand == "out")
    {
        var outAddr = line[1];
        interpretOut(outAddr);
    }
    else if (lineCommand == "in")
    {
        var inAddr = line[2];
        interpretIn(inAddr);
    }
}

function getNumberType(number)
{
    if (number.length == 8) return "word";
    return "doubleWord";
}

function interpretMov(firstArg, secondArg)
{
    if (isRegisterName(firstArg) && isRegisterName(secondArg))
    {
        var firstRegName = firstArg;
        var secondRegName = secondArg;
        if (isByteRegister(firstRegName))
        {
            var childToName = firstRegName;
            var childFromName = secondRegName;
            ChildToChild(childToName, childFromName);
        }
        else
        {
            var parentToName = firstRegName;
            var parentFromName = secondRegName;
            ParentToParent(parentToName, parentFromName);
        }
    }
    else
    {
        var regName = firstArg;
        var number = secondArg;
        if (getNumberType(number) == "word")
        {
            var childName = regName;
            var word = number;
            WordToChild(childName, word);
        }
        else
        {
            var parentName = regName;
            var doubleWord = number;
            DoubleWordToParent(parentName, doubleWord);
        }
    }
}

function interpretOut(outAddr)
{
    if (outAddr == "40h")
    {
        channels[0].setByte(getAL());
    }
    else if (outAddr == "41h")
    {
        channels[1].setByte(getAL());
    }
    else if (outAddr == "42h")
    {
        channels[2].setByte(getAL());
    }
    else if (outAddr == "43h")
    {
        cwr.setControlWord(getAL());
    }
    else 
    {
        alert("Unknow outAddr in interpretOut function.");
    }
}

function interpretIn(inAddr)
{
    if (inAddr == "40h")
    {
        setAL(channels[0].getByte());
    }
    else if (inAddr == "41h")
    {
        setAL(channels[1].getByte());
    }
    else if (inAddr == "42h")
    {
        setAL(channels[2].getByte());
    }
    else if (inAddr == "43h")
    {
        setAL(cwr.getByte());
    }
    else
    {
        alert(`Unknown inAddr in interpretIn function.`);
    }
}

// --- //
