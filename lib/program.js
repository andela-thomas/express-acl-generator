(function() {
  'use strict';
  var shell = require('shelljs');
  var log = require('npmlog');
  var config = [];
  var path, nameOfTheGroup, resource, methods,
    groupRule, files, filename, permissions;
  module.exports = {
    initialize: function(self, prompt, fs, path) {

      var filePath = path || 'config.json';
      self.prompt(prompt.init, function(prompts) {
        var methods = prompts.methods === '*' ? prompts.methods :
          prompts.methods.toUpperCase().split(' ');
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

        var index = config.findIndex(function(el) {
          return el.group === nameOfTheGroup;
        });


        if (index !== -1) {
          config[index] = groupRule;
        } else {
          config.push(groupRule);
        }

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

        var index = config.findIndex(function(el) {
          return el.group === nameOfTheGroup;
        });

        if (index === -1) {
          log.warn('Not found', 'Group ' + nameOfTheGroup +
            ' was  not found, add and try again');
          return;
        }

        permissions = config[index].permissions;


        var permissionIndex = permissions.findIndex(function(el) {
          return el.resource === resource;
        });

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

      methods: function() {

      }
    }
  };
})();
