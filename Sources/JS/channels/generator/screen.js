function Screen()
{
    this.linesAnimations = 
    [
        { width: "+=2.6rem" },
        { height: "+=3.4rem", top: "-=1.9rem" },
        { width: "+=2.6rem" },
        { height: "+=3.4rem" }
    ];

    this.linesClear =
    [
        { width: "-=2.6rem" },
        { height: "-=3.4rem", top: "+=1.9rem" },
        { width: "-=2.6rem" },
        { height: "-=3.4rem" }
    ];

    this.linesNumber = 12;

    this.lines = [];

    this.initLines = () =>
    {
        for (let i = 0; i < this.linesNumber; ++i)
        {
            var line = { $: $("#generator-line-" + i.toString()) };

            line.animation = this.linesAnimations[i % 4];
            line.disanimation = this.linesClear[i % 4];
            line.animated = true;

            this.lines[i] = line;
        }
    }

    this.resetAnimation = () =>
    {
        for (let i = 0; i < this.linesNumber; ++i)
        {
            if (this.lines[i].animated)
            {
                this.lines[i].$.hide(0);
                this.lines[i].$.animate(this.lines[i].disanimation, 0);
                this.lines[i].animated = false;
            }
        }

        this.curAnimLine = 0;
    }

    this.curAnimLine = 0;
    this.animating = false;

    this.startAnimation = () =>
    {
        this.setLinesAnitime(generator.getPeriod());
        this.animating = true;
        this.animateLine();
    }

    this.setLinesAnitime = (impulsePeriod) =>
    {
        var long = (impulsePeriod / 2) * 0.9;
        var short = (impulsePeriod / 2) * 0.1;

        for (let i = 0; i < this.linesNumber; ++i)
        {
            if (i % 2 == 0)
            {
                this.lines[i].anitime = long;
            }
            else
            {
                this.lines[i].anitime = short;
            }
        }
    }

    this.animateLine = () => 
    {
        if (this.animating == false)
        {
            generator.$periodField.prop('disabled', false);
            generator.$singleImpulseButton.prop('disabled', false);
            generator.$playStopButton.prop("disabled", false);
            generator.$playStopButton.text("Старт");

            this.resetAnimation();

            return;
        }

        if (this.curAnimLine % 2 == 0)
        {
            this.switchClk();
        }

        if (this.curAnimLine == 3 || this.curAnimLine == 7 || this.curAnimLine == 11)
        {
            generator.giveImpulse();
        }

        if (this.curAnimLine == 0)
        {
            this.resetAnimation();
            this.resetClk();
        }

        var i = this.curAnimLine;

        this.lines[i].$.show(0);
        this.lines[i].$.animate(this.lines[i].animation, this.lines[i].anitime);
        this.lines[i].animated = true;

        setTimeout(this.animateLine, this.lines[i].anitime);

        this.curAnimLine = (this.curAnimLine + 1) % this.linesNumber;
    }

    this.stopAnimation = () =>
    {
        this.animating = false;
        this.resetClk();
    }

    this.switchClk = () =>
    {
        for (let i = 0; i < channels.length; ++i)
        {
            channels[i].setCLK(channels[i].getCLK() ^ 1);
        }
    }

    this.resetClk = () =>
    {
        for (let i = 0; i < channels.length; ++i)
        {
            channels[i].setCLK(0);
        }
    }

    this.initLines();
    this.resetAnimation();
}