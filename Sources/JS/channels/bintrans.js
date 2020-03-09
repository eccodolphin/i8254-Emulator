// --- <<< Binary (Binary-Decimal) Double Word <-> Decimal Number >>> transform functions. --- //

function BinDoubleWord_to_DecNumber (binDoubleWord) 
{
	var decNumber = 0;
	var multexCoefficient = 1;
	for (let i = binDoubleWord.length - 1; i >= 0; --i) 
	{
		const binDigit = binDoubleWord[i];
		decNumber += parseInt(binDigit) * multexCoefficient;
		multexCoefficient *= 2;
	}
	return decNumber;
}

function DecNumber_to_BinDoubleWord (decNumber) 
{
	var binDoubleWord = "";
	var divisionCoefficient = 32768;
	for (let i = 0; i < 16; ++i)
	{
		if (decNumber >= divisionCoefficient)
		{
			decNumber -= divisionCoefficient;
			binDoubleWord += '1';
		}
		else
		{
			binDoubleWord += '0';
		}
		divisionCoefficient /= 2;
	}
	return binDoubleWord;
}

function BindecDoubleWord_to_DecNumber (bindecDoubleWord) 
{
	var bindecDigits = [];
	bindecDigits[0] = bindecDoubleWord.substr(0, 4);
	bindecDigits[1] = bindecDoubleWord.substr(4, 4);
	bindecDigits[2] = bindecDoubleWord.substr(8, 4);
	bindecDigits[3] = bindecDoubleWord.substr(12, 4);

	var decNumber = 0;
	for (let i = 0; i < 4; ++i) 
	{
		var decDigit = 0; 
		if (bindecDigits[i][0] == 1) decDigit += 8;
		if (bindecDigits[i][1] == 1) decDigit += 4; 
		if (bindecDigits[i][2] == 1) decDigit += 2;
		if (bindecDigits[i][3] == 1) decDigit += 1;
		decNumber = decNumber * 10 + decDigit;
	}
	return decNumber;
}

function DecNumber_to_BindecDoubleWord (decNumber) 
{
	var decDigits = [];
	decDigits[0] = parseInt((decNumber % 10000) / 1000);
	decDigits[1] = parseInt((decNumber % 1000) / 100);
	decDigits[2] = parseInt((decNumber % 100) / 10);
	decDigits[3] = parseInt((decNumber % 10) / 1);

	var bindecNumber = "";
	for (let i = 0; i < 4; ++i)
	{
		if (decDigits[i] == 0) bindecNumber += "0000";
		if (decDigits[i] == 1) bindecNumber += "0001";
		if (decDigits[i] == 2) bindecNumber += "0010";
		if (decDigits[i] == 3) bindecNumber += "0011";
		if (decDigits[i] == 4) bindecNumber += "0100";
		if (decDigits[i] == 5) bindecNumber += "0101";
		if (decDigits[i] == 6) bindecNumber += "0110";
		if (decDigits[i] == 7) bindecNumber += "0111";
		if (decDigits[i] == 8) bindecNumber += "1000";
		if (decDigits[i] == 9) bindecNumber += "1001";
	}
	return bindecNumber;
}

// --- //