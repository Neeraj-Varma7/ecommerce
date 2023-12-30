import { Container } from "react-bootstrap";
import Header1 from "./components/Header1";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header1 />
      <main className='py-3'>
        <Container>
          <Outlet/>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
