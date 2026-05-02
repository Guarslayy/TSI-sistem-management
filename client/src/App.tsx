import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Organization from './pages/Organization';
import Assets from './pages/Assets';
import Threats from './pages/Threats';
import RiskAssessment from './pages/RiskAssessment';
import QuantitativeRisk from './pages/QuantitativeRisk';
import RiskMatrix from './pages/RiskMatrix';
import Controls from './pages/Controls';
import Iso27001Checklist from './pages/Iso27001Checklist';
import Iso27001Result from './pages/Iso27001Result';
import Policies from './pages/Policies';
import Report from './pages/Report';

function App() {
  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom sticky-top">
        <Container fluid="lg">
          <Navbar.Brand as={Link} to="/">ISO CyberSecurity</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto small">
              <Nav.Link as={Link} to="/organization">Organization</Nav.Link>
              <Nav.Link as={Link} to="/assets">Assets</Nav.Link>
              <Nav.Link as={Link} to="/threats">Threats</Nav.Link>
              <Nav.Link as={Link} to="/risk-assessment">ISO 27005</Nav.Link>
              <Nav.Link as={Link} to="/controls">Controls</Nav.Link>
              <Nav.Link as={Link} to="/policies">Policies</Nav.Link>
              <Nav.Link as={Link} to="/report">Report</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="py-4">
        <Container fluid="lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/risk-assessment" element={<RiskAssessment />} />
            <Route path="/iso27005-checklist" element={<RiskAssessment />} />
            <Route path="/quantitative-risk" element={<QuantitativeRisk />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
            <Route path="/controls" element={<Controls />} />
            <Route path="/iso27001-checklist" element={<Iso27001Checklist />} />
            <Route path="/iso27001-result" element={<Iso27001Result />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
