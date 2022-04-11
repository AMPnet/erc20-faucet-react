import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Faucet from './components/Faucet.js'
import USDC from './artifacts/contracts/USDC.sol/USDC.json'

import { Container, Row, Col, Card } from 'react-bootstrap'

function App() {

  const Token = USDC;

  return (
    <div className="App">
      <div className="card-wrapper">
        <Card.Body>
          <Container>
            <Row className="justify-content-md-center">
              <Col>
                <Faucet  tokenContract={Token}/>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </div>
    </div>
  );
}

export default App;
