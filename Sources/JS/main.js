$(document).ready(function() 
{
	init();
	welcome();
	//test();
});

// Interaction.
var rwl = [];
var dbf = [];
var cwr = [];

// Channels.
var channels = [];
var generator = [];

// Features.
var assemblerer = [];
var tasker = [];

function init()
{
	rwl = new RWL();
	dbf = new DBF();
	cwr = new CWR();

	channels.push(new Channel(0, '#channel0'));
	channels.push(new Channel(1, '#channel1'));
	channels.push(new Channel(2, '#channel2'));
	generator = new Generator();
	
	tasker = new Tasker();
	assemblerer = new Assemblerer();
}

function welcome()
{
	alert(makeGreeting());
}

function makeGreeting()
{
	var greeting = "";

	greeting += "Добро пожаловать!\r\n";
	greeting += "Для комфортной работы, перейдите в полноэкранный режим (F11).\r\n";

	return greeting;
}

function test()
{
	channels[0].setChannelStatus(new ChannelStatus("00010101"));
	channels[0].setByte("01000100");
	channels[1].setChannelStatus(new ChannelStatus("01010011"));
	channels[1].setByte("10010100");
	channels[2].setChannelStatus(new ChannelStatus("10011010"));
	channels[2].setByte("00100101");

	generator.setPeriod(1000);

	setupAssProgram();
}

function setupAssProgram()
{
	var assProgram = "";

	assProgram += "mov bl, 00010001b\r\n";
	assProgram += "mov al, bl\r\n";
	assProgram += "out 43h, al\r\n";
	assProgram += "mov cx, AF45h\r\n";
	assProgram += "mov ax, cx\r\n";
	assProgram += "out 40h, al\r\n";
	assProgram += "mov dh, 194\r\n";
	assProgram += "mov al, dh\r\n";
	assProgram += "out 43h, al\r\n";
	assProgram += "in al, 40h";

	assemblerer.setLines(assProgram);
}