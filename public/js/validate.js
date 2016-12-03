$(document).ready(function () {
  $('.ui.form.signup').form({
    fields: {
      input1: {
        identifier: 'name',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your name',
          },
        ],
      },
      input2: {
        identifier: 'email',
        rules: [
          {
            type: 'email',
            prompt: 'Please enter a valid Email',
          },
        ],
      },
      input3: {
        identifier: 'password',
        rules: [
          {
            type: 'minLength[6]',
            prompt: 'Your password must be at least {ruleValue} characters',
          },
        ],
      },
    },
  });
  $('.ui.form.login').form({
    fields: {
      input1: {
        identifier: 'email',
        rules: [
          {
            type: 'email',
            prompt: 'Please enter a valid Email',
          },
        ],
      },
    },
  });
});
