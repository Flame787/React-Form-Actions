import { useActionState } from "react";
// special React hook - added in version 19
// like all hooks, must be used inside our component or inside another hook.

import {
  isEmail,
  isNotEmpty,
  isEqualToOtherValue,
  hasMinLength,
} from "../util/validation";
// importing 4 functions from the helper-file 'validation.js'

export default function Signup() {
  // function handleSubmit(event) {
  //   event.preventDefault();
  // }

  function signupAction(prevFormState, formData) {
    // if we use <form action={handleSubmit}>, then instead of event-object, we pass formData-object as argument
    // formData-object will contain all the submitted data, all submitted input values;
    // but it is important that each input field has 'name'-attribut, otherwise value not submitted here.
    // event.preventDefault(); - not needed, it will be done automatically by React in this case.
    // we need prevFormState as 1st argument, otherwise we get an error in Dev tools.
    const email = formData.get("email"); // input value: name="email"
    // console.log(enteredEmail);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const firstName = formData.get("first-name");
    const lastName = formData.get("last-name");
    const role = formData.get("role");
    const terms = formData.get("terms");
    const acquisitionChannel = formData.getAll("acquisition");

    let errors = [];
    // adding error-messages to the initially empty array, later we'll check array's elements lenght

    // cases for different error messages, when validation was not (!) passed:
    if (!isEmail(email)) {
      errors.push("Invalid email address.");
    }
    if (!isNotEmpty(password) || !hasMinLength(password, 6)) {
      errors.push("You must provide a password with at least six characters.");
    }
    if (!isEqualToOtherValue(password, confirmPassword)) {
      errors.push("Passwords do not match.");
    }
    if (!isNotEmpty(firstName) || !isNotEmpty(lastName)) {
      errors.push("Please provide both your first and last name.");
    }
    if (!isNotEmpty(role)) {
      errors.push("Please select a role.");
    }
    if (!terms) {
      errors.push("You must agree to the terms and conditions.");
    }
    if (acquisitionChannel.length === 0) {
      errors.push("Please select at least one acquisition channel.");
    }

    if (errors.length > 0) {
      return {
        // errors: errors,   // key name is arbitrary, can be different
        errors, // shortened: just 'errors'
      };
    }

    return { errors: null }; // if we have no errors in array.
  }

  // adding new hook after the signupAction-function; the hook has the signupAction-function as 1st argument:
  // useActionState - a hook that manages some form-related state:
  // 2nd argument = initial state: { errors: null }
  const [formState, formAction, pending] = useActionState(signupAction, { errors: null });
  // useActionState returns an array with 3 elements:
  // 1st item in array = formState - initial state; values returned in the 1st hook run -> { errors: null }
  // 2nd item in array = an updated formAction; it is set as a value here: <form action={formAction}>
  // 3rd item in array = pending - it can be true or false, depending on if the form is currently being submitted or not.

  return (
    // <form onSubmit={handleSubmit}>  -> instead, we can add function handleSubmit to the 'action'-prop:
    // <form action={signupAction}>
    <form action={formAction}>
      <h2>Welcome on board!</h2>
      <p>We just need a little bit of data from you to get you started 🚀</p>

      <div className="control">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
      </div>

      <div className="control-row">
        <div className="control">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" />
        </div>

        <div className="control">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            name="confirm-password"
          />
        </div>
      </div>

      <hr />

      <div className="control-row">
        <div className="control">
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" name="first-name" />
        </div>

        <div className="control">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" name="last-name" />
        </div>
      </div>

      <div className="control">
        <label htmlFor="phone">What best describes your role?</label>
        <select id="role" name="role">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="employee">Employee</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>
      </div>

      <fieldset>
        <legend>How did you find us?</legend>
        <div className="control">
          <input
            type="checkbox"
            id="google"
            name="acquisition"
            value="google"
          />
          <label htmlFor="google">Google</label>
        </div>

        <div className="control">
          <input
            type="checkbox"
            id="friend"
            name="acquisition"
            value="friend"
          />
          <label htmlFor="friend">Referred by friend</label>
        </div>

        <div className="control">
          <input type="checkbox" id="other" name="acquisition" value="other" />
          <label htmlFor="other">Other</label>
        </div>
      </fieldset>

      <div className="control">
        <label htmlFor="terms-and-conditions">
          <input type="checkbox" id="terms-and-conditions" name="terms" />I
          agree to the terms and conditions
        </label>
      </div>

      {/* // conditionally outputting some error messages:  */}
      {formState.errors && <ul className="error">
        {formState.errors.map(error => <li key={error}>{error}</li>)}
      </ul> }

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button className="button">Sign up</button>
      </p>
    </form>
  );
}
