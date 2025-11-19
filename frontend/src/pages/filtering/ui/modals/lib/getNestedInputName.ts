export default function getNestedInputName<keyNames = string>(
  parentInputName: string,
  index: number,
  inputName: keyNames
) {
  return `${parentInputName}.${index},${inputName}`;
}
