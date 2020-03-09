function Channel(channelNumber)
{
    // Startup information.
    this.number = channelNumber;
    this.ID = "#channel" + channelNumber.toString();

    // Fields.
    this.$statusInField = $(`${this.ID} .status.in`);
    this.$smallInField = $(`${this.ID} .small.in`);
    this.$bigInField = $(`${this.ID} .big.in`);
    this.$statusOutField = $(`${this.ID} .status.out`);
    this.$smallOutField = $(`${this.ID} .small.out`);
    this.$bigOutField = $(`${this.ID} .big.out`);
    this.$counterField = $(`${this.ID} .counter`);

    // Buttons.
    this.$clkButton = $(`${this.ID} .clk button`);
    this.$gateButton = $(`${this.ID} .gate button`);
    this.$outButton = $(`${this.ID} .out button`);

    // Setters.
    this.setStatusIn = (statusIn) =>
    {
        if (statusIn == undefined)
        {
            statusIn = "";
        }
        this.$statusInField.prop('value', statusIn);
    }
    this.setSmallIn = (smallIn) =>
    {
        if (smallIn == undefined)
        {
            smallIn = "";
        }
        this.$smallInField.prop('value', smallIn);
    }
    this.setBigIn = (bigIn) =>
    {   
        if (bigIn == undefined)
        {
            bigIn = "";
        }
        this.$bigInField.prop('value', bigIn);
    }
    this.setStatusOut = (statusOut) =>
    {
        if (statusOut == undefined)
        {
            statusOut = ""
        }
        this.$statusOutField.prop('value', statusOut);
    }
    this.setSmallOut = (smallOut) =>
    {
        if (smallOut == undefined)
        {
            smallOut = "";
        }
        this.$smallOutField.prop('value', smallOut);
    }
    this.setBigOut = (bigOut) =>
    {
        if (bigOut == undefined)
        {
            bigOut = "";
        }
        this.$bigOutField.prop('value', bigOut);
    }
    this.setCounter = (counter) =>
    {
        if (counter == undefined)
        {
            counter = "";
        }
        this.$counterField.prop('value', counter);
    }
    this.setCLK = (clkValue) =>
    {
        this.$clkButton.text(clkValue);
    }
    this.setGATE = (gateValue) =>
    {
        this.$gateButton.text(gateValue);
    }
    this.setOUT = (outValue) =>
    {
        this.$outButton.text(outValue);
    }

    // Getters.
    this.getStatusIn = () =>
    {
        return this.$statusInField.prop('value');
    }
    this.getSmallIn = () =>
    {
        return this.$smallInField.prop('value');
    }
    this.getBigIn = () =>
    {
        return this.$bigInField.prop('value');
    }
    this.getStatusOut = () =>
    {
        return this.$statusOutField.prop('value');
    }
    this.getSmallOut = () =>
    {
        return this.$smallOutField.prop('value');
    }
    this.getBigOut = () =>
    {
        return this.$bigOutField.prop('value');
    }
    this.getCounter = () =>
    {
        return this.$counterField.prop('value');
    }
    this.getCLK = () =>
    {
        return parseInt(this.$clkButton.text());
    }
    this.getGATE = () =>
    {
        return parseInt(this.$gateButton.text());
    }
    this.getOUT = () =>
    {
        return parseInt(this.$outButton.text());
    }
    
    this.$gateButton.attr("number", this.number);

    // Clicks.
    this.$gateButton.click(function(event)
    {
        var channelNumber = $(this).attr("number");

        channels[channelNumber].setGATE(channels[channelNumber].getGATE() ^ 1);

        if (channels[channelNumber].getGATE() == 1)
        {
            channels[channelNumber].gateReloadProcessing();
        }
    });

    // Flags.
    this.statusSetted = false;
    this.newСonversFactorReady = false;
    this.newConversFactorWasLoaded = false;
    this.currentConversFactor = undefined;
    this.gateWasReloaded = false;

    // Variables.
    this.currentConversFactor = undefined;

    // Switchers.
    this.directReadingTurn = 1;

    // Methods.
    this.impulseReceived = () =>
    {
        // Заглушка.
    }

    this.clearFields = () =>
    {
        this.setStatusIn(undefined);
        this.setSmallIn(undefined);
        this.setBigIn(undefined);
        this.setStatusOut(undefined);
        this.setSmallOut(undefined);
        this.setBigOut(undefined);
        this.setCounter(undefined);
    }

    this.setChannelStatus = (channelStatus) =>
    {
        this.clearFields();

        // Byte's checking and decrementing modes.
        if (channelStatus.bcd == 0)
        {
            this.checkByte = checkByte_bin;
            this.decrementCounter = decrementCounter_bin;
        }
        else if (channelStatus.bcd == 1)
        {
            this.checkByte = checkByte_bindec;
            this.decrementCounter = decrementCounter_bindec;
        }

        // Byte's setting mode.
        if (channelStatus.rw1 == 0 && channelStatus.rw0 == 1)
        {
            this.setByte = setByte_onlySmall;
            this.setBigIn("00000000");
        }
        else if (channelStatus.rw1 == 1 && channelStatus.rw0 == 0)
        {
            this.setByte = setByte_onlyBig;
            this.setSmallIn("00000000");
        }
        else if (channelStatus.rw1 == 1 && channelStatus.rw0 == 1)
        {
            this.setByte = setByte_both;
        }

        // Byte's working mode.
        if (channelStatus.m2 == 0 && channelStatus.m1 == 0 && channelStatus.m0 == 0)
        {
            this.impulseReceived = impulseReceived_delay;
            this.checkNewConversFactor = checkNewConversFactor_delay;
            this.gateReloadProcessing = gateReloadProcessing_delay;
            this.setOUT(0);
        }
        if (channelStatus.m2 == 0 && channelStatus.m1 == 0 && channelStatus.m0 == 1)
        {
            this.impulseReceived = impulseReceived_multivibrator;
            this.checkNewConversFactor = checkNewConversFactor_multivibrator;
            this.gateReloadProcessing = gateReloadProcessing_multivibrator;
            this.setOUT(1);
        }
        if (channelStatus.m2 == 0 && channelStatus.m1 == 1 && channelStatus.m0 == 0 ||
            channelStatus.m2 == 1 && channelStatus.m1 == 1 && channelStatus.m0 == 0)
        {
            this.impulseReceived = impulseReceived_freqdivider;
            this.checkNewConversFactor = checkNewConversFactor_freqdivider;
            this.gateReloadProcessing = gateReloadProcessing_freqdivider;
            this.setOUT(1);
        }
        if (channelStatus.m2 == 0 && channelStatus.m1 == 1 && channelStatus.m0 == 1 ||
            channelStatus.m2 == 1 && channelStatus.m1 == 1 && channelStatus.m0 == 1)
        {
            this.impulseReceived = impulseReceived_meandergen;
            this.checkNewConversFactor = checkNewConversFactor_meandergen;
            this.gateReloadProcessing = gateReloadProcessing_meandergen;

            if (channelStatus.bcd == 0)
            {
                this.getMeanderCompareResult = getMeanderCompareResult_bin;
            }
            else 
            {
                this.getMeanderCompareResult = getMeanderCompareResult_bindec;
            }

            this.setOUT(1);
        }
        if (channelStatus.m2 == 1 && channelStatus.m1 == 0 && channelStatus.m0 == 0)
        {
            this.impulseReceived = impulseReceived_softstrob;
            this.checkNewConversFactor = checkNewConversFactor_softstrob;
            this.gateReloadProcessing = gateReloadProcessing_softstrob;
            this.setOUT(1);
        }
        if (channelStatus.m2 == 1 && channelStatus.m1 == 0 && channelStatus.m0 == 1)
        {
            this.impulseReceived = impulseReceived_hardstrob;
            this.checkNewConversFactor = checkNewConversFactor_hardstrob;
            this.gateReloadProcessing = gateReloadProcessing_hardstrob;
            this.setOUT(1);
        }
        
        this.setStatusIn(channelStatus.toString());
        this.statusSetted = true;
        this.newConversFactorWasLoaded = false;
    }

    this.setByte = () =>
    {
        alert(`Статус канала №${this.number} не определен.`);
    }

    this.getByte = () =>
    {
        if (this.getStatusOut() != "")
        {
            const statusOut = this.getStatusOut();
            this.setStatusOut(undefined);
            return statusOut;
        }
        if (this.getSmallOut() != "")
        {
            const smallOut = this.getSmallOut();
            this.setSmallOut(undefined);
            return smallOut;
        }
        if (this.getBigOut() != "")
        {
            const bigOut = this.getBigOut();
            this.setBigOut(undefined);
            return bigOut;
        }

        if (this.getCounter() == "")
        {
            alert(`Прямое чтение из канала №${this.number} невозможно: коэфициент пересчета не определен.`);
            return undefined;
        }
        else
        {
            this.directReadingTurn ^= 1;
            if (this.directReadingTurn == 0)
            {
                return this.getCounter().substr(8, 8);
            }
            else
            {
                return this.getCounter().substr(0, 8);
            }
        }
    }

    this.getNewConversFactor = () =>
    {
        return this.getBigIn() + this.getSmallIn();
    }

    this.setOutBytes = () =>
    {
        if (this.getCounter() == "")
        {
            alert(`Установить выходные байты счетчика невозможно: счетчик канала №${this.number} не определен.`);
            return;
        }

        this.setSmallOut(this.getCounter().substr(8, 8));
        this.setBigOut(this.getCounter().substr(0, 8));
    }

    this.setOutStatus = () =>
    {
        if (this.getStatusIn() == "")
        {
            alert(`Установить выходной статус невозможно: статус канала №${this.number} не определен.`);
            return;
        }

        const OUT = this.getOUT().toString();
        const NULLCOUNT = this.newConversFactorWasLoaded == false ? 1 : 0;
        const STATUS = this.getStatusIn().substr(2, 6);

        this.setStatusOut(OUT + NULLCOUNT + STATUS);
    }

    // --- //
}



