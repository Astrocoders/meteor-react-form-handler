FormHandler = {};
FormHandler.i18n = false;
FormHandler.debug = false;
FormHandler.ignoreFields = [];
FormHandler.forms = {};
FormHandler.hooks = {};
FormHandler.globalHooks = {};

FormHandler.initializeForm = function (formId) {
  FormHandler.forms[formId] = {
    doc: {},
    hasErrors: false,
    errors: {}
  };

  if (FormHandler.hooks[formId] && typeof FormHandler.hooks[formId].onInitializeForm === 'function') {
    FormHandler.hooks[formId].onInitializeForm();
  }

  if (typeof FormHandler.globalHooks.onInitializeForm === 'function') {
    FormHandler.globalHooks.onInitializeForm(formId);
  }
};

FormHandler.initializeInput = function (formId, inputName, value) {
  var form = FormHandler.forms[formId].doc[inputName] = value;

  if (FormHandler.hooks[formId] && typeof FormHandler.hooks[formId].onInitializeInput === 'function') {
    FormHandler.hooks[formId].onInitializeInput(inputName, value);
  }

  if (typeof FormHandler.globalHooks.onInitializeInput === 'function') {
    FormHandler.globalHooks.onInitializeInput(formId, inputName, value);
  }
};

FormHandler.inputChanged = function (formId, inputName, value) {
  var form = FormHandler.forms[formId].doc[inputName] = value;

  if (FormHandler.hooks[formId] && typeof FormHandler.hooks[formId].onInputChanged === 'function') {
    FormHandler.hooks[formId].onInputChanged(inputName, value);
  }

  if (typeof FormHandler.globalHooks.onInputChanged === 'function') {
    FormHandler.globalHooks.onInputChanged(formId, inputName, value);
  }
};

FormHandler.submitForm = function (formId) {
  var doc = FormHandler.forms[formId].doc;

  if (FormHandler.hooks[formId] && typeof FormHandler.hooks[formId].onSubmit === 'function') {
    FormHandler.hooks[formId].onSubmit(doc);
  }

  if (typeof FormHandler.globalHooks.onSubmitForm === 'function') {
    FormHandler.globalHooks.onSubmitForm(formId);
  }
};

FormHandler.addHooks = function(formId, hooks) {
  if (FormHandler[formId]) {
    _.extend(FormHandler[formId], hooks);
  } else {
    FormHandler[formId] = hooks;
  }
};

FormHandler.addGlobalHook = function(hookName, hookFunction) {
  FormHandler.globalHooks[hookName] = hookFunction;
};

FormHandler._formSchemas = {};

FormHandler.getFormSchema = function(formId){
  return FormHandler._formSchemas[formId];
};

FormHandler.getFormDoc = function(formId, formEl) {
  var schema = FormHandler.getFormSchema(formId);
  formEl = formEl ? formEl : document.getElementById(formId);
  var doc = schema.clean(_.reduce(formEl.querySelectorAll('[name]'),
    (doc, field) => {
      doc[field.name] = FormHandler.getFieldValue(field);
      return doc;
  }, {}));

  return doc;
};

FormHandler.setFormDoc = function(formId, doc) {
  FormHandler.forms[formId].doc = doc;
};

FormHandler.getFieldValue = function(field){
  if(['checkbox', 'radio'].indexOf(field.type) > -1){
    return field.checked;
  }

  return field.value;
};
