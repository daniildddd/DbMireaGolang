import useNotifications from "@/shared/lib/hooks/useNotifications";
import { useCurrentTableSchema } from "@/shared/lib/hooks/useTableSchema";
import { Select } from "@/shared/ui/components/Inputs";
import Loading from "@/shared/ui/components/Loading/Loading";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function FieldNameSelector({
  register,
  multiple = false,
  name = "fieldName",
  errors,
}: {
  register: UseFormRegister<any>;
  multiple?: boolean;
  name?: string;
  errors: FieldErrors<FormData>;
}) {
  const { data, isPending, error } = useCurrentTableSchema();
  const notifier = useNotifications();

  if (isPending) return <Loading />;

  if (error) {
    notifier.error(error);
    return;
  }

  return (
    <Select
      name={name}
      multiple={multiple}
      register={register}
      errors={errors}
      defaultValue={data[0].name}
    >
      {data && data.length > 0 ? (
        data.map((field) => (
          <option
            value={field.name}
            key={field.name + field.type}
          >{`${field.name} (${field.type})`}</option>
        ))
      ) : (
        <option value="">Загрузка полей...</option>
      )}
    </Select>
  );
}
