/**
 * DOM id for one option inside a listbox.
 *
 * A combobox's `aria-activedescendant` has to reference the active option *element* by
 * id, which means the input and the list must agree on how that id is built. This is the
 * single place that decides — both {@link SearchField} and {@link SearchOptionList} call
 * it rather than formatting ids themselves.
 */
export function optionDomId(listboxId: string, optionId: string): string {
  return `${listboxId}-option-${optionId}`;
}
