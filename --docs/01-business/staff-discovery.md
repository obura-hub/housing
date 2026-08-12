# Staff Housing Discovery and Unit Selection

**Document ID:** BP-HSG-002
**Version:** 0.1
**Status:** Draft
**Process Owner:** Housing Management
**Last Updated:** 12 August 2026

---

## 1. Purpose

This process defines how an eligible staff member discovers housing projects, evaluates available housing options, and selects a housing unit through the Housing Platform.

The process ends when the staff member initiates a booking/reservation for a selected unit.

The activities that occur after booking are documented separately and are currently subject to further business definition.

---

## 2. Scope

This process covers:

* Accessing the housing portal
* Viewing available housing projects
* Viewing project information
* Viewing housing types
* Viewing unit information
* Checking unit availability
* Selecting a unit
* Initiating a booking

This process does not currently define:

* Application approval
* Payment approval
* Purchase agreements
* Unit allocation
* Property handover

---

## 3. Actor

### Primary Actor

**Staff Member**

The staff member uses the Housing Platform to identify a suitable housing unit.

### Supporting Actors

Currently none formally identified.

Potential supporting actors may be identified as the booking and purchase process is defined.

---

## 4. Preconditions

The following conditions are assumed:

1. The staff member can access the Housing Platform.
2. Housing projects have been created by an authorized administrator.
3. Projects intended for staff viewing have been published.
4. Housing units have been configured.
5. Unit availability information is available.

The eligibility requirements for staff participation in the housing programme are not yet formally documented.

---

## 5. Process Overview

```text
Access Housing Platform
          ↓
View Housing Projects
          ↓
Select Project
          ↓
Review Project details
          ↓
Select Block
          ↓
Review Block details
          ↓
Select Floor
          ↓
Review Floor details
          ↓
View Housing Types
          ↓
View Available Units
          ↓
Select Unit
          ↓
Review Unit
          ↓
Initiate Booking
          ↓
[BOOKING PROCESS]
```

The detailed booking lifecycle is maintained separately.

---

# 6. Detailed Process

## 6.1 Access Housing Platform

The staff member accesses the Housing Platform.

The platform identifies the staff member where authentication is required. **TBD**.

### Expected outcome

The staff member can access the housing catalogue available to them.

### Open question

The exact eligibility requirements for accessing formally defined.

---

## 6.2 View Housing Projects

The staff member views housing projects currently available through the platform.

The system should present sufficient information to allow the staff member to identify projects of interest.

Potential information includes:

* Project name
* Location
* Description
* Project images
* Completion information
* Available housing types
* Availability indicators

### Business rule

Only projects intended to be visible to staff should appear in the staff housing catalogue.

---

## 6.3 Select a Project

The staff member selects a project to view additional information.

### Expected outcome

The system displays detailed information about the selected project.

---

## 6.4 Review Project

The staff member reviews information about the project before considering an individual housing unit.

Information may include:

* Project description
* Location
* Address
* Images
* Amenities
* Completion information
* Housing unit types
* Availability
* Pricing information

The exact mandatory information to be displayed is subject to confirmation.

---

## 6.5 Browse Housing Types

The staff member views the housing types available within the project.

Examples:

```text
Studio
1 Bedroom
2 Bedroom
3 Bedroom
```

A housing type may include:

* Type/name
* Size
* Bedrooms
* Bathrooms
* Price
* Images
* Floor plan
* Features

### Business rule

The information displayed for a housing type must represent the current information published by the housing administrator.

---

## 6.6 View Individual Units

The staff member may view individual units belonging to a housing type.

Example:

```text
3 Bedroom

A101 — Available
A102 — Available
A103 — Reserved
A104 — Sold
```

The platform should indicate whether the unit is currently available for selection.

### Business rule

A unit that is not available must not be selectable for a new booking.

---

## 6.7 Select Unit

The staff member selects an available unit.

The system displays sufficient information for the staff member to confirm that the selected unit is the intended unit.

Information may include:

* Unit number
* Unit type
* Floor
* Block
* Size
* Price
* Relevant images/floor plan
* Availability

---

## 6.8 Initiate Booking

The staff member chooses to proceed with the selected unit.

The system initiates the booking process.

### Process boundary

At this point, the Staff Housing Discovery and Unit Selection process ends.

The subsequent process must determine:

* Whether staff verification can be done here before reservation/booking
* Whether the action constitutes a reservation or application
* Whether the unit is temporarily held
* Whether payment is required
* Whether approval is required
* The duration of the booking
* What happens if the staff member does not complete the next step

These matters are currently **TBD**.

---

# 7. Main Success Path

```text
1. Staff accesses Housing Platform.
2. Staff views available projects.
3. Staff selects a project.
4. Staff reviews project information.
5. Staff views available housing types.
6. Staff selects a housing type.
7. Staff views available units.
8. Staff selects an available unit.
9. Staff reviews the selected unit.
10. Staff initiates booking.
11. System transfers the staff member into the booking process.
```

