import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import moment from 'moment';

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/items`); // Fetch all items without filtering by account
                const formattedItems = await Promise.all(
                    response.data.map(async item => {
                        try {
                            const metadataResponse = await axios.get(item.metadata_uri);
                            const metadata = metadataResponse.data;

                            return {
                                ...item,
                                price: parseFloat(item.price).toFixed(4),
                                royalty: Math.round(parseFloat(item.royalty) / 100),
                                metadata,
                                formattedTimestamp: moment(item.timestamp).format('MMMM Do YYYY, h:mm:ss a')
                            };
                        } catch (metadataError) {
                            console.error(`Failed to fetch metadata for token_id ${item.token_id}:`, metadataError);
                            return {
                                ...item,
                                price: parseFloat(item.price).toFixed(4),
                                royalty: Math.round(parseFloat(item.royalty) / 100),
                                metadata: null,
                                formattedTimestamp: moment(item.timestamp).format('MMMM Do YYYY, h:mm:ss a')
                            };
                        }
                    })
                );
                setItems(formattedItems);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllItems();
    }, []);

    const handleViewDetails = (token_id) => {
        const newTabUrl = `/purchase/${token_id}`;
        window.open(newTabUrl, '_blank');
    };

    return (
        <Container>
            {/* Custom Jumbotron */}
            <div className="p-5 mb-4 bg-light rounded-3 text-center">
                <h1 className="display-5">Buy Your NFT Book</h1>
                <p className="lead">Explore and purchase NFT books directly from our marketplace.</p>
            </div>

            <h2>Available Items:</h2>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="row">
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.token_id} className="col-md-4 d-flex">
                                <Card className="mb-4 flex-fill" style={{ height: '100%' }}>
                                    <Card.Img
                                        variant="top"
                                        src={item.metadata && item.metadata.image ? item.metadata.image : 'path/to/default-image.jpg'}
                                        alt={item.metadata ? item.metadata.name : 'Default'}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{item.metadata ? item.metadata.name : 'No title available'}</Card.Title>
                                        <Card.Text>
                                            <strong>ID:</strong> {item.token_id}<br />
                                            {item.metadata ? (
                                                <>
                                                    <strong>Description:</strong> {item.metadata.description}<br />
                                                </>
                                            ) : (
                                                <strong>No metadata available</strong>
                                            )}
                                            <strong>Price:</strong> {item.price} $ETH<br />
                                            <strong>Author: Andy.base.ETH </strong> {item.recipient}<br />
                                            <strong>Royalty:</strong> {item.royalty}%<br />
                                            <strong>Date Added:</strong> {item.formattedTimestamp}
                                        </Card.Text>
                                        <Button
                                            onClick={() => handleViewDetails(item.token_id)}
                                            variant="primary"
                                            className="w-100 mb-2"
                                        >
                                            Buy NFT
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <p>No items found</p>
                    )}
                </div>
            )}
        </Container>
    );
}

export default Home;
