import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import Button from "../../atoms/Button/Button";
import styles from "./Register.module.css";

import EmailField, { emailValidation } from "../../molecules/FormField/EmailField/EmailField";
import PasswordField, { passwordValidation } from "../../molecules/FormField/PasswordField/PasswordField";
import ConfirmPasswordField, { confirmPasswordValidation } from "../../molecules/FormField/ConfirmPasswordField/ConfirmPasswordField";
import FullNameField, { fullNameValidation } from "../../molecules/FormField/FullNameField/FullNameField";

// Define the shape of form values
interface SignUpValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  onSubmit: (
    values: SignUpValues,
    formikHelpers: FormikHelpers<SignUpValues>
  ) => void | Promise<void>;
}

const initialValues: SignUpValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  fullName: fullNameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation("password"),
});

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={true}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form} noValidate>
          <FullNameField name="fullName" />
          <EmailField name="email" />
          <PasswordField name="password" />
          <ConfirmPasswordField name="confirmPassword" passwordFieldName="password" />

          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;