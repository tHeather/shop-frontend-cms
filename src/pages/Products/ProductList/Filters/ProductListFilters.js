import React from "react";
import { Formik } from "formik";
import {
  FILTER_TYPE,
  SORT_TYPES,
} from "../../../../components/constants/constants";
import {
  SelectField,
  StandardField,
} from "../../../../components/forms/fields/Fields";
import { submitFiltersActionCreator } from "../ProductListReducer";
import { StyledProductListFiltersForm } from "./ProductListFiltersStyles";
import { StyledButton } from "../../../../components/StyledComponents/Button";

const initialValues = {
  [FILTER_TYPE.type]: "",
  [FILTER_TYPE.isOnDiscount]: false,
  sortType: SORT_TYPES.nameAscending,
  search: "",
};

export default function ProductListFilters({ dispatch }) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => dispatch(submitFiltersActionCreator(values))}
    >
      {({ values, submitForm, setValues, setFieldTouched }) => {
        return (
          <StyledProductListFiltersForm onBlur={submitForm}>
            <SelectField
              name="sortType"
              label="Sort by:"
              onChange={({ target: { value } }) => {
                setValues({ ...values, sortType: value });
                setFieldTouched("sortType", true, false);
                submitForm();
              }}
              value={values.sortType}
            >
              <option value={SORT_TYPES.nameAscending}>Name ascending</option>
              <option value={SORT_TYPES.nameDescending}>Name descending</option>
              <option value={SORT_TYPES.quantityAscending}>
                Quantity ascending
              </option>
              <option value={SORT_TYPES.quantityDescending}>
                Quantity descending
              </option>
            </SelectField>
            <StandardField
              name={FILTER_TYPE.type}
              type="text"
              maxLength="150"
              label="Type of product"
            />
            <StandardField
              name={FILTER_TYPE.isOnDiscount}
              label="Is on discount"
              type="checkbox"
              onChange={({ target: { value } }) => {
                setValues({ ...values, [FILTER_TYPE.isOnDiscount]: value });
                setFieldTouched(FILTER_TYPE.isOnDiscount, true, false);
                submitForm();
              }}
            />
            <StandardField
              name="search"
              type="text"
              maxLength="150"
              placeholder="Search for a product..."
              label="Search"
            />
            <StyledButton type="submit">Search</StyledButton>
          </StyledProductListFiltersForm>
        );
      }}
    </Formik>
  );
}
