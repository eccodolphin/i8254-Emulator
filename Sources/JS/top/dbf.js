function DBF()
{
    // Byte (field, getter and setter).
    this.$byteField = $('#dbf .byte');

    this.setByte = (byteValue) =>
    {
        this.$byteField.prop('value', byteValue);
    }
    this.getByte = () =>
    {
        return this.$byteField.prop('value');
    }

    // Buttons.
    this.$readButton = $('#dbf .read');
    this.$writeButton = $('#dbf .write');



    // --- Clicks. --- //

    this.$readButton.click(function() // Read button click.
    {
        // Checks.
        if (rwl.getCS() == 1)
        {
            alert('Чтение запрещено: CS = 1.');
            return;
        }
        if (rwl.getRD() == 1)
        {
            alert('Чтение запрещено: RD = 1.');
            return;
        }
        if (rwl.getRD() == 0 && rwl.getWR() == 0)
        {
            alert('Чтение запрещено: RD = WR = 0.');
            return;
        }

        // Addressing.
        if (rwl.getA1() == 0 && rwl.getA0() == 0)
        {
            dbf.setByte(channels[0].getByte());
        }
        else if (rwl.getA1() == 0 && rwl.getA0() == 1)
        {
            dbf.setByte(channels[1].getByte());
        }
        else if (rwl.getA1() == 1 && rwl.getA0() == 0)
        {
            dbf.setByte(channels[2].getByte());
        }
        else if (rwl.getA1() == 1 && rwl.getA0() == 1)
        {
            alert('Чтение из РУС запрещено.');
            return;
        }
    });

    this.$writeButton.click(function() // Write button click.
    {
        // Checks.
        if (rwl.getCS() == 1)
        {
            alert('Запись запрещена: CS = 1.');
            return;
        }
        if (rwl.getWR() == 1)
        {
            alert('Запись запрещена: WR = 1.');
            return;
        }
        if (rwl.getWR() == 0 && rwl.getRD() == 0)
        {
            alert('Запись запрещена: WR = RD = 0.');
            return;
        }

        // Addressing.
        if (rwl.getA1() == 0 && rwl.getA0() == 0)
        {
            channels[0].setByte(dbf.getByte());
        }
        else if (rwl.getA1() == 0 && rwl.getA0() == 1)
        {
            channels[1].setByte(dbf.getByte());
        }
        else if (rwl.getA1() == 1 && rwl.getA0() == 0)
        {
            channels[2].setByte(dbf.getByte());
        }
        else if (rwl.getA1() == 1 && rwl.getA0() == 1)
        {
            cwr.setControlWord(dbf.getByte());
        }
    });

    // --- //
}