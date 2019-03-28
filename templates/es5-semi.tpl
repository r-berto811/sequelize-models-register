'use strict';

// Import dependencies.
const { Sequelize, DataTypes } = requiire('sequelize');

// Declare config.<% if (sequelizeConfig.file) { %>
const config = require('<%= sequelizeConfig.file %>');
<% } else { %>
const config = {
<% Object.keys(sequelizeConfig.env).forEach(function(key){ %>  <%= key %>: <%=sequelizeConfig.env[key]%>
<% }); %>};
<% } %>
// Create new sequelize instance and export
const sequelize = new Sequelize(config.database, config.username, config.password, config);
module.exports.sequelize = sequelize;

// Export list of models<% models.forEach(function(modelData){ %>
module.exports.<%= modelData.name %> = require('<%= modelData.path %>')(sequelize, DataTypes);<% }); %>

