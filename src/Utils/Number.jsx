// Define functions in the module

function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

function formatAmount(a) {
  return isValid(a)
    ? Number(a).toLocaleString(undefined, {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      })
    : a;
}

// --- End of functions definition ---

// Load functions through `onLoad` callback
function exportFunctions(functions) {
  const { onLoad } = props;
  if (onLoad && typeof onLoad === "function") {
    onLoad(functions);
  }
}

// Export functions
exportFunctions({
  isValid,
  formatAmount,
});

return <div style={{ display: "none" }} />;
