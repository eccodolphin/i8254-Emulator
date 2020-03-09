function RWL() 
{
	// Buttons.
	this.$buttonCS = $('#rwl .cs button');
	this.$buttonA1 = $('#rwl .a1 button');
	this.$buttonA0 = $('#rwl .a0 button');
	this.$buttonRD = $('#rwl .rd button');
	this.$buttonWR = $('#rwl .wr button');

	// Setters.
	this.setCS = (valueCS) => 
	{
		this.$buttonCS.text(valueCS);
	}
	this.setA1 = (valueA1) =>
	{
		this.$buttonA1.text(valueA1);
	}
	this.setA0 = (valueA0) =>
	{
		this.$buttonA0.text(valueA0);
	}
	this.setRD = (valueRD) =>
	{
		this.$buttonRD.text(valueRD);
	}
	this.setWR = (valueWR) =>
	{
		this.$buttonWR.text(valueWR);
	}

	// Getters.
	this.getCS = () =>
	{
		return parseInt(this.$buttonCS.text());
	}
	this.getA1 = () =>
	{
		return parseInt(this.$buttonA1.text());
	}
	this.getA0 = () =>
	{
		return parseInt(this.$buttonA0.text());
	}
	this.getRD = () =>
	{
		return parseInt(this.$buttonRD.text());
	}
	this.getWR = () =>
	{
		return parseInt(this.$buttonWR.text());
	}

	// Clicks.
	this.$buttonCS.click(function()
	{
		rwl.setCS(rwl.getCS() ^ 1);
	});
	this.$buttonA1.click(function()
	{
		rwl.setA1(rwl.getA1() ^ 1);
	});
	this.$buttonA0.click(function()
	{
		var valueA0 = rwl.getA0();
		valueA0 ^= 1;
		rwl.setA0(valueA0);
	});
	this.$buttonRD.click(function()
	{
		rwl.setRD(rwl.getRD() ^ 1);
	});
	this.$buttonWR.click(function()
	{
		var valueWR = rwl.getWR();
		valueWR ^= 1;
		rwl.setWR(valueWR);
	});
}