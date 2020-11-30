import './App.css';
import Search from './components/search'
import Layout from './components/layout'

function App() {
  return (
    <div className="App">
      <Layout>
        <Search></Search>
      </Layout>
    </div>
  );
}

export default App;
