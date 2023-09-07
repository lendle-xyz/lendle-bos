// Define functions in the module

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return [
    d.getFullYear(),
    ("0" + (d.getMonth() + 1)).slice(-2),
    ("0" + d.getDate()).slice(-2),
  ].join("/");
}

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  const time = [
    ("0" + d.getHours()).slice(-2),
    ("0" + d.getMinutes()).slice(-2),
    ("0" + d.getSeconds()).slice(-2),
  ].join(":");
  return formatDate(timestamp) + " " + time;
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
  formatDate,
  formatDateTime,
});

return <div style={{ display: "none" }} />;
