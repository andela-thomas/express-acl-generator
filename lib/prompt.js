module.exports = {
  init: [{
    type: 'input',
    name: 'group',
    default: 'admin',
    message: 'User group (admin)? : '
  }, {
    type: 'input',
    name: 'resource',
    default: '*',
    message: 'Resource ("*")? : '
  }, {
    type: 'input',
    name: 'methods',
    default: '*',
    message: 'Methods (separate using space, default "*") : '
  }, {
    type: 'input',
    name: 'action',
    default: 'deny',
    message: 'Action [deny/allow]? : '
  }],
  confirm: {
    type: 'confirm',
    name: 'continue',
    default: true,
    message: 'Is this ok?',
  },
  exist: {
    type: 'confirm',
    name: 'continue',
    default: true,
    message: 'Acl file already exist, do you want to overwrite?',
  }
};
