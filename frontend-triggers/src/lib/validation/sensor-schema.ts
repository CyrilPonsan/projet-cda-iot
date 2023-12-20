import { z } from "zod";

import { regexGeneric } from "../regex";

export const sensorSchema = z.object({
  name: z
    .string({ required_error: "Le nom de la plante est obligatoire." })
    .regex(regexGeneric, {
      message: "Le nom de la plante contient des caractères invalides.",
    }),
  threshold: z
    .number({
      required_error: "Le taux d'humidité minimum est obligatoire.",
      invalid_type_error:
        "Le taux d'humidité minimum doit être un nombre entier.",
    })
    .gte(0, {
      message: "Le taux d'humidité minimum doit être supérieur ou égal à 0.",
    })
    .lte(100, {
      message: "Le taux d'humidité minimum doit être inférieur ou égal à 100.",
    }),
});
