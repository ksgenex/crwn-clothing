import { createSelector } from "reselect";

const selectCollection = (state) => state.shop;

export const selectCollectionSections = createSelector(
  [selectCollection],
  (shop) => shop.collections
);
