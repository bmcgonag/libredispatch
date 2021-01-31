## Entities in our Context
An Entity can be many things.  A city, state, county, etc., but in most cases it will be a Dispatch center, and the agencies under it.

Each entity has n option for a Parent entity. So think of entities like a family tree of sors.

### Example
GlobalEntity is a top level Parent entity, and therefore shows a Parent of 'none' for itself.

A dispatch center will generally be a Parent Entity, with the potential for multiple entities showing it as a parent.

    Hill Country Metro Dispatch
        Boerne Police Department
        Fair Oaks Ranch Police Department
        Kendall County Sheriff's Office
        Boerne Fire Department
        Kendall County Volunteer Fire Department
        Comfort Volunteer Fire Department
        Boerne EMS
        Kendall County EMS

Above, you'll see multiple Entities, all of which would show Hill Country Metro Dispatch as their parent entity.

If, at any point HCMD was hosted by GlobalEntity and had a nearby Entity dispatch center they wanted to be able to interact with, GlobalEntity Admins could create a new parent and place both HCMD and the other dispatch center under that new Parent Entity, and we can now program in communication capability using that Parent.

### Interoperability
Interoperability has become a mainstream concept in Public Safety, and we are seeing it more and more as local dispatch centers become consolidated centers.  Thinking and planning ahead for seamless interoperability will be a major key to our continued success in the dispatch space.
