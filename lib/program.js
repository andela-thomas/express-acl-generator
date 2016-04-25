(function() {
  'use strict';
  var shell = require('shelljs');
  var log = require('npmlog');
  var config = [];
  var path, nameOfTheGroup, resource, methods,
    groupRule, files, filename, permissions,
    filePath, index, permissionIndex;

  function getIndexGroup(array, search) {
    return array.findIndex(function(el) {
      return el.group === search;
    });
  }

  function getIndexResource(array, search) {
    return array.findIndex(function(el) {
      return el.resource === search;
    });
  }

  function insert(currentArray, array) {
    for (var value of array) {
      if (currentArray.indexOf(value) === -1) {
        currentArray.push(value);
      }
    }
    return currentArray;
  }

  module.exports = {
    initialize: function(self, prompt, fs, path) {

      filePath = path || 'config.json';

      self.prompt(prompt.init, function(prompts) {
        methods = prompts.methods;
        methods = methods === '*' ? methods : methods.toUpperCase().split(' ');
        config = {
          group: prompts.group,
          permissions: [{
            resource: prompts.resource,
            methods: methods
          }],
          action: prompts.action
        };
        self.log(JSON.stringify([config], null, 2));
        self.prompt(prompt.confirm, function(result) {
          if (result.continue) {

            fs.writeFile(filePath, JSON.stringify([config], null, 2),
              function(err) {
                if (err) {
                  return log.errror('WARNING', 'Error creating file');
                }
                return log.info('SUCCESS', 'initialisation complete');
              });
          }
        });
      });
    },


    add: {
      group: function(self, fs, args) {
        nameOfTheGroup = args.group;
        methods = args.options.methods;
        path = 'config.json';
        filename = path;

        resource = args.options.resource ? args.options.resource : '*';
        methods = !methods ? '*' : methods.toUpperCase().split(' ');

        if (args.options.path && args.options.filename) {
          path = args.options.path + '/' + args.options.filename;
          filename = args.options.filename;
        }

        files = shell.ls(path);

        /**
         * destructuring of the policy
         * @type {Object}
         */

        groupRule = {
          group: nameOfTheGroup,
          permissions: [{
            resource: resource,
            methods: methods
          }],
          action: args.options.action || 'allow'
        };

        if (files.indexOf(filename) !== -1) {
          config = JSON.parse(fs.readFileSync(path));
        }

        /**
         * Find if the group exist
         */

        index = getIndexGroup(config, nameOfTheGroup);


        (index !== -1) ? config[index] = groupRule: config.push(groupRule);


        config = JSON.stringify(config, null, 2);

        fs.writeFile(path, config, function(err) {
          if (err) {
            return log.error('WARNING', 'Error occured while writting to file');
          }
          return log.info('SUCCESS', 'Group added succesfully');
        });
      },

      policy: function(fs, args) {
        var policy;
        methods = args.options.methods;
        nameOfTheGroup = args.group;
        resource = args.options.resource;
        methods = !methods ? '*' : methods.toUpperCase().split(' ');

        filename = path = 'config.json';
        policy = {
          resource: resource,
          methods: methods
        };

        if (args.options.path && args.options.filename) {
          path = args.options.path + '/' + args.options.filename;
          filename = args.options.filename;
        }


        files = shell.ls(args.options.path);

        if (files.indexOf(filename) !== -1) {
          config = JSON.parse(fs.readFileSync(path));
        }

        index = getIndexGroup(config, nameOfTheGroup);

        if (index === -1) {
          log.warn('Not found', 'Group ' + nameOfTheGroup +
            ' was  not found, add and try again');
          return;
        }

        permissions = config[index].permissions;


        permissionIndex = getIndexResource(permissions, resource);

        if (permissionIndex === -1) {
          config[index].permissions.push(policy);
        } else {
          config[index].permissions[permissionIndex] = policy;
        }

        config = JSON.stringify(config, null, 2);

        fs.writeFile(path, config, function(err) {
          if (err) {
            return log.error('WARNING', 'Error occured while writting' +
              ' to file');
          }
          return log.info('SUCCESS', 'Policy added succesfully');
        });

      },

      methods: function(fs, args) {
        nameOfTheGroup = args.group;
        resource = args.options.resource;
        methods = args.options.methods;
        methods = methods = !methods ? '*' : methods.toUpperCase().split(' ');

        filename = path = 'config.json';

        if (args.options.path && args.options.filename) {
          path = args.options.path + '/' + args.options.filename;
          filename = args.options.filename;
        }


        files = shell.ls(args.options.path);

        if (files.indexOf(filename) !== -1) {
          config = JSON.parse(fs.readFileSync(path));
        }

        index = getIndexGroup(config, nameOfTheGroup);

        if (index === -1) {
          return log.error('Not found', 'Group ' + nameOfTheGroup +
            ' was  not found, add and try again');
        }

        permissions = config[index].permissions;

        permissionIndex = getIndexResource(permissions, resource);

        if (permissionIndex === -1) {
          return log.error('Resource not found', 'add resource and try again');
        }

        var currentMethod = config[index].permissions[permissionIndex].methods;

        methods = typeof currentMethods === 'string' ? methods :
          insert(currentMethod, methods);

        config[index].permissions[permissionIndex].methods = methods;

        config = JSON.stringify(config, null, 2);

        fs.writeFile(path, config, function(err) {
          if (err) {
            return log.error('WARNING', 'Error occured while writting' +
              ' to file');
          }
          return log.info('SUCCESS', 'Method(s) added succesfully');
        });

      }
    }
  };
})();
