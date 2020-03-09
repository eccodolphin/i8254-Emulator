function CWR()
{
	this.setControlWord = (controlWord) =>
	{
		if (!checkControlWord(controlWord))
		{
			return;
		}
		
		// Switching.
		if (controlWord[0] == 1 && controlWord[1] == 1) // Reverse read command.
		{
			const reverseReadCommand = new ReverseReadCommand(controlWord);

			if (reverseReadCommand.cnt0 == 1)
			{
				if (reverseReadCommand.count == 0)
				{
					channels[0].setOutBytes();
				}
				if (reverseReadCommand.status == 0)
				{
					channels[0].setOutStatus();
				}
			}
			if (reverseReadCommand.cnt1 == 1)
			{
				if (reverseReadCommand.count == 0)
				{
					channels[1].setOutBytes();
				}
				if (reverseReadCommand.status == 0)
				{
					channels[1].setOutStatus();
				}
			}
			if (reverseReadCommand.cnt2 == 1)
			{
				if (reverseReadCommand.count == 0)
				{
					channels[2].setOutBytes();
				}
				if (reverseReadCommand.status == 0)
				{
					channels[2].setOutStatus();
				}
			}
		}
		else if (controlWord[2] == 0 && controlWord[3] == 0) // Read on the fly.
		{
			const readOnTheFlyCommand = new ReadOnTheFlyCommand(controlWord);

			if (readOnTheFlyCommand.sc1 == 0 && readOnTheFlyCommand.sc0 == 0)
			{
				channels[0].setOutBytes();
			}
			if (readOnTheFlyCommand.sc1 == 0 && readOnTheFlyCommand.sc0 == 1)
			{
				channels[1].setOutBytes();
			}
			if (readOnTheFlyCommand.sc1 == 1 && readOnTheFlyCommand.sc0 == 0)
			{
				channels[2].setOutBytes();
			}
		}
		else // Channel status.
		{
			var channelStatus = new ChannelStatus(controlWord);

			if (channelStatus.sc1 == 0 && channelStatus.sc0 == 0)
			{
				channels[0].setChannelStatus(channelStatus);
			}
			if (channelStatus.sc1 == 0 && channelStatus.sc0 == 1)
			{
				channels[1].setChannelStatus(channelStatus);
			}
			if (channelStatus.sc1 == 1 && channelStatus.sc0 == 0)
			{
				channels[2].setChannelStatus(channelStatus);
			}
		}
	}
}

function checkControlWord(controlWord)
{
	if (controlWord.length != 8)
	{
		alert('Некорректное управляющее слово: длина не равна 8 битам.');
		return false;
	}
	for (let i = 0; i < 8; ++i)
	{
		const controlWordBit = controlWord[i];
		if (controlWordBit != 0 && controlWordBit != 1)
		{
			alert('Некорректное управляющее слово: значение бита не 0 или 1.');
			return false;
		}
	}
	return true;
}

function ReverseReadCommand(controlWord)
{
	this.count = parseInt(controlWord[2]);
	this.status = parseInt(controlWord[3]);
	this.cnt2 = parseInt(controlWord[4]);
	this.cnt1 = parseInt(controlWord[5]);
	this.cnt0 = parseInt(controlWord[6]);
}

function ReadOnTheFlyCommand(controlWord)
{
	this.sc1 = parseInt(controlWord[0]);
	this.sc0 = parseInt(controlWord[1]);
}

function ChannelStatus(controlWord)
{
	this.sc1 = parseInt(controlWord[0]);
	this.sc0 = parseInt(controlWord[1]);
	this.rw1 = parseInt(controlWord[2]);
	this.rw0 = parseInt(controlWord[3]);
	this.m2 = parseInt(controlWord[4]);
	this.m1 = parseInt(controlWord[5]);
	this.m0 = parseInt(controlWord[6]);
	this.bcd = parseInt(controlWord[7]);

	this.toString = () =>
	{
		var channelStatusAsString = "";
		channelStatusAsString += this.sc1.toString();
		channelStatusAsString += this.sc0.toString();
		channelStatusAsString += this.rw1.toString();
		channelStatusAsString += this.rw0.toString();
		channelStatusAsString += this.m2.toString();
		channelStatusAsString += this.m1.toString();
		channelStatusAsString += this.m0.toString();
		channelStatusAsString += this.bcd.toString();
		return channelStatusAsString;
	}
}