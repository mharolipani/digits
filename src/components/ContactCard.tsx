'use client';

import { Image, Card } from 'react-bootstrap';

export interface Contact {
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description: string;
}

const ContactCard = ({ firstName, lastName, address, image, description }: Contact) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={image} alt={`${firstName} ${lastName}`} width="75" />
    </Card.Header>
    <Card.Body>
      <Card.Title>
        {firstName}
        {lastName}
      </Card.Title>
      <Card.Subtitle>{address}</Card.Subtitle>
      <Card.Text>{description}</Card.Text>
    </Card.Body>
  </Card>
);

export default ContactCard;
