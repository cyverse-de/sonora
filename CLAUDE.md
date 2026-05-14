# sonora project guidelines

* Build forms with `formik` plus the field components in `components/forms/`
  (`FormTextField`, `FormSwitch`, etc.). Don't hand-roll form state or
  validation wiring.
* Use `components/table/TableLoading` for table loading states so column
  headers stay visible while data loads.
* Keep i18n locale JSON keys (`public/static/locales/**`) sorted
  alphabetically.
