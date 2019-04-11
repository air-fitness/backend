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
- [Instructors routes](#instructors-routes)
  - [Get all instructors](#Get-all-instructors)
  - [Get instructor by ID](#Get-instructor-by-id)
  - [Get instructor tools](#instructor-tools)
- [Classes routes](#classes-routes)
  - [Get all classes](#get-all-classes)
  - [Get classes by ID](#get-classes-by-id)
  - [Get classes by instructor/:instructor_id](#get-classes-by-instructor-id)
  - [Create a class](#create-new-class)
  - [Update a class](#update-class)
  - [Delete a class](#delete-class)
  - [Create new class time](#create-class-time)
  - [Delete a class time](#delete-class-time)
  - [Get class times by class id](#class-times-by-class-id)
  - [Purchase a 10-class pass](#purchase-class-pass)
  - [Sign up to attend a class time](#attend-class)
  - [View calendar of classes for a user](#get-user-calendar)

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
  "class_time_id": 1,                      // Integer [Primary key]
  "class_id": 1,                           // Integer [Foreign key -> classes.class_id]
  "start_time": 1                          // Datetime [Required]
  "end_time": 90,                          // Integer [Required, Unsigned]
  "location": "Park Place"                 // String [Required]
}
```

`attendees`

```
{
  "class_time_id": 1,                     // Integer [Foreign Key -> class_times.class_time_id]
  "user_id": 2,                           // Integer [Foreign Key -> users.user_id]
  ** Unique constraint on user_id and class_time_id **
}


[Back to Table of Contents](#table-of-contents)
---

## API ENDPOINTS

| name | method | endpoint | description|
| ---- | ------ | -------- | ----------- |
| Register | POST | /auth/register| Creates a new `user` to the users table in the database |
|Login|POST|/auth/login|Checks whether payload from the `body` matches with a user in the database. On Succesful login, returns a message and a `JWT Token`|
|Get all users|GET|/api/users| - Returns an array of user objects of all users|
|Get all instructors|GET|/api/instructors/| `PROTECTED ROUTE` - Returns an array of objects of all instructors|
|Get instructor by ID|GET|/api/instructors/:instructor_id| `PROTECTED ROUTE` - Can only be accessed by instructors. Returns selected instructor by ID|
|Get instructor tools|GET|/api/instrucors/tools| `PROTECTED ROUTE` - Can only be accessed by instructors. Returns an array of categories and an array of all classes an instructor has created|
|Get all classes|GET|/api/classes| `PROTECTED ROUTE` - Returns an array of objects of all classes|
|Get classes by class id|GET|/api/classes/:class_id|`PROTECTED ROUTE` - Gets all classes with the selected id|
|Get classes by instructor_id|GET|/api/classes/:instructor_id| `PROTECTED ROUTE` - Returns an array of objects of classes being taught by the selected instructor id|
Create a new class|POST|/api/classes|`PROTECTED ROUTE` - Inserts a new class into the database|
|Update a class|PUT|/api/classes/:class_id|`PROTECTED ROUTE` - Updates an existing class object
|Delete a class|DELETE|/api/classes/:class_id|`PROTECTED ROUTE` - Deletes a class from the database|
|Create a new class time|POST|/api/classes/class_times/:class_id|`PROTECTED ROUTE` - Can only be accessed by instructors. Creates a new time slot for a user to attend|
|Delete a class time|DELETE|/api/classes/class_times/:class_id|`PROTECTED ROUTE` - Can only be accessed by instructors. Deletes a previously created class time|
|Get class times by class id|GET|/api/class_times/:class_id|`PROTECTED ROUTE` - Returns an array of classes whose class start times are later than now|
|Purchase class pass|POST|/api/classes/purchase_pass/:class_id|`PROTECTED ROUTE` - Creates a class pass for a user to attend a specific class|
|Sign Up to attend a specific class time|POST|/api/classes/attend/:class_id/:class_time_id|`PROTECTED ROUTE` - Adds a user to a specific class time and decrements the punch count on the user card for that class|
|View user Calendar|GET|/api/classes/calendar|`PROTECTED ROUTE` - Returns an array of objects of the specific class times for which a user is signed up|

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
first_name: "test",
last_name: "user"
username: "testuser",
password: "password",
email: "email@email.com"
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
##### 403 (Not Unique)
>If you send in non-unique fields for usernam or password, the endpoint will return an HTTP response with a status code `403` and a body as below.
```

{
"not_unique": "field that is not unique"
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
username: "username",
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


# USER ROUTES

## **GET ALL USERS**

### Returns all users

_Mehod Url:_ `/api/users`
_HTTP method:_ **[GET]**

#### Headers

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `Content-Type` | String | Yes      | Must be application/json |

#### Response

##### 200 (OK)

> If you successfully get al the users, the endpoint will return an HTTP response with a status code `200` and a body as below.

```

{
[
{
"user_id": 1,
"first_name": "test1",
"last_name": "test1",
"email": "test1",
"username": "test1"
},
{
"user_id": 2,
"first_name": "Test",
"last_name": "User",
"email": "instructoremail",
"username": "probably_an_instructor"
},
{
"user_id": 3,
"first_name": "Test",
"last_name": "User",
"email": "new_useremail",
"username": "new_definitely_a_user"
}
]
}

```

[Back to Table of Contents](#table-of-contents)
___

# INSTRUCTOR ROUTES

## **GET ALL INSTRUCTORS**

### Returns all instructors

_Mehod Url:_ `/api/instructors`
_HTTP method:_ **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |

#### Response

##### 200 (OK)

> If you successfully get all the instructors, the endpoint will return an HTTP response with a status code `200` and a body as below.

```

    {
        "instructor_id": 1,
        "user_id": 1,
        "username": "test1",
        "first_name": "test1",
        "last_name": "test1",
        "paypal_id": null
    }

```

[Back to Table of Contents](#table-of-contents)
___

## **GET INSTRUCTORS BY ID**

### Returns the instructor matching the id in the request parameters with a list of their classes

_Mehod Url:_ `/api/instructors/:instructor_id`
_HTTP method:_ **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |

#### Response

##### 200 (OK)

> If you successfully get the instructor, the endpoint will return an HTTP response with a status code `200` and a body as below.

```

{
"instructor_id": 2,
"user_id": 2,
"paypal_id": null,
"classes": [
{
"class_id": 1,
"category_id": 1,
"instructor_id": 2,
"duration": 2,
"class_name": "test class"
},
{
"class_id": 2,
"category_id": 2,
"instructor_id": 2,
"duration": 1,
"class_name": "second test class"
}
]
}

```

##### 404 (BAD REQUEST)

> If you submit a request for an instructor id that does not exist, the endpoint will return an HTTP response with a status code `404` and a body as below.

```

{ error: "unable to find instructor" }

```

##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.

[Back to Table of Contents](#table-of-contents)
___

## **GET INSTRUCTOR TOOLS**

### Returns a list of categories and a list of the classes of the instructor whose token is send in the request authorization header

_Mehod Url:_ `/api/instructors/tools`
_HTTP method:_ **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token generated by an instructor |

#### Response

##### 200 (OK)

> If you successfully get tools, the endpoint will return an HTTP response with a status code `200` and a body as below.

```

{
"categories": [
{
"category_id": 1,
"category_name": "yoga"
},
{
"category_id": 2,
"category_name": "strength training"
},
{
"category_id": 3,
"category_name": "aerobics"
}
],
"instructor_classes": [
{
"class_id": 28,
"category_id": 2,
"instructor_id": 13,
"duration": 45,
"class_name": "third test class"
}
]
}

```

##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.

[Back to Table of Contents](#table-of-contents)
___

# CLASSES ROUTES

## **GET ALL**
### **Gets a list of all classes**

*Method Url:* `api/classes`


*HTTP method:* **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |


*example:*

```

    {
        "class_id": 1,
        "class_name": "test class",
        "category_id": 1,
        "category_name": "yoga",
        "duration": 2,
        "instructor_id": 2,
        "instructor_username": "probably_an_instructor",
        "instructor_first_name": "Test",
        "instructor_last_name": "User"
    }

```

#### Response

##### 200 (OK)
>If you successfully register a user the endpoint will return an HTTP response with a status code `200` and a body following the shape of the example.

##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.

[Back to Table of Contents](#table-of-contents)
____

## **GET CLASSES BY CLASS ID**
### **Gets a list of classes for a single class id**

*Method Url:* `api/classes/:class_id`

*HTTP method:* **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |


#### Response

##### 200 (OK)
>If you make a successful request, the endpoint will return an HTTP response with a status code `200` and a body as below.
```

    {
        "class_id": 1,
        "category_id": 1,
        "instructor_id": 2,
        "duration": 2,
        "class_name": "test class"
    }

```
##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.


[Back to Table of Contents](#table-of-contents)
___

## **GET CLASSES BY INSTRUCTOR ID**
### **Gets a list of classes taught by a single instructor**

*Method Url:* `api/classes/by_instructor/:instructor_id`

*HTTP method:* **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |


#### Response

##### 200 (OK)
>If you make a successful request, the endpoint will return an HTTP response with a status code `200` and a body as below.
```

    {
        "class_id": 3,
        "category_id": 1,
        "instructor_id": 3,
        "duration": 1,
        "class_name": "test class"
    }

```
##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.


[Back to Table of Contents](#table-of-contents)
___

## **CREATE A CLASS**
### **Creates a new class for the instructor**

*Method Url:* `api/classes/`

*HTTP method:* **[POST]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token created by an instructor|

#### Body

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `category_id`  | Integer| Yes      | Must match a category_id in the database |
| `duration`     | Integer| Yes      | Must be a valid integer |
| `class_name`   | String | Yes      | Must be a valid string |

#### Response

##### 201 (OK)
>If you make a successful request, the endpoint will return an HTTP response with a status code `201` and a body as below.
```

    {
        "class_id": 3,
        "category_id": 1,
        "instructor_id": 3,
        "duration": 1,
        "class_name": "test class"
    }

```
##### 404 (ERROR)
> If your request is not coming from an instructor account, the endpoint will return an HTTP response with a status code `404` and a message as below:
```

{ message: "Access restricted to instructors" }

```
##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.


[Back to Table of Contents](#table-of-contents)
___

## **UPDATE A CLASS**
### **Updates an existing class for the instructor**

*Method Url:* `api/classes/:class_id`

*HTTP method:* **[PUT]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token created by an instructor|

#### Body

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `category_id`  | Integer| Yes      | Must match a category_id in the database |
| `duration`     | Integer| Yes      | Must be a valid integer |
| `class_name`   | String | Yes      | Must be a valid string |

#### Response

##### 201 (OK)
>If you make a successful request, the endpoint will return an HTTP response with a status code `201` and a body as below.
```

    {
        "class_id": 3,
        "category_id": 1,
        "instructor_id": 3,
        "duration": 1,
        "class_name": "test class"
    }

```
##### 404 (ERROR)
> If your request is not coming from an instructor account, the endpoint will return an HTTP response with a status code `404` and a message as below:
```

{ message: "Cannot locate intended class" }

```
##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.


[Back to Table of Contents](#table-of-contents)
___

## **GET USER PASSES**
### **Gets a list of classes for which a user has purchased a pass and how many uses are left for each class**

*Method Url:* `api/classes/passes`

*HTTP method:* **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |


#### Response

##### 200 (OK)
>If you make a successful request, the endpoint will return an HTTP response with a status code `200` and a body as below.
```

    {
        "class_id": 2,
        "class_name": "second test class",
        "category_id": 2,
        "category_name": "strength training",
        "duration": 1,
        "instructor_id": 2,
        "instructor_name": "probably_an_instructor",
        "punch_count": 10
    }

```
##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.


[Back to Table of Contents](#table-of-contents)
___

## **GET USER CALENDAR**
### **Gets a list of classes for which a user has purchased a pass and has indicated they will be attending**

*Method Url:* `api/classes/calendar`

*HTTP method:* **[GET]**

#### Headers

| name | type   | required | description |
| ----- | ------ | -------- | ----- |
| `Content-Type` | String | Yes | Must be application/json |
| `Authorization`| String | No       | Bearer JWT authorization token |


#### Response

##### 200 (OK)
>If you make a successful request, the endpoint will return an HTTP response with a status code `200` and a body as below.
```

{
"class_id": 1,
"class_name": "test_class",
"category_id": 1,
"category_name": "yoga",
"instructor_id": 1,
"instructor_name": "Dahlsim",
"class_time_id": 2, //id to specify an instance of a class occurence
"start_time": "2019-03-29T17:00:15.654Z", //UTC time
"end_time": "2019-03-29T18:00:15.654Z",
"location": "Dahlsim Yoga Studio",
"attending": "2", // id of attending user
"punch_count": "5" //remaining punches for user attending this class
}

```
##### 500 (ERROR)
>If your request returns an error, the endpoint will return an HTTP response with a status code `500` and the error.


[Back to Table of Contents](#table-of-contents)
___
```
