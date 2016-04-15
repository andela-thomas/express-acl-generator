'use strict';
module.exports = {
  initialize: function(self, prompt, fs, path) {
    var config;
    var filePath = path || 'config.json';
    self.prompt(prompt.init, function(prompts) {
      config = {
        group: prompts.group,
        permissions: [{
          resource: prompts.resource,
          methods: prompts.methods === '*' ? prompts.methods : prompts.methods.toUpperCase().split(' ')
        }],
        action: prompts.action
      };
      self.log(JSON.stringify(config, null, 2));
      self.prompt(prompt.confirm, function(result) {
        if (result.continue) {
          console.log(filePath);
          fs.writeFile(filePath, JSON.stringify(config, null, 2), function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
  }
};
