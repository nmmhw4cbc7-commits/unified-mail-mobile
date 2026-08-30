export function validateComposeFields(to: string, subject: string, body: string) {
  return Boolean(to.trim() && subject.trim() && body.trim());
}
