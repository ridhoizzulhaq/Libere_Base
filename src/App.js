import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import Items from './pages/Items';
import PurchaseItem from './pages/PurchaseItem';
import PurchaseButtonPage from './pages/PurchaseButtonPage';
import Bookshelf from './pages/Bookshelf';
import MyLibraryItem from './pages/MyLibraryItem';
import EpubReader from './pages/EpubReader';
import OpenLibrary from './pages/OpenLibrary';
import { Container } from 'react-bootstrap';
import { Web3Provider } from './components/Web3Provider';

function AppContent() {
    return (
        <>
            <Header />
            <Container fluid>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-item" element={<CreateItem />} /> {/* New CreateItem Route */}
                    <Route path="/items" element={<Items />} />
                    <Route path="/bookshelf" element={<Bookshelf />} />
                    <Route path="/mylibraryitem" element={<MyLibraryItem />} />
                    <Route path="/openlibrary" element={<OpenLibrary />} />
                    <Route path="/epub-reader/:tokenId" element={<EpubReader />} />
                    
                    {/* Public Routes */}
                    <Route path="/purchase/:id" element={<PurchaseItem />} />
                    <Route path="/purchase/:id/iframe" element={<PurchaseButtonPage />} />
                </Routes>
            </Container>
        </>
    );
}

function App() {
    return (
        <Web3Provider>
            <Router>
                <AppContent />
            </Router>
        </Web3Provider>
    );
}

export default App;