const nullDoubleWord = "0000000000000000";
const oneDoubleWord = "0000000000000001";



// --- checkByte FUNCTIONS --- //

function checkByte_bin(byteValue)
{
	if (byteValue.length != 8) // Проверка длины.
	{
		alert('Некорректный двоичный байт: длина не равна 8 битам.');
		return false;
	}
	for (let i = 0; i < 8; ++i) // Проверка символов.
	{
		const bitValue = byteValue[i];
		if (bitValue != 0 && bitValue != 1)
		{
			alert('Некорректный двоичный байт: значение бита не 0 или 1.');
			return false;
		}
	}
	return true;
}

function checkByte_bindec(byteValue)
{
	if (byteValue.length != 8) // Проверка длины.
	{
		alert('Некорректный двоично-десятичный байт: длина не равна 8 битам.');
		return false;
	}
	for (let i = 0; i < 8; ++i) // Проверка символов.
	{
		const bitValue = byteValue[i];
		if (bitValue != 0 && bitValue != 1)
		{
			alert('Некорректный двоично-десятичный байт: значение бита не 0 или 1.');
			return false;
		}
    }

    const firstDigit = byteValue.substr(0, 4); 
    const secondDigit = byteValue.substr(4, 4);

    if (firstDigit[0] == 1) // Проверка двоично-десятичности (первая цифра).
    {
        if (firstDigit[1] == 1 || firstDigit[2] == 1)
        {
            alert('Некорректный двоично-десятичный байт: старшый полубайт не является двоично-десятичной цифрой.');
            return;
        }
    }
    if (secondDigit[0] == 1) // Проверка двоично-десятичности (вторая цифра).
    {
        if (secondDigit[1] == 1 && secondDigit[2] == 1)
        {
            alert('Некорректный двоично-десятичный байт: младший полубайт не является двоично-десятичной цифрой');
            return;
        }
    }

	return true;
}

