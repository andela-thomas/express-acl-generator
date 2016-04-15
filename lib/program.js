(function() {
  'use strict';
  var shell = require('shelljs');
  var config = [];
  var path, nameOfTheGroup, resource, methods, groupRule, files;
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
                  self.log(err);
                }
              });
          }
        });
      });
    },


    add: {
      group: function(self, fs, args) {
        nameOfTheGroup = args.options.group;
        methods = args.options.methods;
        files = shell.ls(path);
        path = args.options.path + '/' + args.options.filename || 'config.json';
        resource = args.options.resource ? args.options.resource : '*';
        methods = !methods ? '*' : methods.toUpperCase().split(' ');
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

        if (files.indexOf(args.options.filename) !== -1) {
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
            this.log(err);
          }
        });
      }
    }
  };
})();
