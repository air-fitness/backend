# airfitness API

## Introduction

## Table of Contents

- [Installation](#Installation)

* [API URL](#api-url)
* [Data set](#DATA-SET)
* [SCHEMA](#SCHEMA)
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
  "user_id": 1,                   // Integer [Primary key]
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
  "instructor_id": 1,                   // Integer [Primary Key]
  "user_id": 2,                         // Integer [Foreign Key -> users.user_id]
  "paypal_id": "mypaypal,               // String
}
```

`categories`

```
{
  "category_id": 1,                     // Integer [Primary Key]
  "category_name": 2,                   // String [128 Char, Required]
}
```

`classes`

```
{
  "class_id": 1,                              // Integer [Primary key]
  "category_id": 1,                           // Integer [Foreign key -> categories.category_id]
  "instructor_id": 1                          // Integer [Foreign Key]
  "duration": 90,                             // Integer [Required, Unsigned]
  "class_name": "Claire's Cardio"             // String
}
```

`punch_card`

```
{
  "user_id": 1,                                    // Integer [Foreign key -> users.uder_id]
  "class_id": 1,                                   // Integer [Foreign key -> classes.class_id]
  "punch_count": 10                                // Integer [Integer, Unsigned, Required, Defaults to 10]
}
```

`class_times`

```
{
  "class_time_id": 1,                              // Integer [Primary key]
  "class_id": 1,                           // Integer [Foreign key -> classes.class_id]
  "start_time": 1                          // Datetime [Required]
  "end_time": 90,                             // Integer [Required, Unsigned]
  "location": "Park Place"             // String [Required]
}
```

`attendees`

```
{
  "class_time_id": 1,                     // Integer [Foreign Key -> class_times.class_time_id]
  "user_id": 2,                   // Integer [Foreign Key -> users.user_id]
  ** Unique constraint on user_id and class_time_id **
}


[Back to Table of Contents](#table-of-contents)
---



# AUTH ROUTES

## **REGISTER**
### **Registers a user**

*Method Url:* `api/auth/register`


*HTTP method:* **[POST]**

#### Headers

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `Content-Type` | String | Yes      | Must be application/json |

#### Body

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `first_name`   | String | Yes      |                          |
| `last_name`    | String | Yes      |                          |
| `username`     | String | Yes      | Must be unique           |
| `email`        | String | Yes      | Must be unique           |
| `password`     | String | Yes      |                          |

*example:*

```

{
first_name: "josh",
last_name: "armantrout"
username: "josharmantrout",
password: "password",
email: "trout@email.com"
}

```

#### Response

##### 200 (OK)
>If you successfully register a user the endpoint will return an HTTP response with a status code `200` and a body as below.
```

{
"message" : "Welcome to Airfitness, username!"
}

```
##### 400 (Bad Request)
>If you send in invalid fields, the endpoint will return an HTTP response with a status code `400` and a body as below.
```

{
"error": true,
"message": "There was a problem with your request."
}

```
[Back to Table of Contents](#table-of-contents)
____

## **LOGIN**
### **Logs a user in**

*Method Url:* `api/auth/login`

*HTTP method:* **[POST]**

#### Headers

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `Content-Type` | String | Yes      | Must be application/json |

#### Body

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `username`        | String | Yes      | Must match a username in the database |
| `password`     | String | Yes      | Must match a password in the database corresponding to above email |

*example:*

```

{
username: "ceciljohn",
password: "password"
}

```

#### Response

##### 200 (OK)
>If you successfully login, the endpoint will return an HTTP response with a status code `200` and a body as below.
```

{
"message": "Welcome josharmantrout!",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ0MzM1NjUxLCJleHAiOjE1NzU4OTMyNTF9.uqd2OHBYkGQpwjLTPPiPWYkYOKlG7whQDFkk46xGXoE"
}

```
##### 400 (Bad Request)
>If you send in invalid fields or the passwords do not match, the endpoint will return an HTTP response with a status code `400` and a body as below.
```

{
"error": true,
"message": "There was a problem with your request."
}

```
##### 404 (Not Found)
>If you send in an email address that does not match one in the database, the endpoint will return an HTTP response with a status code `404` and a body as below.
```

{
"error": true,
"message": "The requested content does not exist."
}

```

[Back to Table of Contents](#table-of-contents)
___
```
