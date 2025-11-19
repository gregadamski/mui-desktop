import { Desktop } from "./components/system/Desktop";
import { REGISTRY } from "./config/registry";

const App = () => {
    return <Desktop registry={REGISTRY} />;
};

export default App;
