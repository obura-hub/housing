# Housing Project Management

**Document ID:** BP-HSG-001
**Version:** 0.1
**Status:** Draft
**Process Owner:** Housing Administration
**Last Updated:** 12 August 2026

---

## 1. Purpose

This process defines how housing projects are created, maintained, prepared for publication, and made available to staff through the Housing Platform.

The process establishes the business requirements for managing housing project information and housing inventory.

---

## 2. Scope

This process covers:

* Creation of a housing project
* Maintenance of project information
* Definition of blocks
* Definition of floors
* Definition of housing unit types
* Definition of individual housing units
* Addition of project amenities
* Addition of project images and other media
* Preparation of project information for publication
* Publication of project information to staff


---

## 3. Actors

| Actor                 | Responsibility                                            |
| --------------------- | --------------------------------------------------------- |
| Housing Administrator | Creates and maintains housing project information         |
| System Administrator  | Manages system access and technical configuration         |
| Staff                 | Views published housing projects                          |
| Housing Management    | Owns/approves project information — confirmation required |

> **Note:** The exact approval authority for publishing a project has not yet been formally defined.

---

## 4. Preconditions

A project may be created when the organization has decided that the project should be represented in the Housing Platform.

The administrator must have the required authorization to create or maintain housing project information.

---

## 5. Process Overview

The project management process follows the general lifecycle:

```text
Create Project
      ↓
Add Project Information
      ↓
Define Housing Structure
      ↓
Define Unit Types
      ↓
Define Individual Units
      ↓
Add Media & Amenities
      ↓
Review Information
      ↓
Publish Project
      ↓
Project Available to Staff
```

The approval step for publication is currently **TBD**.

---

## 6. Detailed Process

### 6.1 Create Project

The Housing Administrator creates a project in the Housing Platform.

The following information captured:

* Project name
* Location
* Address
* Description
* Long description
* Developer
* Expected completion date
* Contact information
* Project status

### Expected outcome

A project record exists in the system and is initially not available to staff until it has been published.

### Business rule

A project that has not been published must not appear in the staff-facing housing catalogue.

**Status:** Confirmed / pending formal stakeholder approval.

---

### 6.2 Define Project Structure

The administrator defines the physical structure of the project.

The structure consists of:

```text
Project
   ↓
Block
   ↓
Floor
   ↓
Unit
```

A project may contain one or more blocks.

A block may contain one or more floors.

A floor may contain one or more housing units.

The physical structure components may contain:

* Name
* Description
* Images
* Model or visualization


---

### 6.3 Define Unit Types

The administrator defines the types of housing units available within the project.

Examples include:

* Studio
* One bedroom
* Two bedroom
* Three bedroom

The unit type may contain:

* Unit type name
* Size
* Number of bedrooms
* Number of bathrooms
* Description
* Images
* Floor plan
* Model or visualization
* Price

The final pricing rules are documented separately.

---

### 6.4 Define Individual Units

Individual physical units are created under a floor.

Each unit should have a unique identifier/number within the project.

Example:

```text
Project: Example Housing Estate

Block A
    Floor 1
        A101
        A102
        A103

    Floor 2
        A201
        A202
        A203
```

Each unit is associated with a unit type.

Example:

```text
A101 → Three Bedroom
A102 → Three Bedroom
A103 → Two Bedroom
```

---

### 6.5 Add Project Information and Media

The administrator may add information used by staff when evaluating a project.

This may include:

* Project photographs
* Project plans
* Floor plans
* 3D models
* Project description
* Amenities
* Location information


Media storage and management are governed by the system's media management rules.

---

### 6.6 Review Project

Before publication, the administrator reviews:

* Project information
* Project structure
* Unit types
* Units
* Prices
* Availability information
* Images
* Amenities


The exact business approval process is currently **TBD**.

---

### 6.7 Publish Project

Once the project has satisfied the organization's publication requirements, it is made available to staff.

A published project becomes visible through the staff-facing housing portal.

The mechanism and authority for approving publication require formal confirmation **TBD**.

---

## 7. Business Rules

