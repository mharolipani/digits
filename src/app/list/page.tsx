import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Contact, Note } from '@prisma/client';
import ContactCard from '@/components/ContactCard';
import { prisma } from '@/lib/prisma';

/** Render a list of contacts for the logged-in user. */
const ListPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const owner = session?.user?.email || '';

  const contacts: (Contact & { notes: Note[] })[] = await prisma.contact.findMany({
    where: { owner },
    include: { notes: true },
  });

  const notes = await prisma.note.findMany({
    where: { owner },
  });

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center">Contacts</h1>
              <Row xs={1} md={2} lg={3} className="g-4">
                {contacts.map((contact) => (
                  <Col key={contact.id}>
                    <ContactCard
                      contact={contact}
                      notes={notes.filter(note => note.contactId === contact.id)}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
  );
};

export default ListPage;
