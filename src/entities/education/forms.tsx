import type { Education, Degree } from '@/entities/education/types';

export interface EducationFormProps {
  education?: Education;
  degrees: Degree[];
}

/*export function EducationForm({ education, degrees }: EducationFormProps): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action, submit, setShouldSubmit, errors } = useFormValidation({
    schema: educationSchema,
    action: saveEducation.bind(null, user.id),
    onError: (errs) => {
      console.error(errs);
    },
  });

  const [degreeSearch, setDegreeSearch] = useState('');
  const degreeOptions = degrees
    .filter(
      (type) =>
        type.name.toLowerCase().startsWith(degreeSearch.toLowerCase()) ||
        type.id.toLowerCase().startsWith(degreeSearch.toLowerCase())
    )
    .map((type) => {
      return { id: type.id, value: type };
    });

  const submitOnChange = (
    field: keyof Education
  ): ((event: React.FormEvent<HTMLInputElement>) => void) => {
    return (event) => {
      if (!education || event.currentTarget.value !== education[field]) {
        submit();
      }
    };
  };

  return (
    <form action={action} id="edu-form" ref={formRef}>
      {education?.id ? <input defaultValue={education.id} name="id" type="hidden" /> : null}
      <Fieldset className="pt-8">
        <Legend className="flex items-center gap-4">
          <span className="grow">Education</span>

          <Button className="place-self-end" color="brand">
            <PlusIcon /> Add degree
          </Button>
        </Legend>
        <FieldGroup>
          <Field>
            <Label>School/University</Label>
            <Input
              defaultValue={education?.school}
              name="school"
              onBlur={submitOnChange('school')}
            />
          </Field>
          <Field>
            <div className="grid grid-cols-10 gap-4">
              <Field className="col-span-3">
                <Label>Degree</Label>
                <Combobox
                  defaultValue={
                    degreeOptions.find((degree) => degree.id === education?.degree)?.value
                  }
                  displayValue={(value) => value?.name ?? ''}
                  name="degree"
                  onChange={() => {
                    setShouldSubmit(true);
                  }}
                  onQueryChange={(event) => {
                    setDegreeSearch(event.currentTarget.value);
                  }}
                  options={degreeOptions}
                />
              </Field>
              <Field className="col-span-6">
                <Label>Field of study</Label>
                <Input
                  defaultValue={education?.field_of_study}
                  name="field_of_study"
                  onBlur={submitOnChange('field_of_study')}
                />
              </Field>
              <Field className="col-span-1">
                <Label>GPA</Label>
                <Input
                  defaultValue={education?.gpa ?? undefined}
                  name="gpa"
                  onBlur={submitOnChange('gpa')}
                  pattern="\d(?:\.\d\d?)?"
                  type="text"
                />
              </Field>
            </div>
          </Field>
          <div className="flex items-center gap-4">
            <Field className="grow">
              <Label>Location</Label>
              <Input
                defaultValue={education?.location}
                name="location"
                onBlur={submitOnChange('location')}
              />
            </Field>
            <Field className="">
              <Label>Start Date</Label>
              <DatePicker
                defaultValue={education?.start_date ?? undefined}
                errors={errors?.fieldErrors.start_date}
                max={new Date()}
                multiColumn
                name="start_date"
                onChange={(date) => {
                  if (date !== education?.start_date) {
                    setShouldSubmit(true);
                  }
                }}
              />
            </Field>
            <Field className="">
              <Label>End Date</Label>
              <DatePicker
                defaultValue={education?.end_date ?? undefined}
                errors={errors?.fieldErrors.end_date}
                max={new Date()}
                min={education?.start_date ?? undefined}
                multiColumn
                name="end_date"
                onChange={(date) => {
                  if (date !== education?.end_date) {
                    setShouldSubmit(true);
                  }
                }}
              />
            </Field>
          </div>
          <ListField
            items={education?.highlights.map((highlight) => highlight.description) ?? []}
            label="Sholastic achievements"
            name="highlights"
            onChange={submit}
          />
        </FieldGroup>
      </Fieldset>
    </form>
  );
}
*/
