import { FormBuilder, FormGroup } from "@angular/forms";

export const formFieldHasError = (form: FormGroup, path: string, errorCode: string) => {
  let result = form.get(path)?.hasError(errorCode.replace('!', ''));
  if (errorCode.startsWith('!')) {
    result = !result && form.get(path)?.invalid;
  }
  return result;
}
