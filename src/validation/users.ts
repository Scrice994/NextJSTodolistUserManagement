import * as yup from "yup";

const usernameSchema = yup.string()
    .max(20)
    .matches(/^[a-zA-Z0-9_]*$/);

const emailSchema = yup.string().email();

const passwordSchema = yup.string()
    .matches(/^(?!.* )/)
    .min(6);

const tenantIdSchema = yup.string()
    .max(30)
    .matches(/^[a-zA-Z0-9_]*$/);

export const signupSchema = yup.object({
    body: yup.object({
        username: usernameSchema.required(),
        email: emailSchema.required(),
        password: passwordSchema.required(),
        tenantId: tenantIdSchema
    })
});

export type SignUpBody = yup.InferType<typeof signupSchema>["body"];

export const logInSchema = yup.object({
    body: yup.object({
        username: usernameSchema.required(),
        password: passwordSchema.required()
    })
})

export type LogInSchema = yup.InferType<typeof logInSchema>["body"];