#!/usr/bin/env node

(function() {
  'use strict';

  var vorpal = require('vorpal')();
  var shell = require('shelljs');
  var log = require('npmlog');
  var prompt = require('./lib/prompt');
  var program = require('./lib/program');
  var fs = require('fs');
  var path, mergedPath, filename, boolean, self, files;

  vorpal
    .delimiter('acl:')
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
            files = shell.ls(path);

            if (files.indexOf(filename) !== -1) {
              self.prompt(prompt.exist, function(res) {
                if (res.continue) {
                  program.initialize(self, prompt, fs, mergedPath);
                }
              });
              return;
            }

            program.initialize(self, prompt, fs, mergedPath);


          } else {
            log.warn('Missing filename', 'usage init -p <path> -n <filename>');
          }

          break;

        default:
          files = shell.ls();
          if (files.indexOf('config.json') !== -1) {
            self.prompt(prompt.exist, function(res) {
              if (res.continue) {
                program.initialize(self, prompt, fs);
              }
            });

            return;
          }

          program.initialize(self, prompt, fs);

          break;
      }
      cb();
    });


  vorpal
    .command('add <command> <group>', 'Add group, policy, methods')
    .option('-p ,--path <value>', 'Location of the configuration file')
    .option('-n , --filename <value>', 'The name of the acl configuration file')
    .option('-a, --action <value>', 'The action to apply on the policy')
    .option('-r, --resource [level]', 'the permissions')
    .option('-m, --methods <value>', 'Restricted http methods')
    .action(function(args, cb) {
      switch (args.command) {
        case 'group':

          args.options = args.options || {};

          if (args.options.path && args.options.filename) {
            shell.mkdir('-p', path);
          }

          program.add.group(this, fs, args, prompt);

          break;
        case 'policy':
          program.add.policy(fs, args);
          break;
        case 'methods':
          program.add.methods(fs, args);
          break;
        default:
          log.error('Invalid command', 'usage add group <group>,' +
            ' add policy <group> or add methods <resource>');
          break;
      }
      cb();
    });

  vorpal
    .command('remove <command> <group>', 'Removes group, policy and methods')
    .option('-p ,--path <value>', 'Location of the configuration file')
    .option('-n , --filename <value>', 'The name of the acl configuration file')
    .option('-a, --action <value>', 'The action to apply on the policy')
    .option('-r, --resource [level]', 'the permissions')
    .option('-m, --methods <value>', 'Restricted http methods')
    .action(function(args, cb) {

      switch (args.command) {
        case 'group':
          program.remove.group(fs, args);
          break;
        case 'policy':
          program.remove.policy(fs, args);
          break;
        case 'methods':
          program.remove.methods(fs, args);
          break;
        default:
          log.error('Invalid command', 'usage remove group <group>,' +
            ' remove policy <group> or remove methods <resource>');
          break;
      }
      cb();
    });
})();
