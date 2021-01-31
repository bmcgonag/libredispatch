## Call Sheet Fields (developeer)

### Fields and their ids
for development purposes

### Call Sheet Form
#### Header / Non-entry
* Call Date / Time:     callDateTime
* Call Number:          callNumber
* Quick Call Number:    quickCallNumber
* Call Status:          callStatus

#### Call Body - Upper
* Call Location:        callLocation
* Call Type:            callType (single select / code list created by agency)
* Cross Streets:        crossStreets
* Latitude, Longitude   lat-lon
* How Call Received:    howRecvd (static select)
* Call Prioirty:        callPriority (linked to call Type - but can be manually changed)
* Submit button:        _class_ saveCall

#### Call Body - Tabs
##### Notes
* Notes Entry           notesEntry
* Notes Submit Button   _class_ addNote

##### Callers
* Caller Name           callerName
* Caller Phone          callerTelephone
* Make Contact          makeContact
* Caller Address        callerAddress
* Caller Submit Button  _class_ addCaller
* Caller Table          callers

##### Vehicles
* License Plate No      licPlateNo
* License Plate State   licPlateState
* Vehicle Make          makeInput
* Vehicle Model         modelInput (driven by make when used)
* Vehicle Style         styleInput
* Vehicle Color(s)      vehColorInput
* Vehicle VIN           vehVIN
* Year Model            vehMakeYr
