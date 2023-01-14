import { waitForObject } from "$common/utils";
import { ArgumentEntry, ArgumentEntrySetter } from "./CustomArgumentManager";

/** Constructed based on Svelte documentation: https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component */
type CreateComponentOptions = {
  target: Element | HTMLElement;
  anchor?: Element | HTMLElement;
  props: {};
}

export type CustomArgumentUIConstructor = (options: CreateComponentOptions) => void;

export const renderToDropdown = async (
  compononentConstructor: CustomArgumentUIConstructor,
  setter: ArgumentEntrySetter,
  current: ArgumentEntry
) => {
  const dropdownContainerClass = "blocklyDropDownContent";
  const elements = document.getElementsByClassName(dropdownContainerClass);
  if (elements.length !== 1) return console.error(`Uh oh! Expected 1 element with class '${dropdownContainerClass}', but found ${elements.length}`);
  const [target] = elements;
  const anchor = await waitForObject(() => target.children[0]);
  const props = { setter, current };
  const component = new compononentConstructor({ target, anchor, props });
  centerDropdownButton(anchor);
}

const centerDropdownButton = (container: Element) => {
  type ClassAndStyleModification = [string, (syle: CSSStyleDeclaration) => void];

  const findElementAndModifyStyle = ([className, styleMod]: ClassAndStyleModification) => {
    const elements = container.getElementsByClassName(className);
    console.assert(elements.length === 1, `Incorrect number of elements found with class: ${className}`);
    styleMod((elements[0] as HTMLElement).style);
  };

  const elements = [
    [
      "goog-menuitem goog-option",
      (style) => {
        style.margin = "auto";
        style.paddingLeft = style.paddingRight = "0px";
      }
    ],
    [
      "goog-menuitem-content",
      (style) => style.textAlign = "center"
    ]
  ] satisfies ClassAndStyleModification[];

  elements.forEach(findElementAndModifyStyle);
}