// --- //



// --- decrementCounter FUNCTIONS --- //

function decrementCounter_bin()
{
    if (this.getCounter() == "0000000000000000")
    {
        this.setCounter("1111111111111111");
    }
    else
    {
        var decCounter = BinDoubleWord_to_DecNumber(this.getCounter());
        decCounter--;
        this.setCounter(DecNumber_to_BinDoubleWord(decCounter));
    }    
}

function decrementCounter_bindec()
{
    if (this.getCounter() == "0000000000000000")
    {
        this.setCounter("1001100110011001");
    }
    else
    {
        var decCounter = BindecDoubleWord_to_DecNumber(this.getCounter());
        decCounter--;
        this.setCounter(DecNumber_to_BindecDoubleWord(decCounter));
    } 
}

// --- //



// --- setByte FUNCTIONS --- //

function setByte_onlySmall(byteValue)
{
    if (this.statusSetted == false)
    {
        alert(`Запись коэффициента пересчета невозможна: статус канала №${this.number} не задан.`);
        return;
    }
    
    if (!this.checkByte(byteValue))
    {
        return;
    }
    else
    {
        this.setSmallIn(byteValue);
        this.newConversFactorReady = true;
        this.newConversFactorWasLoaded = false;
        this.checkNewConversFactor();
    }
}

