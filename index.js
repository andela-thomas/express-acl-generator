#!/usr/bin/env node

(function() {
  'use strict';

  var vorpal = require('vorpal')();
  var shell = require('shelljs');

  var prompt = require('./lib/prompt');
  var program = require('./lib/program');
  var fs = require('fs');
  var path, mergedPath, filename, boolean, self;

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
      path = args.options.path;
      mergedPath;
      filename = args.options.filename;
      boolean = !!path;
      self = this;


      switch (boolean) {
        /**
         * If path is specified, we check if the filename is specified
         * if it is prompt the user for input and generate the acl rule
         * @type {[type]}
         */
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
    .command('add <type> <group>')
    .option('-p ,--path <value>', 'Location of the configuration file')
    .option('-n , --filename <value>', 'The name of the acl configuration file')
    .option('-a, --action <value>', 'The action to apply on the policy')
    .option('-r, --resource [level]', 'the permissions')
    .option('-m, --methods <value>', 'Rstrictd http methods')
    .action(function(args, cb) {
      switch (args.type) {
        case 'group':

          args.options = args.options || {};
          path = args.options.path;
          filename = args.options.filename;

          if (path && filename) {
            this.log(path);
            shell.mkdir('-p', path);
            program.add.group(this, fs, args, prompt);
          } else {
            console.log('nothing');
            program.add.group(this, fs, args, prompt);
          }
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
