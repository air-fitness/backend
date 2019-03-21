# airfitness API

## Introduction

## Table of Contents

- [Installation](#Installation)

* [API URL](#api-url)
* [Data set](#DATA-SET)
* [SCHEMA](#SCHEMA)
* [Test accounts](#Test-Accounts)
* [API endpoints](#API-ENDPOINTS)

- [Auth routes](#AUTH-ROUTES)
  - [Register](#REGISTER)
  - [Login](#Login)
- [Users routes](#user-routes)
  - [Get all users](#Get-all-users)
- [Instructors routes](#user-routes)
  - [Get all instructors](#Get-all-instructors)
  - [Get instrcutor by ID](#Get-instructor-by-id)
- [Classes routes](#classes-routes)
  - [Get all classes](#get-all-classes)
  - [Get classes by ID](#get-classes-by-id)

---

# Overview

This repository holds all back-end files and resources for the airfitness application and its readme documentation. This repository was made during Lambda School's build week where students join a team that consists other students from different cohorts. Each cohort is responsible for either UI, Front End, Back End, or leading the team. This repository is for the Backend.

---

## API URL

https://air-fitness-backend.herokuapp.com

[Back to Table of Contents](#table-of-contents)

---

## Installation

Fork/Clone the repository. In the same directory as the package.json, in your terminal:

```
yarn install
```

This is to install all needed packages. To start the server, in your terminal, type:

```
yarn server
```

To test the repository:

```
yarn test
```

[Back to Table of Contents](#table-of-contents)

---

## SCHEMA

`users`

```
{
  "id": 1,                        // Integer [Primary key]
  "first_name": "first",          // String  [Required]
  "last_name": "last",            // String  [Required]
  "email": "email@email.com"      // String  [Required, Unique]
  "password": "password"          // String  [Required]
  "username": "username"          // String  [Required, Unique]

}
```

`instructors`

```
{
  "instructor_id": 1,                              // Integer [Primary Key]
  "user_id": 2,                                    // Integer [Foreign Key]
  "paypal_id": "mypaypal,                          // String
}
```

`classes`

```
{
  "class_id": 1,                                      // Integer [Primary key]
  "category_id": 1,                                   // Integer [Foreign key]
  "instructor_id": 1                                  // Integer [Foreign Key]
  "start_time": "2015-03-25T12:00:00Z"                // Date    [Required]
  "duration": 9,                                      // Integer [Required, Unsigned]
  "location": Pointe Park                             // String
  "class_name": "Claire's Cardio"                     // Integer
}
```

[Back to Table of Contents](#table-of-contents)
