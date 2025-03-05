export const applyFilters = (
  parentTableData,
  selectedCategory,
  selectedSubCategory,
  searchValue
) => {
  let filteredData = parentTableData;

  if (selectedCategory !== "All") {
    filteredData = filteredData.filter(
      (item) => item.category === selectedCategory
    );
  }

  if (selectedSubCategory !== "All") {
    filteredData = filteredData.filter(
      (item) => item.subCategory === selectedSubCategory
    );
  }

  if (searchValue) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(([key, attr]) => {
        if (key === "sap" && typeof attr === "number") {
          const numericSearchValue = Number(searchValue);
          return !isNaN(numericSearchValue) && attr === numericSearchValue;
        }
        if (typeof attr === "string") {
          return attr.toLowerCase().includes(searchValue.toLowerCase());
        }
        if (typeof attr === "number") {
          const numericSearchValue = Number(searchValue);
          return !isNaN(numericSearchValue) && attr === numericSearchValue;
        }
        return false;
      })
    );
  }

  return filteredData;
};