function setByte_onlyBig(byteValue)
{
    if (this.statusSetted == false)
    {
        alert(`Запись коэффициента пересчета невозможна: статус канала №${this.number} не задан.`);
        return;
    }

    if (!this.checkByte(byteValue))
    {
        return;
    }
    else
    {
        this.setbigIn(byteValue);
        this.newConversFactorReady = true;
        this.newConversFactorWasLoaded = false;
        this.checkNewConversFactor();
    }
}

function setByte_both(byteValue)
{
    if (this.statusSetted == false)
    {
        alert(`Запись коэффициента пересчета невозможна: статус канала №${this.number} не задан.`);
        return;
    }

    if (!this.checkByte(byteValue))
    {
        return;
    }
    else
    {
        if (this.getSmallIn() == "")
        {
            this.setSmallIn(byteValue);
        }
        else if (this.getBigIn() == "")
        {
            this.setBigIn(byteValue);
            this.newConversFactorReady = true;
            this.newConversFactorWasLoaded = false;
            this.checkNewConversFactor();
        }
        else
        {
            this.setSmallIn(byteValue);
            this.setBigIn(undefined);
        }
    }
}

// --- //



// checkNewConversFactor FUNCTIONS

function checkNewConversFactor_delay()
{
    this.setCounter(this.getNewConversFactor);
    this.newConversFactorReady = false;
    this.newConversFactorWasLoaded = true;
    this.setOUT(0);
} 

function checkNewConversFactor_multivibrator()
{
    // Заглушка.
}

function checkNewConversFactor_freqdivider()
{
    if (this.getCounter() == "")
    {
        this.setCounter(this.getNewConversFactor());
        this.newConversFactorReady = false; 
        this.newConversFactorWasLoaded = true;
    }
}

function checkNewConversFactor_meandergen()
{
    if (this.getCounter() == "")
    {
        this.currentConversFactor = this.getNewConversFactor();
        this.setCounter(this.currentConversFactor);
        this.newConversFactorReady = false; 
        this.newConversFactorWasLoaded = true;
    }
}

function checkNewConversFactor_softstrob()
{
    this.setCounter(this.getNewConversFactor);
    this.newConversFactorReady = false;
    this.newConversFactorWasLoaded = true;
    this.setOUT(1);
}

function checkNewConversFactor_hardstrob()
{
    // Заглушка.
}

// --- //



// --- gateReloadProcessing FNCTIONS --- //

function gateReloadProcessing_delay()
{
    // Заглушка.
} 

