import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home'
import About from './components/About';
import Shop from './components/Shop';
import Market from './components/Market';
import Search from './components/Search';
import UserPage from './components/UserPage';
import ShopProduct from './components/shop-component/ProductPage';
import MarketProduct from './components/market-component/ProductPage';
import Register from './components/Register';
import {CookiesProvider} from 'react-cookie'

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/home' element={<><Header/><Home/></>}/>
            <Route path='/about' element={<><Header/><About/></>}/>
            <Route path='/shop' element={<><Header/><Shop/></>}/>
            <Route path='/market' element={<><Header/><Market/></>}/>
            <Route path='/search' element={<><Header/><Search/></>}/>
            <Route path='/user' element={<><Header/><UserPage/></>}/>
            <Route path='/shopproduct' element={<><Header/><ShopProduct/></>}/>
            <Route path='/marketproduct' element={<><Header/><MarketProduct/></>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