| ID          | Rule                                                                                           | Status    |
| ----------- | ---------------------------------------------------------------------------------------------- | --------- |
| BR-PROJ-001 | A project must have a name before it can be published.                                         | Confirmed |
| BR-PROJ-002 | A project must have at least one housing unit before being presented as available for booking. | Proposed  |
| BR-PROJ-003 | Only published projects are visible to staff.                                                  | Confirmed |
| BR-PROJ-004 | A unit must belong to a floor.                                                                 | Confirmed |
| BR-PROJ-005 | A floor must belong to a block.                                                                | Confirmed |
| BR-PROJ-006 | A block must belong to a project.                                                              | Confirmed |
| BR-PROJ-007 | Each unit must have a unit type.                                                               | Confirmed |
| BR-PROJ-008 | The authority responsible for project publication must be defined.                             | Open      |

---

## 8. Proposed Process States

### Project

```text
DRAFT
   ↓
REVIEW
   ↓
PUBLISHED
   ↓
UNPUBLISHED
   ↓
ARCHIVED
```

**Important:** The exact states and transitions are proposed and require stakeholder confirmation.



---

## 9. Exceptions and Alternative Paths

### Project information requires correction

If a published project contains incorrect information, an authorized administrator should be able to correct the information.

The effect of changes to published prices, unit availability, or other commercially significant information requires further business definition.

### Project is no longer available

The project may be removed from the staff-facing portal without necessarily deleting its historical information.

The exact archival rules are TBD.

---

## 10. Inputs

Typical inputs include:

* Project information
* Construction/project information
* Block information
* Floor information
* Unit type information
* Unit information
* Pricing information
* Images
* Floor plans
* 3D models
* Amenities
* Supporting documents

---

## 11. Outputs

The process produces:

* A housing project record
* A structured housing inventory
* Published project information
* Published unit type information
* Published unit availability information

---

## 12. Audit Requirements

The system should record significant administrative changes, including:

* Project creation
* Project modification
* Unit/Block/Floor creation
* Unit/Block/Floor modification
* Price modification
* Publication/unpublication
* Media changes

The retention period and exact audit requirements are TBD.

---

## 13. Assumptions

The following assumptions are currently being used to support development:

1. Housing administrators are responsible for entering project information.
2. The database is the authoritative source for housing project information.
3. Images and other media are stored separately from the database while their metadata is associated with the relevant housing entity.
4. The staff-facing website and staff portal consume the same project information.

These assumptions require confirmation where they represent organizational policy rather than technical implementation.

---

## 14. Open Questions

| ID          | Question                                                                                     | Owner              | Status |
| ----------- | -------------------------------------------------------------------------------------------- | ------------------ | ------ |
| OQ-PROJ-001 | What are the minimum requirements needed for a project to be published?                      | Housing Management | Open   |
| OQ-PROJ-002 | Who approves a project before publication?                                                   | Housing Management | Open   |
| OQ-PROJ-003 | Can a project be published before construction is complete?                                  | Housing Management | Open   |
| OQ-PROJ-004 | Who can change published prices?                                                             | Housing/Finance    | Open   |
| OQ-PROJ-005 | Do price changes require approval?                                                           | Housing/Finance    | Open   |
| OQ-PROJ-006 | What happens to a project after all units are sold?                                          | Housing Management | Open   |
| OQ-PROJ-007 | How long should archived project information remain accessible?                              | Housing Management | Open   |

---

## 15. Acceptance Criteria

The process is considered implemented when:

* An authorized administrator can create a housing project.
* The administrator can define blocks and floors.
* The administrator can define unit types.
* The administrator can define individual units.
* Units can be associated with unit types.
* Project/Block/Floor/Unit type media can be associated with the project.
* Project amenities can be managed.
* A project can be prepared for publication.
* Staff cannot see unpublished projects.
* Published project information is available to the staff-facing application.
* Significant administrative changes are auditable.

Items marked as pending business decisions must not be treated as final requirements until approved.

---

## 16. Related Processes

* Staff Housing Discovery
* Unit Booking / Reservation
* Payment
* Application and Approval
* Unit Allocation and Handover

---

## 17. Change History

| Version | Date        | Change        | Author           |
| ------- | ----------- | ------------- | ---------------- |
| 0.1     | 12 Aug 2026 | Initial draft | Development Team |
