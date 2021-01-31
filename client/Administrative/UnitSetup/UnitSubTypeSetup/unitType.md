## Unit Type Setup

### UnitTypes Defined
Unit type is a main category defining a unit's base function. Unit types utilized in this system are as follows:
 1. Law
 2. Fire
 3. EMS
 4. Animal Control
 5. State (excluding State Law, Fire, or EMS)
 6. County (excluding County Law, Fire, or EMS)
 7. City / Municipal (excluding City Law, Fire, or EMS)
 8. Wreckers / Tow Companies
 9. Funeral Home
 10. other

 ### Unit Sub-types
 For each Unit type, a sub-type, or several sub-types can be defined. For instance, the Sub-types for Law might be

 - Law
   - City Police
   - County Sheriff
   - State Patrol
   - Metropolitan Police

And so on for each type defined above. For each subtype, we will allow a user to define a color code, and icon to represent that unit sub-type in different views.

#### Unit Sub-type Divisions
A division, is a group of units with similar purpose within an agency. Each Sub-type can have multiple Divisions under it. For example:

 - Law
   - State Patrol
      - Traffic
      - Patrol
      - License and Weight
      - Administration
      - Warrant Service

Each Division will share the same Sub-type color and icon as defined by the end user.

## Assignment of Unit Types, Sub-types, and Divisions
Each Dispatch Center must give a Type, Sub-type, and Division for each unit they create. Note, that a Unit can have only 1 (one) Type and 1 (one) Sub-type, but can be assigned job roles as part of multiple Divisions.  For instance:

A Dispatch Center may define the following for it's Fire type:

 - Fire
   - City Fire Dept.
     - Divisions
        - Scout
        - Pumper
        - Engine
        - Ladder
        - Brush
        - Command
   - County Fire Dept.
        - Scout
        - Pumper
        - Engine
        - Ladder
        - Brush
        - Command
   - VFD (Volunteer Fire Dept.)
        - Scout
        - Pumper
        - Engine
        - Ladder
        - Brush
        - Command

When this dispatch center later defines a unit, they can assign it to Fire, a Sub-type, and multiple divisions, for example:

    Unit:
        Fire21
            Type: Fire
            Sub-type: City Fire Dept.
                Division:
                    *Ladder*
                    Engine
                    Pumper

Where Ladder is the primary division / purpose of the unit, but it can act as an Engine or Pumper if needed.
