# Izzup Overview

## Static twtxt files as master data

## Community Enhancements

### Public Key 

A `publicKey` meta data item is created to hold a user defined publicKey.

This has a few uses:

* Sign twts or postings
* Authorize sensitive operations
* *  Change user name
* *  Redirect feed URL
* *  Enable enhanced services

### Customizable Feed View

Each members' twtxt feed is available as text as as HTML
A twtxt file like https://what.izzup.world/bwinkers/twtxt.txt
is available as HTML at https://what.izzup.world/bwinkers

Harkening back to the days of MySpace we want to offer a ridiculous degree of customization and personalization of your HTLM feed. The styling and layout of that page can be highly customized.

* Choose from a variety of fonts for each section
* Define any color scheme
* Select from multiple layouts
* Create your own custom layout

### Advanced Features

#### Git based 

Each members web directory is maintained in it's own `.git` project. 
The git `merge` and `pull` processes are used to move changes from a management node to the public web servers.


```sh
├── /opt/nginx
│   └── winkersbrian@gmail.com
├── apple.com
│   └── winkersbrian@gmail.com
│       ├── 001.jpg
│       ├── 002.jpg
│       └── passwd.txt
├── aws.amazon.com
│   ├── brianizzup+dnsemail@gmail.com
│   │   ├── account
│   │   └── passwd
│   ├── brianizzup@gmail.com


```



