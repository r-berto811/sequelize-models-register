'use strict'

// Import dependencies.
import { Sequelize, DataTypes } from 'sequelize'

// Declare config.<% if (sequelizeConfig.file) { %>
const config = require('<%= sequelizeConfig.file %>')
<% } else { %>
const config = {
<% Object.keys(sequelizeConfig.env).forEach(function(key){ %>  <%= key %>: <%=sequelizeConfig.env[key]%>
<% }); %>}
<% } %>
// Create new sequelize instance and export
export const sequelize = new Sequelize(config.database, config.username, config.password, config)

// Export list of models<% models.forEach(function(modelData){ %>
export const <%= modelData.name %> = require('<%= modelData.path %>')(sequelize, DataTypes)<% }) %>

