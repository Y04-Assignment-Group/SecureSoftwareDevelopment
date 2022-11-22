import { object, string } from "yup";

const sqlInjectionRegex = /^([a-zA-Z0-9 _-]+)$/;

export const messageSchema = object({
  message: string()
    .required("Message is required")
    .max(2000)
    .matches(sqlInjectionRegex, "Invalid message format. Suspicious message detected"),
});