---

# 8. Alternative Paths

## 8.1 No projects available

If no projects are currently available:

```text
Staff
  ↓
Housing Catalogue
  ↓
No available projects
```

The system should communicate that there are currently no available housing projects.

The exact wording is a UI decision and is not prescribed by this process.

---

## 8.2 Selected unit becomes unavailable

A unit may become unavailable between the time the staff member views it and attempts to book it.

The system must prevent the staff member from completing a booking for a unit that is no longer available.

The exact concurrency/holding mechanism is an implementation concern.

---

## 8.3 Project is unpublished

If a project is unpublished after the staff member has previously viewed it, the project should no longer be presented as available to new users.

The effect on an existing booking/reservation is defined by the booking process.

---

# 9. Business Rules

| ID          | Rule                                                                                         | Status                           |
| ----------- | -------------------------------------------------------------------------------------------- | -------------------------------- |
| BR-DISC-001 | Staff can view published housing projects.                                                   | Confirmed                        |
| BR-DISC-002 | Staff can view housing information associated with a published project.                      | Confirmed                        |
| BR-DISC-003 | Staff can view available housing units.                                                      | Confirmed                        |
| BR-DISC-004 | Staff cannot initiate a new booking for an unavailable unit.                                 | Confirmed                        |
| BR-DISC-005 | Unit availability must be checked when booking is initiated.                                 | Proposed                         |
| BR-DISC-006 | A unit selected by one staff member cannot be simultaneously booked by another staff member. | Proposed — requires confirmation |
| BR-DISC-007 | Staff eligibility requirements for purchasing a unit must be defined.                        | Open                             |

---

# 10. Information Required

The following information is required to support the discovery process.

### Project

* Project name
* Location
* Description
* Images
* Amenities
* Completion information

### Housing Type

* Type
* Size
* Bedrooms
* Bathrooms
* Price
* Images/floor plans


### Block/Floors

* Name
* Number
* Description
* Images/plans

### Unit

* Unit number
* Block
* Floor
* Unit type
* Availability
* Price, where applicable

---

# 11. Process States

The discovery process itself is not a transaction and therefore does not require a persistent state for every browsing action.

The important business state is the availability of the housing unit.

The following unit states are currently recognized:

```text
AVAILABLE
UNAVAILABLE
```

More detailed inventory states may be introduced by the reservation process.

---

# 12. Exceptions

### Unit becomes unavailable

If the selected unit becomes unavailable before booking is completed, the booking attempt must not proceed as though the unit were still available.

### Project becomes unavailable

If the project is no longer published/available, the staff member should not be allowed to initiate a new booking from that project.

### Incomplete project information

If required information has not been provided by the administrator, the project should not be published as ready for staff discovery until the publication requirements are satisfied.

---

# 13. Assumptions

The following assumptions support the current implementation:

1. Staff access the platform to discover housing opportunities.
2. Housing projects are configured by authorized administrators.
3. The same housing information may be consumed by both the staff portal and public/marketing presentation.
4. Unit availability is maintained by the housing system.
5. Booking is the transition point from discovery into a separate transactional process.

---

# 14. Open Questions

| ID          | Question                                                           | Owner              | Status |
| ----------- | ------------------------------------------------------------------ | ------------------ | ------ |
| OQ-DISC-001 | Who is eligible to purchase a housing unit?                        | Housing Management | Open   |
| OQ-DISC-002 | Is authentication required before viewing projects?                | Housing Management | Open   |
| OQ-DISC-003 | Is a unit temporarily held when selected?                          | Housing Management | Open   |
| OQ-DISC-004 | What exactly constitutes a booking?                                | Housing Management | Open   |
| OQ-DISC-005 | Can a staff member select multiple units?                          | Housing Management | Open   |
| OQ-DISC-006 | What happens when two staff members attempt to book the same unit? | Housing Management | Open   |
| OQ-DISC-007 | Is payment required immediately after booking?                     | Housing/Finance    | Open   |

---

# 15. Acceptance Criteria

The process is considered implemented when:

* Staff can access the housing catalogue.
* Staff can view available housing projects.
* Staff can view project information.
* Staff can view available housing structure.
* Staff can view available housing types.
* Staff can view individual available units.
* Staff can view sufficient information about a selected unit.
* Staff cannot initiate a new booking against an unavailable unit.
* The system transfers the staff member from unit selection into the defined booking process.

---

# 16. Related Processes

* Housing Project Management
* Unit Booking / Reservation
* Application and Approval
* Payment
* Unit Allocation and Handover

---

# 17. Change History

| Version | Date        | Change                   | Author           |
| ------- | ----------- | ------------------------ | ---------------- |
| 0.1     | 12 Aug 2026 | Initial process baseline | Development Team |
