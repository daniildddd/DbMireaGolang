export default function SubmitButton({ formId }: { formId: string }) {
  return (
    <button type="submit" form={formId} className="button submit important">
      Применить
    </button>
  );
}
