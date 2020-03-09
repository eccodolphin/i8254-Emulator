function Tasker()
{
    // --- View --- //

    this.$channelField = $("#tasker .param.n1 input");
    this.setChannel = (channel) =>
    {
        if (channel == undefined)
        {
            channel = "";
        }
        this.$channelField.prop("value", channel);
    }

    this.$modeField = $("#tasker .param.n2 input");
    this.setMode = (mode) =>
    {
        if (mode == undefined)
        {
            mode = "";
        }
        this.$modeField.prop("value", mode);
    }

    this.$systemField = $("#tasker .param.n3 input");
    this.setSystem = (system) =>
    {
        if (system == undefined)
        {
            system = "";
        }
        this.$systemField.prop("value", system);
    }

    this.$confacField = $("#tasker .param.n4 input");
    this.setConfac = (confac) =>
    {
        if (confac == undefined)
        {
            confac = "";
        }
        this.$confacField.prop("value", confac);
    }

    this.$goButton = $("#tasker button.go");
    this.setGoButtonText = (goButtonText) =>
    {
        this.$goButton.text(goButtonText);
    }
    this.$goButton.click(function()
    {
        tasker.go();
    });

    // --- //

    

    // --- Model --- //

    this.refreshChannels = () =>
    {
        this.channels = [ 2, 1, 0 ];
    }

    this.refreshChannels();
    this.systems = ["2-я", "10-я"];

    this.go = () =>
    {
        if (this.channels.length == 0)
        {
            this.refreshChannels();
            this.clearFields();
            this.setGoButtonText("Получить");
        }
        else
        {
            this.setTask();
            if (this.channels.length == 0)
            {
                this.setGoButtonText("Завершить");
            }
            else
            {
                this.setGoButtonText("Далее");
            }
        }
    }

    this.setTask = () =>
    {
        this.setChannel(this.channels.pop());
        this.setMode(getRandomInt(5 + 1));
        this.setSystem(this.systems[getRandomInt(1 + 1)]);
        this.setConfac(10 + getRandomInt(90 + 1));
    }

    this.clearFields = () =>
    {
        this.setChannel(undefined);
        this.setMode(undefined);
        this.setSystem(undefined);
        this.setConfac(undefined);
    }

    // --- //
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor( max ));
}

