# sequelize-models-register [![npm version](https://badge.fury.io/js/%40r-berto811%2Fsequelize-models-register.svg)](https://badge.fury.io/js/%40r-berto811%2Fsequelize-models-register)

The Command Line Interface (CLI) to generate file with exports of all models instances.
This command is used with [sequelize-cli](https://github.com/sequelize/cli).

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Custom template](#Custom%20template)

## Installation

Install CLI locally to your `node_modules` folder with

```bash
$ npm install --save @r-berto811/sequelize-models-register
```

You should be able to run CLI with

```bash
$ node_modules/.bin/sequelize:register-models
```

## Usage

### Command
```
Sequelize Models Register CLI [Node: 6.11.2, CLI: 3.0.0, ORM: 4.8.0]

sequelize:register-models <dir> [options] <outfile>

Arguments:
  <dir>       Directory to find models in.
  <outfile>   Output file with exports of models classes.

Options:
  -V  --version       Show version number                             [boolean]
  -h  --help          Show help                                       [boolean]
  -s  --semicolons    Generate output file with semicolons            [boolean]
  -g  --generation    Set generation of javascript (es5, es6)         [string]
  -t  --template      Set path to custom template                     [string]
  -c  --config        Set path to file with database config           [string]

```

### Running CLI
```bash
  sequelize:register-models ./database/models --generation es6 --config ./config/database.config.js ./app/models.js
```

### Example of database config
```javascript
  // config/database.config.js
  module.exports = {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
```

## Custom template

### Template syntax
To create your custom template, use simple [lodash template](https://lodash.com/docs/4.17.11#template) syntax:

```twig
'use strict';

// Import dependencies.
import { Sequelize, DataTypes } from 'sequelize';

// Declare config.
<% if (sequelizeConfig.file) { %>
  const config = require('<%= sequelizeConfig.file %>');
<% } else { %>
  const config = {
  <% Object.keys(sequelizeConfig.env).forEach(function(key){ %>  <%= key %>: <%=sequelizeConfig.env[key]%>
  <% }); %>};
<% } %>

// Create new sequelize instance and export
export const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Export list of models
<% models.forEach(function(modelData){ %>
  export const <%= modelData.name %> = require('<%= modelData.path %>')(sequelize, DataTypes);
<% }); %>

```

### Available data in templates
``` javascript
{
  sequelizeConfig: {
    // it will be used firstly, if config option is setted
    file: 'path/to/your/database/config.js',
    // default options to generate config, based on ENV parameters
    env: {
      database: `process.env.DB_DATABASE,`,
      username: `process.env.DB_USERNAME,`,
      password: `process.env.DB_PASSWORD,`,
      dialect: `process.env.DB_DIALECT || 'mysql',`,
      host: `process.env.DB_HOST || 'localhost',`,
      port: `process.env.DB_PORT || 3306`
    },
    // array of models data
    models: [
      { name: 'User', path: '../models/user.js' }
      { name: 'Profession', path: '../models/profession.js' }
    ]
  }
}
```

## References
