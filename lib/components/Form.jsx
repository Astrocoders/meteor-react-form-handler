Form = React.createClass({
  propTypes: {
    schema: React.PropTypes.instanceOf(SimpleSchema).isRequired,
    id: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func,
    resetOnSubmit: React.PropTypes.bool,
  },

  childContextTypes: {
    schema: React.PropTypes.instanceOf(SimpleSchema),
    doc: React.PropTypes.object,
    fieldDefinitions: React.PropTypes.object,
  },

  // Assuming that the schema won't get changed
  getChildContext(){
    return {
      schema: this.props.schema,
      doc: this.props.doc,
      fieldDefinitions: this.state.fieldDefinitions,
    };
  },

  getInitialState(){
    return {
      errors: {},
      fieldDefinitions: {},
    };
  },

  componentWillMount(){
    FormHandler.initializeForm(this.props.id);
  },

  focusInput(name){
    // Set focus to a form input by name
    this.refs[name].refs.input.focus();
  },

  submit(){
    this._onSubmit();
  },

  _onSubmit(event){
    // Event is not defined if onSubmit is called pragmatically
    if (event) {
      event.preventDefault();
    }

    var schema = this.props.schema;
    var formToDoc = FormHandler[this.props.id] && FormHandler[this.props.id].formToDoc;

    var doc = schema.clean(_.reduce(this.refs.form.querySelectorAll('[name]'),
      (doc, field) => {
        doc[field.name] = FormHandler.getFieldValue(field);
        return doc;
    }, {}));

    var validationContext = schema.newContext();

    // Temporarily remove the doc's ignored fields
    // so an error isn't thrown when validating
    var ignoredFields = {};
    _.each(FormHandler.ignoreFields, (field) => {
      ignoredFields[field] = doc[field];
      delete doc[field];
    });

    // Remove empty strings
    doc = Utils.cleanNulls(doc);
    doc = formToDoc ? formToDoc(doc) : doc;

    if (!validationContext.validate(doc)) {
      var errors = {};

      _.each(validationContext._invalidKeys, function(error) {
        errors[error.name] = error.type;
      });

      this.setState({errors: errors});

      if (FormHandler.debug) {
        console.error('React form handler validation errors', errors);
      }
    } else {
      this.setState({errors: {}});
      FormHandler.submitForm(this.props.id);

      if (this.props.onSubmit) {

        // Restore ignored fields
        if (ignoredFields) {
          _.each(ignoredFields, (value, key) => {
            doc[key] = value;
          });
        }

        this.props.onSubmit(doc);
      }

      if (this.props.resetOnSubmit) {
        this.refs.form.getDOMNode().reset();
      }
    }
  },
  _renderChildren: function () {

    if (this.props.doc) {
      FormHandler.setFormDoc(this.props.id, this.props.doc);
    }

    var that = this;
    var formDoc = FormHandler.getFormDoc(this.props.id);
    const fieldDefinitions = this.state.fieldDefinitions;

    this.props.schema._keys.forEach((key) => {
      var schemaObject = this.props.schema._schema[key];

      var fieldDefinition = {};

      if (schemaObject.defaultValue) {
        fieldDefinition.defaultValue = schemaObject.defaultValue;
      }

      if (schemaObject.type === Number) {
        fieldDefinition._valueType = 'number';
      }

      if (schemaObject.label && !fieldDefinition.label) {
        fieldDefinition.label = (FormHandler.i18n)? TAPi18n.__(schemaObject.label) : schemaObject.label;
      }

      if (schemaObject.placeholder) {
        fieldDefinition.placeholder = (FormHandler.i18n)? TAPi18n.__(schemaObject.placeholder) : schemaObject.placeholder;
      }

      if (schemaObject.allowedValues) {
        fieldDefinition.allowedValues = schemaObject.allowedValues;
      }

      if (typeof this.props.schema._schema[child.props.name + '.$'] !== 'undefined') {
        var itemSchemaObject = this.props.schema._schema[child.props.name + '.$'];
        if (itemSchemaObject.allowedValues) {
          fieldDefinition.allowedValues = itemSchemaObject.allowedValues;
        }
      }

      if (this.state.errors[child.props.name]) {
        fieldDefinition.errorText =
          (FormHandler.i18n) ?
            TAPi18n.__('errors.' + this.state.errors[child.props.name]) :
              this.state.errors[child.props.name];

              fieldDefinition.error = true;
      } else {
        fieldDefinition.errorText = '';
        fieldDefinition.error = false;
      }

      fieldDefinitions[key] = fieldDefinition;
    });

    this.setState({fieldDefinitions});


    return this.props.children;
  },
  render(){
    let className = "";

    if (this.props.className) {
      className += " " + this.props.className;
    }

    if (FormHandler.formClass) {
      className += " " + FormHandler.formClass;
    }

    return (
      <form {...this.props} className={className} ref="form" id={this.props.id} onSubmit={this._onSubmit}>
        {this._renderChildren()}
        <div style={{clear: "both"}}></div>
      </form>
    )
  }
});
