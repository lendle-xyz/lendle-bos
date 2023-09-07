// `modules` are a map from module name to component path who must have an `onLoad` callback props that return functions
// `onLoad` needs to be defined in the parent component for receiving the loaded functions
const { modules, onLoad } = props;

State.init({
  modules: {},
});

// Import functions from modules
function importFunctions(name, functions) {
  const modules = state.modules;
  if (!modules[name]) {
    modules[name] = functions;
    State.update({
      modules,
    });
  }
  // invoke `onLoad` if all modules are ready
  if (
    Object.keys(state.modules).length === Object.keys(modules).length &&
    onLoad &&
    typeof onLoad === "function"
  ) {
    onLoad(state.modules);
  }
}

const importedModules = !modules ? (
  <div />
) : (
  <>
    {Object.entries(modules).map(([name, path]) => (
      <Widget
        src={path}
        props={{ onLoad: (functions) => importFunctions(name, functions) }}
      />
    ))}
  </>
);

return <div style={{ display: "none" }}>{importedModules}</div>;
