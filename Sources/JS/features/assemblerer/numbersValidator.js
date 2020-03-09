function isCorrectNumber(candidateNumber)
{
    if (isCorrectBinNumber(candidateNumber)) return true;
    if (isCorrectDecNumber(candidateNumber)) return true;
    if (isCorrectHexNumber(candidateNumber)) return true;
    return false;
}



// --- BINARY --- //

function isCorrectBinNumber(candidateNumber)
{
    var candidateLastSymbol = candidateNumber.substr(candidateNumber.length - 1);
    if (!isCorrectLastBinSymbol(candidateLastSymbol)) return false;

    var candidateBody = candidateNumber.substr(0, candidateNumber.length - 1);
    if (!isCorrectBinBody(candidateBody)) return false;

    return true;
}

function isCorrectLastBinSymbol(candidateLastSymbol)
{
    return candidateLastSymbol == 'b';
}

function isCorrectBinBody(candidateBody)
{
    for (let i = 0; i < candidateBody.length; ++i)
    {
        var candidateSymbol = candidateBody[i];

        if (!isCorrectBinSymbol(candidateSymbol))
        {
            return false;
        }
    }

    return true;
}

function isCorrectBinSymbol(candidateSymbol)
{
    return candidateSymbol == '0' || candidateSymbol == '1';
}

// --- //



// --- DEC --- //

function isCorrectDecNumber(candidateNumber)
{
    candidateNumber = Number(candidateNumber); 
    
    if (isNaN(candidateNumber)) return false;
    if (candidateNumber > Number.MAX_SAFE_INTEGER) return false;

    candidateNumber = candidateNumber.toString();

    for (let i = 0; i < candidateNumber.length; ++i)
    {
        var candidateSymbol = candidateNumber[i];
        if (!isCorrectDecSymbol(candidateSymbol)) return false;
    }

    return true;
}

function isCorrectDecSymbol(candidateSymbol)
{
    return candidateSymbol >= '0' && candidateSymbol <= '9';
}

// --- //



// --- HEX --- //

function isCorrectHexNumber(candidateNumber)
{
    var candidateLastSymbol = candidateNumber.substr(candidateNumber.length - 1);
    if (!isCorrectHexLastSymbol(candidateLastSymbol)) return false;

    var candidateBody = candidateNumber.substr(0, candidateNumber.length - 1);
    if (!isCorrectHexBody(candidateBody)) return false;

    return true;
}

function isCorrectHexLastSymbol(candidateLastSymbol)
{
    return candidateLastSymbol == "h";
}

function isCorrectHexBody(candidateBody)
{
    for (let i = 0; i < candidateBody.length; ++i)
    {
        var candidateSymbol = candidateBody[i];

        if (!isCorrectHexSymbol(candidateSymbol))
        {
            return false;
        }
    }

    return true;
}

function isCorrectHexSymbol(candidateSymbol)
{
    return (candidateSymbol >= '0' && candidateSymbol <= '9') ||
           (candidateSymbol >= 'a' && candidateSymbol <= 'f');
}

// --- //