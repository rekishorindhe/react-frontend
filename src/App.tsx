import "./App.css";
import CustomForm from "./components/Form";
import NestedTable from "./components/NestedTable";
import CustomTable from "./components/Table";

function App() {
  return (
    <div className="m-3">
      {/* <Flex  align="center" vertical={true}> */}
        <CustomTable />
        <NestedTable />
        <CustomForm/>
      {/* </Flex> */}
    </div>
  );
}

export default App;
