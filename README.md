Meteor React form handler
=========================

Form creation and validation in React using
[SimpleSchema](<https://github.com/aldeed/meteor-simple-schema>).

 

**Note: this package is under heavy development and is definitively not
production ready!**

 

This package provides only the \<Form\> component. You will also need to add one
of the form components packages:

-   [Material UI form
    components](<https://atmospherejs.com/coniel/react-form-handler-material-ui>)
    (coniel:react-form-handler-material-ui)

-   [Semantic UI form
    components](<https://atmospherejs.com/coniel/react-form-handler-semantic-ui>)
    (coniel:react-form-handler-semantic-ui)

 

Quick start
-----------

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
RegistrationForm = React.createClass({
    registrationFormSchema() {
        return new SimpleSchema({
            firstName: {
                type: String,
                max: 60,
                label: "First name"
            }
            lastName: {
                type: String,
                max: 60,
                label: "Last name"
            },
            email: {
                type: String,
                max: 60,
                label: "Email"
            },
            password: {
                type: String,
                max: 60,
                min: 8,
                label: "Password"
            },
            termsAgreement: {
                type: Boolean
            },
        });
    },
    onSubmit(doc) {
        Accounts.createUser(doc, function(error){
            if (error) {
                // Handle error
            } else {
                // Handle success
            }
        });
 
    },
    render() {
        return (
            <Form schema={this.registrationFormSchema()} id="registration-form" onSubmit={this._onSubmit}>
                <TextInput name="firstName" layoutStyle="first-half" />
                <TextInput name="lastName" layoutStyle="second-half" />
                <TextInput name="email" />
                <TextInput name="password" type="password" />
                <Checkbox name="termsAgreement" />
                <SubmitButton label="Register" />
            </Form>
        )
    }
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
