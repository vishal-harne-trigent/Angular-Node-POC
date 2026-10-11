import { ApiBody } from "@nestjs/swagger";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { z, ZodType } from "zod";

/** Documents a request body from the same Zod schema the route validates with. */
export const ZodApiBody = (schema: ZodType) => {
    const { $schema, ...jsonSchema } = z.toJSONSchema(schema, { io: "input", unrepresentable: "any" });
    return ApiBody({ schema: jsonSchema as SchemaObject });
};
