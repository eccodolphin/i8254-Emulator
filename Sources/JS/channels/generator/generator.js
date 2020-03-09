function Generator()
{
    this.screen = new Screen();

    // --- View --- //

    // Period field.
    this.$periodField = $('#generator input');
    this.setPeriod = (period) =>
    {
        if (period == undefined)
        {
            period = "";
        }
        this.$periodField.prop('value', period);
    }
    this.getPeriod = () =>
    {
        var period = this.$periodField.prop('value')
        if (period == "")
        {
            period = undefined;
        }
        return parseInt(period);
    }
    this.checkPeriod = (period) =>
    {
        if (isNaN(period))
        {
            alert('Период задан некорректно');
            return false;
        }
        if (period < 100 || period > 10000)
        {
            alert('Период должен быть от 100 до 10000 мс.');
            return false;
        }
        return true;
    }

    // Play-stop button.
    this.$playStopButton = $('#generator button.play-stop');
    this.$playStopButton.click(function()
    {
        const period = generator.getPeriod();

        if (!generator.checkPeriod(period)) 
        {
            return;
        }

        if (!generator.working) 
        {
            generator.startWorking();
            generator.screen.startAnimation();
        }
        else 
        {
            generator.stopWorking();
            generator.screen.stopAnimation();
        }
    });

    // Single impulse button.
    this.$singleImpulseButton = $('#generator button.single');
    this.$singleImpulseButton.click(function()
    {
        generator.giveImpulse();
    });

    // --- //



    // --- Model --- //

    this.workingItervalID = undefined;
    this.working = false;

    this.startWorking = () =>
    {
        this.$periodField.prop('disabled', true);
        this.$singleImpulseButton.prop('disabled', true);
        this.$playStopButton.text("Стоп");

        // this.workingIntervalID = setInterval(this.giveImpulse, this.getPeriod());
        this.working = true;
    }

    this.stopWorking = () =>
    {
        this.$playStopButton.prop("disabled", true);

        // clearInterval(this.workingIntervalID);
        this.working = false;
    }

    this.giveImpulse = () =>
    {
        for (let i = 0; i < channels.length; ++i)
        {
            channels[i].impulseReceived();
        }
    }

    // --- //
}