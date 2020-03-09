var registers = [];

registers["al"] = {
    type: "child",
    value: "00000000"
}

registers["ah"] = {
    type: "child",
    value: "00000000"
}

registers["ax"] = {
    type: "parent",
    small: "al",
    big: "ah",
}

registers["bl"] = {
    type: "child",
    value: "00000000"
}

registers["bh"] = {
    type: "child",
    value: "00000000"
}

registers["bx"] = {
    type: "parent",
    small: "bl",
    big: "bh",
}

registers["cl"] = {
    type: "child",
    value: "00000000"
}

registers["ch"] = {
    type: "child",
    value: "00000000"
}

registers["cx"] = {
    type: "parent",
    small: "cl",
    big: "ch",
}

registers["dl"] = {
    type: "child",
    value: "00000000"
}

registers["dh"] = {
    type: "child",
    value: "00000000"
}

registers["dx"] = {
    type: "parent",
    small: "dl",
    big: "dh",
}

function ParentToParent(parentToName, parentFromName)
{
    var parentFromDoubleWord = getParentDoubleWord(parentFromName);
    DoubleWordToParent(parentToName, parentFromDoubleWord);
}

function DoubleWordToParent(parentName, doubleWord)
{
    var smallWord = doubleWord.substr(8, 8);
    var smallChildName = registers[parentName].small;
    WordToChild(smallChildName, smallWord);

    var bigWord = doubleWord.substr(0, 8);
    var bigChildName = registers[parentName].big;
    WordToChild(bigChildName, bigWord);
}

function ChildToChild(childToName, childFromName)
{
    var childFromWord = getChildWord(childFromName);
    WordToChild(childToName, childFromWord);
}

function WordToChild(childName, childWord)
{
    registers[childName].value = childWord;
}

function getParentDoubleWord(parentName)
{
    var smallName = registers[parentName].small;
    var smallValue = registers[smallName].value;

    var bigName = registers[parentName].big;
    var bigValue = registers[bigName].value;

    var parentValue = bigValue + smallValue;
    return parentValue;
}

function getChildWord(childName)
{
    var childValue = registers[childName].value;
    return childValue;
}

function getAL()
{
    return registers["al"].value;
}

function setAL(alValue)
{
    if (alValue == undefined) return;
    registers["al"].value = alValue;
}