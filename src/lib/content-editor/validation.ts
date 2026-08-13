import { isSlugFormat } from "@/lib/build-editor/slug";
import { URL_OR_PLACEHOLDER } from "@/lib/content-editor/media-input";

export type EditorErrors = Record<string, string>;

export function hasErrors(errors: EditorErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function checkRequired(
  errors: EditorErrors,
  field: string,
  value: string,
  label: string,
  required = true
) {
  if (required && !value) errors[field] = `${label} is required.`;
}

export function checkMaxLength(
  errors: EditorErrors,
  field: string,
  value: string,
  label: string,
  max: number
) {
  if (value.length > max) {
    errors[field] = `${label} must be ${max} characters or fewer.`;
  }
}

export function checkSlug(
  errors: EditorErrors,
  field: string,
  value: string,
  label = "Slug"
) {
  if (!value) return;
  if (!isSlugFormat(value)) {
    errors[field] = "Use lowercase letters, numbers and dashes only.";
  } else {
    checkMaxLength(errors, field, value, label, 80);
  }
}

export function checkUrlOptional(
  errors: EditorErrors,
  field: string,
  value: string,
  label = "URL"
) {
  if (!value) return;
  if (!URL_OR_PLACEHOLDER.test(value)) {
    errors[field] = `${label} must be an https:// URL or empty.`;
  }
}

export function checkIntegerRange(
  errors: EditorErrors,
  field: string,
  value: string,
  min: number,
  max: number,
  label: string
) {
  if (value === "") return;
  if (!/^\d+$/.test(value)) {
    errors[field] = `${label} must be a whole number.`;
    return;
  }
  const number = Number(value);
  if (number < min || number > max) {
    errors[field] = `Use a value between ${min} and ${max}.`;
  }
}

export function checkStringList(
  errors: EditorErrors,
  prefix: string,
  items: string[],
  opts: { max: number; maxItemLength: number; label: string }
) {
  const trimmed = items.map((item) => item.trim());
  if (trimmed.length > opts.max) {
    errors[prefix] = `At most ${opts.max} items allowed.`;
  }
  for (let i = 0; i < trimmed.length; i++) {
    if (!trimmed[i]) {
      errors[`${prefix}.${i}`] = "Remove empty entries.";
    } else if (trimmed[i].length > opts.maxItemLength) {
      errors[`${prefix}.${i}`] = `Keep it under ${opts.maxItemLength} characters.`;
    }
  }
}

export function checkPairList(
  errors: EditorErrors,
  prefix: string,
  items: { first: string; second: string }[],
  opts: { max: number; maxFirstLength: number; maxSecondLength: number; labels: [string, string] }
) {
  const trimmed = items.map((item) => ({
    first: item.first.trim(),
    second: item.second.trim(),
  }));
  if (trimmed.length > opts.max) {
    errors[prefix] = `At most ${opts.max} items allowed.`;
  }
  for (let i = 0; i < trimmed.length; i++) {
    const item = trimmed[i];
    if (!item.first || !item.second) {
      errors[`${prefix}.${i}`] = "Fill in both fields or remove the entry.";
    } else {
      if (item.first.length > opts.maxFirstLength) {
        errors[`${prefix}.${i}`] =
          `${opts.labels[0]} must be ${opts.maxFirstLength} characters or fewer.`;
      } else if (item.second.length > opts.maxSecondLength) {
        errors[`${prefix}.${i}`] =
          `${opts.labels[1]} must be ${opts.maxSecondLength} characters or fewer.`;
      }
    }
  }
}