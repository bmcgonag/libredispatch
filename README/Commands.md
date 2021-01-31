## Setting up Commands in iCAD

### Command Structure

* Command
    Example:
        cmd: DA
        desc: De-assign (unit from call)
        parameters: call sign for unit
        command parameter structure: u/{call sign}

        The 'u/' tells the autotype function what value list to use, and the parser what the information following the '/' is for.
        The curly-brace is the placeholder for what information is expected, and allows the 'tab' key to select that location and either bring up the autotype list of values for the user, or allows the user to start typing without having to space / backspace unnecessarily.

    Example:
        cmd: TR
        desc: Start Transport for a Unit Arrived on a Call
        parameters: u/{call sign} tt/{transport type} tl/{to location / destination} td/{transport description} m/{mileage}

        In the above, the user would simply type ':' to start the command and select TR fromt he list of available commands.
        Then 'tab' and the cursor will move to the first set of curly-braces {} after the 'u/' and bring up the list of units for autotype assistance, and then 'tab', and so on and so forth through each set of curly-braces {} unitl they reach mileage.  Press 'Return' and the command is executed.
