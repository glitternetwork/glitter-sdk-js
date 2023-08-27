export function highlightPrepare(fields: string[]) {
  const fieldsStr = fields.map(field => `"${field}"`).join(',');
  return `/*+ SET_VAR(full_text_option='{"highlight":{ "style":"html","fields":[${fieldsStr}]}}') */`;
}