function gateReloadProcessing_multivibrator()
{
    this.setCounter(this.getNewConversFactor());
    this.newConversFactorReady = false;
    this.newConversFactorWasLoaded = true;
    this.setOUT(0);
}

function gateReloadProcessing_freqdivider()
{
    this.setCounter(this.getNewConversFactor());
    this.newConversFactorReady = false; 
    this.newConversFactorWasLoaded = true;
}

function gateReloadProcessing_meandergen()
{
    this.currentConversFactor = this.getNewConversFactor();
    this.setCounter(this.currentConversFactor);
    this.newConversFactorReady = false; 
    this.newConversFactorWasLoaded = true;
}

function gateReloadProcessing_softstrob()
{
    // Заглушка.
}

function gateReloadProcessing_hardstrob()
{
    this.setCounter(this.getNewConversFactor());
    this.newConversFactorReady = false;
    this.newConversFactorWasLoaded = true;
    this.setOUT(1);
}

// --- //



// --- impulseReceived FUNCTIONS --- //

function impulseReceived_delay()
{
    if (this.getCounter() == "")
    {
        return;
    }

    if (this.getGATE() == 1)
    {
        this.decrementCounter();
    }

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(1);
    }
}

function impulseReceived_multivibrator()
{
    if (this.getCounter() == "")
    {
        return;
    }

    if (this.newConversFactorReady || this.getCounter() == nullDoubleWord)
    {
        if (this.getGATE() == 1)
        {
            this.setCounter(this.getNewConversFactor());
            this.newConversFactorReady = false;
            this.newConversFactorWasLoaded = true;
            this.setOUT(0);
        }
    }

    this.decrementCounter();

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(1);
    }
}

function impulseReceived_freqdivider()
{
    if (this.getCounter() == "")
    {
        return;
    }

    if (this.getGATE() == 1)
    {
        this.decrementCounter();
    }

    if (this.getCounter() == oneDoubleWord)
    {
        this.setOUT(0);
    }

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(1);
        this.setCounter(this.getNewConversFactor());
        this.newConversFactorReady = false; 
        this.newConversFactorWasLoaded = true;
    }
}

function impulseReceived_meandergen()
{
    if (this.getCounter() == "")
    {
        return;
    }

    if (this.getGATE() == 1)
    {
        this.decrementCounter();
    }

    this.setOUT(this.getMeanderCompareResult());

    if (this.getCounter() == nullDoubleWord)
    {
        this.currentConversFactor = this.getNewConversFactor();
        this.setCounter(this.currentConversFactor);
        this.newConversFactorReady = false; 
        this.newConversFactorWasLoaded = true;
    }
}

function impulseReceived_softstrob()
{
    if (this.getCounter() == "")
    {
        return;
    }

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(1);
    }

    if (this.getGATE() == 1)
    {
        this.decrementCounter();
    }

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(0);
    }
}

function impulseReceived_hardstrob()
{
    if (this.getCounter() == "")
    {
        return;
    }

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(1);
    }

    if (this.newConversFactorReady || this.getCounter() == nullDoubleWord)
    {
        if (this.getGATE() == 1)
        {
            this.setCounter(this.getNewConversFactor());
            this.newConversFactorReady = false;
            this.newConversFactorWasLoaded = true;
            this.setOUT(1);
        }
    }

    this.decrementCounter();

    if (this.getCounter() == nullDoubleWord)
    {
        this.setOUT(0);
    }
}

// --- //



// --- getMeanderCompareResult FUNCTIONS --- //

function getMeanderCompareResult_bin ()
{
    const counter = BinDoubleWord_to_DecNumber(this.getCounter());
    const currentConversFactor = BinDoubleWord_to_DecNumber(this.currentConversFactor);

    if (counter > parseInt(currentConversFactor / 2))
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function getMeanderCompareResult_bindec ()
{
    const counter = BindecDoubleWord_to_DecNumber(this.getCounter());
    const currentConversFactor = BindecDoubleWord_to_DecNumber(this.currentConversFactor);

    if (counter > parseInt(currentConversFactor / 2))
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

// --- //