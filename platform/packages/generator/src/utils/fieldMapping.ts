export function fieldTsType(field: any): string {
  switch (field.type) {
    case "string":
    case "text":
    case "relation":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "date":
      return "string";
    default:
      return "unknown";
  }
}

export function fieldZodType(field: any): string {
  switch (field.type) {
    case "string":
    case "text":
      return "z.string()";
    case "number":
      return "z.coerce.number()";
    case "boolean":
      return "z.boolean()";
    case "date":
      return "z.string()";
    case "relation":
      return "z.string()";
    default:
      return "z.any()";
  }
}

export function prismaScalarType(field: any): string {
  switch (field.type) {
    case "string":
    case "text":
      return "String";
    case "number":
      return "Float";
    case "boolean":
      return "Boolean";
    case "date":
      return "DateTime";
    default:
      return "String";
  }
}

export function defaultFrontendInputType(field: any): string {
  switch (field.type) {
    case "number":
      return "number";
    case "date":
      return "date";
    case "boolean":
      return "checkbox";
    default:
      return "text";
  }
}
