# CallSheets

## NOTICE

This repository has not been updated in a while. I'll be working to update it and the dependencies it has, but as of now, while the push looks recent, I have simply recently moved it into github.  Please don't grab this thinking it will run properly.  Thank you.

## Developer Install

Using this project and running it

1. Install MeteorJS from https://www.meteor.com/install
    - Windows has an installer
    - Mac and Linux use a 1-liner in the terminal

2. Install NodeJS 8.11.4 and NPM from https://nodejs.org/en/download/
    - there are other ways to get it as well, but this should work.
    - NVM is another nice way to get it and update it (<-- highly recommend this method).

3. clone this repo

4. in the Command Line on Windows / Terminal on OS X go to the folder created by cloning / pulling this repo (hint: CallSheets)

5. run the command `meteor` (don't put ticks, that's just for markup)

6. You'll likely get some error messages in the terminal.  If you look up a few lines there will be instructions for a command to install "babel".  Run that command in your terminal.  If meteor hasn't stopped, then use CTRL+C to kill it, and then run the command.
    - `meteor npm install @babel/runtime@7.0.0-beta.55` if you have issues installing the latest ( `meteor npm install @babel/runtime` )

7. Additionally, run this command:

    `meteor npm install`  (again, no tickmarks)

    this should install any npm libraries you need.

8. Now run the `meteor` command again, and it should run fine.

After this initial setup, you only need to run meteor to start the project anytime you want to run it.

Meteor is cool because if you leave it running, as you make changes to the code, it updates your web view live, and you see your changes or errors right away.

## When the project is running

You should see something like this in the terminal

[[[[[ ~/scripts/CallSheets ]]]]]              

    => Started proxy.                             
    => Started MongoDB.                           
    => Started your app.                          

    => App running at: http://localhost:3000/

#### Create an Account
Use the 'Sign-in' button in the upper left to access the 'Sign-in' option.

Click the 'Register' link on the Modal window that comes up, and fill it in.

Right off you'll be directed to the Startup Wizard (under construction still, but needs some testing), but you won't be able to create an Entity until you register and are logged in.

Once logged in, Create at least 1 Entity.  I usually make it something like 'Global'.

I've been adding things trying to keep multi-tenancy (hosted) capabilities in mind.

After the Wizard is done, you can use the 'Actions' to go to Administration

### Administration
Here you can start your system setup....and yes, I'd really prefer to have imports for everything, but haven't done it yet.

There are two administrative setup areas.  As a Global administrator, you'll see the Global Admin area which is where you can setup items for the entire system shared across all tenants.  This includes Command Line Commands, and Context menu items (i want those to be more on the fly than they are, but it's a start).  Next, is the Admin (local Admin / Entity Admin) area.  This is administrative setup that can differ between parent entities, and in some cases child entities (tenants).

After you complete most of the setup items,

you should be able to move to the Calls View and add a call by using the New Call option in the top bar. If you don't see a map, and some basic areas on the view, you need to setup the 'My Settings' areas real quick for your user.  I'm working on setting those up default on first sign up, but not there yet.

Call Location, Call Type, you can add other stuff, but when I bring it back, I only bring back some base stubs as well.
You can add notes, and so on.

## Setting up Units
I define Unit Types and SubTypes a little differently in this CAD.

Types are Globally Defined by the Global Admin.  Sub-Types are more like an agency (Police, Fire, City Water, Bob's Wrecker, etc.), then we have Divisions - and those are more like our current SubType.

Think of a Division as a job, role, or capability.  For instance:

Police may have Divisions of:  Patrol, Traffic, K-9 (with a secondary Division of Patrol), Investigations, Narcotics, Admin, etc.
Fire may have Divisions of: Engine, Ladder (with secondary of Engine), Pumper, Brush, Scout, Admin, Rescue, etc.
EMS may have Divisions of: Scout, Rescue, etc.

and so on.

Once these are setup, you can start adding Service Units.

### Service Units
Service Units are pretty much our Units in CAD today.  Assigned a Call Sign, Entity, Type, Sub-Type, Division, Secondary Division, and so on.

So BGM may be a Ladder with secondary Division of Engine, and belongs to Fire Type, and City Fire Sub-Type.

Once you've added Service Units, you can now go to OMV (One Monitor View) Dispatch, and see the units on the left, and Calls you've created on the right by default.  Notes, and map are displayed above the calls view grid.  You can change these in the My Settings view as you like.

You can drag units onto calls to assign them, and double click units on calls to put them through EnRoute and Arrive.

You can right click to DeAssign and Clear units, and I'm adding more little by little.  

If you want to try the 'Smart Bar', use the CTRL+Spacebar combo, then type a ":" to see a list of commands.  Tab to select the highlighted item.  

Click a call to expand it and see the unit detail for assignments.

## Map
I have a map on the Dispatch view, and the Mobile View.  They both plot calls, but when a call is added, I may need to work on the mobile view for that part.  Not sure if I just saw a glitch.  

The map is leaflet, and does pretty well.  I made a little set of functions that will geo-code the address string when added for a Call, and also a way to "bulk geo-code" (really 1 at a time) all of the valid addresses, so the coordinates are stored in the db.  Works okay, but could use some work.

## Mobile View
This is styled with a card list of calls, and the map.  The card list is touch / scroll friendly, and when touched the call card expands,a dn shows notes, units assigned, and eventually alert info after that's added.

The information in the system all updates int he background on it's own, and uses Pub / Sub to a Mongo DB. 

I have a very simple chat, but it needs some work.  I also have a bit of config to setup on the Unit List info in Dispatch, as well as some config to ffer in the calls list in dispatch.  I'd like to make the Ntoes area a tabbed area where the user can setup some more detailed tabs as well. 

Need to add Subjects, Vehicles, Callers, etc to Calls, and so on.  For now this works well, and I keep some history of what's happened in the Mongo db. 

I want to add a nice NCIC interface, and 911 interface, with video capability, photo retrieval, and location retrieval so it's more map-centric.

It's a solid start, but there's plenty to be done....

## Testing
I have started adding unit tests to my `imports/api/` methods. 

You can see a sample in the `imports/api/alertSeverity.test.js` file.

It's a simple unit test, but it works. I'll be adding more as we go.

To run the unit test use the command

`meteor test --once --driver-package meteortesting:mocha --port 3100`

This will run the test(s) once, and not affect the main app, and will print the results to the console.  You can bring upt the result page in a browser, but you can't with just --once in the command, and then it runs the tests multiple times, and gives errors that make no sense.
