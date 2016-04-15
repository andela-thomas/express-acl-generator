(function() {
  'use strict';

  var vorpal = require('vorpal')();
  var shell = require('shelljs');
  var prompt = require('./lib/prompt');
  var program = require('./lib/program');
  var fs = require('fs');

  vorpal
    .delimiter('pg-cli:')
    .show();

  /**
   * Initiliaze the config.json
   */

  vorpal
    .command('init', 'Creates the ACL rules configuration file')
    .option('-p, --path <path>', 'Location where the ACL file will be written')
    .option('-n, --filename <file>', 'Name of the acl configuration file')
    .action(function(args, cb) {
      var path = args.options.path;
      var mergedPath;
      var filename = args.options.filename;
      var boolean = !!path;
      var self = this;


      switch (boolean) {
        case true:
          if (filename) {
            shell.mkdir('-p', path);
            mergedPath = path + '/' + filename;
            var files = shell.ls(path);
            console.log(mergedPath);
            if (files.indexOf(filename) !== -1) {
              self.prompt(prompt.exist, function(res) {
                if (res.continue) {
                  program.initialize(self, prompt, fs, mergedPath);
                }
              });
            } else {
              program.initialize(self, prompt, fs, mergedPath);
            }

          } else {
            self.log('Filename missing, usage init -p <path> -n <filename>');
          }

          break;
        default:
          var file = shell.ls();
          if (file.indexOf('config.json') !== -1) {
            self.prompt(prompt.exist, function(res) {
              if (res.continue) {
                program.initialize(self, prompt, fs);
              }
            });
          } else {
            program.initialize(self, prompt, fs);
          }
          break;
      }
      cb();
    });


  vorpal
    .command('add <type> [optionalArg]')
    .option('-a, --amount <value>', 'Number of cups of coffee.')
    .option('-v, --verbosity [level]', 'Sets verbosity level.')
    .option('-A', 'Does amazing things.', ['Unicorn', 'Narwhal', 'Pixie'])
    .option('--amazing', 'Does amazing things')
    .action(function(args, cb) {
      switch (args.type) {
        case 'group':
          this.log('adding group');
          break;
        case 'policy':
          this.log('adding policy');
          break;
        case 'method':
          this.log('adding method');
          break;
        default:
          break;
      }


      cb();
    });
})();
